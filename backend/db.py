import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_URI = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@instalitre.3cjul.mongodb.net/"

client = MongoClient(MONGO_URI)
db = client["instalitre"]
users_col = db["users"]
posts_col = db["posts"]
