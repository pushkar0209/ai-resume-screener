import requests
import numpy as np
import os
from backend.config import Config

class ResumeEmbedder:
    def __init__(self):
        self.api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
        # Use existing env var or fallback. Ideally user provides HUGGINGFACE_API_KEY
        self.headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY', '')}"}
        print("Initialized HF Inference Embedder")

    def get_embedding(self, text):
        """
        Generates a 384-dimensional embedding using HF Inference API.
        Falls back to random vector if API fails (for demo stability without key).
        """
        if not text:
            return np.zeros(384).tolist()
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json={"inputs": text, "options": {"wait_for_model": True}})
            if response.status_code == 200:
                # The API returns a list of vectors if inputs is list, or one vector if input is string?
                # Usually returns: [0.1, 0.2, ...] or [[0.1, ...]] depending on input
                data = response.json()
                if isinstance(data, list):
                    # Check if it's a list of list (batched) or just list (single)
                    if len(data) > 0 and isinstance(data[0], list):
                         return data[0]
                    return data
            print(f"HF API Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Embedding Error: {e}")
            
        # Fallback for demo/no-key scenarios
        print("Using fallback embedding (random)")
        return np.random.rand(384).tolist()
