import re

class EntityExtractor:
    def __init__(self):
        # Lightweight Regex Patterns
        self.skill_list = [
            "Python", "Java", "C++", "JavaScript", "React", "Flask", "Django",
            "Machine Learning", "Deep Learning", "NLP", "SQL", "NoSQL", "MongoDB",
            "Docker", "Kubernetes", "AWS", "Azure", "Git", "CI/CD", "Project Management",
            "Communication", "Leadership", "Next.js", "Tailwind CSS", "TypeScript"
        ]
        print("Initialized Regex Entity Extractor")

    def extract(self, text):
        """
        Extracts entities from text using simple keyword matching and regex.
        Returns a dict with classified entities.
        """
        entities = {
            "SKILL": [],
            "ORG": [],
            "PERSON": [],
            "GPE": [],
            "EDU": [],
            "EMAIL": []
        }
        
        # 1. Skills (Case-insensitive keyword match)
        text_lower = text.lower()
        for skill in self.skill_list:
            # Use regex to match exact word boundary
            if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
                 entities["SKILL"].append(skill)
                 
        # 2. Email (Regex)
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_pattern, text)
        if emails:
            entities["EMAIL"] = list(set(emails))
            
        # 3. Org/Edu (Simple Heuristic - Capitalized words after specific keywords)
        # This is very basic compared to Spacy but sufficient for a lightweight demo
        # e.g., "University of X", "Worked at Y"
        
        # 4. Person (Not easily done with regex reliably without NLP, skipping or using filename fallback)
        
        return entities
