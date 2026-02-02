from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class MatchingEngine:
    @staticmethod
    def compute_similarity(embedding1, embedding2):
        """
        Compute cosine similarity between two vectors.
        input: list or np.array
        output: float score (0 to 1)
        """
        vec1 = np.array(embedding1).reshape(1, -1)
        vec2 = np.array(embedding2).reshape(1, -1)
        
        return float(cosine_similarity(vec1, vec2)[0][0])

    @staticmethod
    def calculate_score(resume_data, job_data, weights=None):
        """
        Calculate a weighted score for a candidate against a job.
        weights: dict {'similarity': 0.7, 'skills': 0.3}
        """
        if weights is None:
            weights = {'similarity': 0.7, 'skills': 0.3}

        # 1. Semantic Similarity (Contextual Match)
        sem_score = MatchingEngine.compute_similarity(resume_data['embedding'], job_data['embedding'])
        
        # 2. Skill Overlap (Exact Match)
        resume_skills = set([s.lower() for s in resume_data.get('skills', [])])
        job_skills = set([s.lower() for s in job_data.get('required_skills', [])])
        
        if len(job_skills) > 0:
            skill_match_count = len(resume_skills.intersection(job_skills))
            skill_score = skill_match_count / len(job_skills)
        else:
            skill_score = 0.0

        # Weighted Final Score
        final_score = (sem_score * weights['similarity']) + (skill_score * weights['skills'])
        
        return {
            "total_score": round(final_score, 4),
            "semantic_score": round(sem_score, 4),
            "skill_score": round(skill_score, 4),
            "matched_skills": list(resume_skills.intersection(job_skills))
        }
