from fastapi import APIRouter
from db import posts_col, users_col
from bson import ObjectId

router = APIRouter()

@router.get("/all")
def get_all_public_posts():
    posts = posts_col.find({"is_private": False})
    result = []
    for post in posts:
        user = users_col.find_one({"_id": post["user_id"]})
        result.append({
            "id": str(post["_id"]),
            "image": post["image"].decode("latin1"),  # base64-like for now
            "caption": post["caption"],
            "username": user["username"] if user else "Inconnu"
        })
    return result
