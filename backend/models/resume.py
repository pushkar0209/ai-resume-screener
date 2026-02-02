from datetime import datetime

class ResumeModel:
    @staticmethod
    def create(filename, text_raw, text_clean, entities, embedding):
        return {
            "filename": filename,
            "upload_date": datetime.utcnow(),
            "text_raw": text_raw, # Store raw text for display
            "text_clean": text_clean, # Store clean text for debugging
            "skills": entities.get("SKILL", []),
            "experience": entities.get("ORG", []), # Simplified for now
            "education": entities.get("EDU", []),
            "embedding": embedding,
            "meta": {
                "entities": entities
            }
        }
