from datetime import datetime

class JobModel:
    @staticmethod
    def create(title, description, required_skills, embedding):
        return {
            "title": title,
            "created_at": datetime.utcnow(),
            "description": description,
            "required_skills": required_skills or [],
            "embedding": embedding
        }
