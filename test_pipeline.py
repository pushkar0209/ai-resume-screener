import sys
import os

# Ensure src can be imported
sys.path.append(os.getcwd())

from backend.nlp.cleaner import TextCleaner
from backend.nlp.ner import EntityExtractor
from backend.nlp.embedder import ResumeEmbedder
from backend.matching.engine import MatchingEngine
from backend.models.resume import ResumeModel
from backend.models.job import JobModel

def run_test():
    print("=== Starting System Verification ===")
    
    # 1. Initialize Components
    print("\n[1] Initializing Models (This may take a moment)...")
    extractor = EntityExtractor()
    embedder = ResumeEmbedder()
    
    # 2. Mock Data
    print("\n[2] Creating Mock Data...")
    resume_text = """
    Jane Doe
    jane.doe@example.com
    Experienced Software Engineer with 5 years of experience in Python, Flask, and React.
    Strong background in Machine Learning and NLP.
    Worked at Tech Corp leading backend development.
    Education: B.S. Computer Science.
    """
    
    job_description = "We are looking for a Senior AI Engineer with Python, NLP, and Flask skills."
    job_skills = ["Python", "NLP", "Flask", "Docker"]
    
    # 3. Process Resume
    print("\n[3] Processing Resume...")
    clean_text = TextCleaner.clean_text(resume_text)
    norm_text = TextCleaner.normalize_for_embedding(resume_text)
    entities = extractor.extract(clean_text)
    res_embed = embedder.get_embedding(norm_text)
    
    resume_data = ResumeModel.create("test_resume.pdf", resume_text, clean_text, entities, res_embed)
    print(f"   -> Extracted Skills: {resume_data['skills']}")
    print(f"   -> Embedding Shape: {len(resume_data['embedding'])}")
    
    # 4. Process Job
    print("\n[4] Processing Job...")
    job_norm = TextCleaner.normalize_for_embedding(job_description)
    job_embed = embedder.get_embedding(job_norm)
    job_data = JobModel.create("Senior AI Engineer", job_description, job_skills, job_embed)
    
    # 5. Matching
    print("\n[5] Running Matching Engine...")
    result = MatchingEngine.calculate_score(resume_data, job_data)
    
    print("\n=== Match Results ===")
    print(f"Total Score: {result['total_score']}")
    print(f"Semantic Score: {result['semantic_score']}")
    print(f"Skill Score: {result['skill_score']}")
    print(f"Matched Skills: {result['matched_skills']}")
    
    if result['total_score'] > 0.5:
        print("\nSUCCESS: System successfully matched relevant candidate!")
    else:
        print("\nWARNING: Score lower than expected, check embeddings.")

if __name__ == "__main__":
    run_test()
