from flask import Flask, request, jsonify, Blueprint
from werkzeug.utils import secure_filename
import os
from bson.objectid import ObjectId
from collections import Counter
from datetime import datetime, timedelta

from backend.database import db_instance
from backend.config import Config
from backend.nlp.parser import ResumeParser
from backend.nlp.cleaner import TextCleaner
from backend.nlp.ner import EntityExtractor
from backend.nlp.embedder import ResumeEmbedder
from backend.matching.engine import MatchingEngine
from backend.models.resume import ResumeModel
from backend.models.job import JobModel
from backend.nlp.summarizer import SmartSummarizer

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
from flask_cors import CORS
CORS(app)

# Initialize Global Components (Load models once)
print("Initializing NLP Components...")
extractor = EntityExtractor()
embedder = ResumeEmbedder()
print("Initialization Complete.")

# Connect to DB
db = db_instance.get_db()
resumes_col = db.resumes
jobs_col = db.jobs

# Create API Blueprint
api = Blueprint('api', __name__, url_prefix='/api')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@api.route('/upload-resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # 1. Parse
            raw_text = ResumeParser.parse(file_path)
            # 2. Clean
            clean_text = TextCleaner.clean_text(raw_text)
            norm_text = TextCleaner.normalize_for_embedding(raw_text)
            # 3. Extract Entities
            entities = extractor.extract(clean_text)
            # 4. Embed
            embedding = embedder.get_embedding(norm_text)
            
            # 5. Save to DB
            resume_data = ResumeModel.create(filename, raw_text, clean_text, entities, embedding)
            result = resumes_col.insert_one(resume_data)
            
            return jsonify({
                "message": "Resume processed successfully",
                "id": str(result.inserted_id),
                "extracted_skills": entities.get('SKILL', [])
            }), 201
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "File type not allowed"}), 400

@api.route('/add-job', methods=['POST'])
def add_job():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    required_skills = data.get('required_skills', []) # List of strings
    
    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400
    
    try:
        # Generate embedding for job description + title
        full_text = f"{title} {description}"
        norm_text = TextCleaner.normalize_for_embedding(full_text)
        embedding = embedder.get_embedding(norm_text)
        
        job_data = JobModel.create(title, description, required_skills, embedding)
        result = jobs_col.insert_one(job_data)
        
        return jsonify({
            "message": "Job added successfully",
            "id": str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/match-candidates/<job_id>', methods=['GET'])
def match_candidates(job_id):
    try:
        job = jobs_col.find_one({"_id": ObjectId(job_id)})
        if not job:
            return jsonify({"error": "Job not found"}), 404
            
        candidates = list(resumes_col.find({}))
        results = []
        
        for cand in candidates:
            score_data = MatchingEngine.calculate_score(cand, job)
            
            # Generate Smart Summary
            summary = SmartSummarizer.generate_summary(cand, job, score_data)
            
            results.append({
                "candidate_id": str(cand['_id']),
                "filename": cand['filename'],
                "skills": cand.get('skills', []),
                "match_score": score_data['total_score'],
                "details": score_data,
                "summary": summary
            })
            
        # Sort by score desc
        results.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            "job_title": job['title'],
            "candidates": results
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/candidates', methods=['GET'])
def list_candidates():
    candidates = resumes_col.find({}, {"embedding": 0, "text_raw": 0})
    res = []
    for c in candidates:
        c['_id'] = str(c['_id'])
        res.append(c)
    return jsonify(res), 200

@api.route('/candidates/<candidate_id>', methods=['GET'])
def get_candidate(candidate_id):
    try:
        candidate = resumes_col.find_one({"_id": ObjectId(candidate_id)}, {"embedding": 0})
        if not candidate:
            return jsonify({"error": "Candidate not found"}), 404
        
        candidate['_id'] = str(candidate['_id'])
        return jsonify(candidate), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/jobs', methods=['GET'])
def list_jobs():
    jobs = jobs_col.find({}, {"embedding": 0})
    res = []
    for j in jobs:
        j['_id'] = str(j['_id'])
        res.append(j)
    return jsonify(res), 200

@api.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        # 1. Skill Distribution (Top 10)
        all_resumes = list(resumes_col.find({}, {"skills": 1, "upload_date": 1}))
        all_skills = []
        for r in all_resumes:
            all_skills.extend(r.get('skills', []))
        
        skill_counts = Counter(all_skills).most_common(10)
        
        # 2. Activity / Stats
        total_candidates = len(all_resumes)
        total_jobs = jobs_col.count_documents({})
        
        return jsonify({
            "skill_distribution": [{"name": s[0], "value": s[1]} for s in skill_counts],
            "total_candidates": total_candidates,
            "total_jobs": total_jobs
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Register Blueprint
app.register_blueprint(api)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
