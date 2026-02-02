import re

class TextCleaner:
    @staticmethod
    def clean_text(text):
        """
        Cleans and normalizes text by removing special characters,
        extra whitespace, and converting to lowercase (optional, logic kept flexible).
        """
        if not text:
            return ""

        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove special characters but keep basic punctuation for sentence structure
        # Keeping @ for emails, + for phones
        text = re.sub(r'[^\w\s@.+\-]', '', text) 
        
        return text

    @staticmethod
    def normalize_for_embedding(text):
        """
        Prepare text for embedding models (lowercase, remove extensive punctuation).
        """
        text = TextCleaner.clean_text(text)
        return text.lower()
