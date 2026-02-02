import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("mongodb+srv://pushkarsagar:pushkar@cluster0.ynrzndk.mongodb.net/", "mongodb://localhost:27017/resume_screener")
    MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

