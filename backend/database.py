from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from backend.config import Config

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        try:
            print(f"Attempting to connect to MongoDB: {Config.MONGO_URI}")
            self.client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=2000)
            # Check connection
            self.client.admin.command('ping')
            self.db = self.client.get_database()
            print(f"Connected to MongoDB: {Config.MONGO_URI}")
        except Exception as e:
            print(f"MongoDB Connection Failed: {e}")
            print("Falling back to IN-MEMORY MongoDB (mongomock)...")
            try:
                import mongomock
                self.client = mongomock.MongoClient()
                self.db = self.client.get_database('resume_screener')
                print("Connected to MongoMock (In-Memory). Data will not be persisted after restart.")
            except ImportError:
                print("Mongomock not installed. Please run `pip install mongomock`")
                raise e

    def get_db(self):
        if not self.db:
            self.connect()
        return self.db

    def close(self):
        if self.client:
            self.client.close()

db_instance = Database()
