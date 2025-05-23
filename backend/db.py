import os
from pymongo import MongoClient, errors
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    print("[INFO] Connexion à MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client["secugram"]
    print("[OK] Connexion établie.")
except errors.ConnectionFailure as e:
    print(f"[ERREUR] Échec de connexion : {e}")
    exit(1)

try:
    collections = db.list_collection_names()
    print(f"[INFO] Collections existantes : {collections}")

    if "users" not in collections:
        print("[INFO] Création de la collection 'users'...")
        db.create_collection("users")
        print("[OK] Collection 'users' créée.")

    if "posts" not in collections:
        print("[INFO] Création de la collection 'posts'...")
        db.create_collection("posts")
        print("[OK] Collection 'posts' créée.")

    users_col = db["users"]
    posts_col = db["posts"]
    print("[OK] Accès aux collections réussi.")

except errors.PyMongoError as e:
    print(f"[ERREUR] Problème lors de l'accès ou la création des collections : {e}")
    exit(1)
