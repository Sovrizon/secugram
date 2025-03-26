from fastapi import APIRouter
from db import posts_col, users_col
from bson import ObjectId
from fastapi import File, Form, UploadFile, HTTPException
import base64
import os

router = APIRouter()

@router.get("/all")
def get_all_public_posts():
    posts = posts_col.find({"is_private": False})
    result = []
    for post in posts:
        user = users_col.find_one({"_id": post["user_id"]})
        # Vérifie si l’image semble chiffrée (par exemple si elle ne commence pas par les premiers octets typiques JPEG)
        raw_image = post["image"]
        jpeg_magic = b"\xff\xd8\xff"
        if raw_image.startswith(jpeg_magic):
            encoded_image = base64.b64encode(raw_image).decode("utf-8")
        else:
            # image chiffrée : retourne une miniature grise connue
            if os.path.exists("data/image_grisee.png"):
                with open("data/image_grisee.png", "rb") as f:
                    encoded_image = base64.b64encode(f.read()).decode("utf-8")
            else:
                raise HTTPException(status_code=500, detail="Placeholder image not found")
        result.append({
            "id": str(post["_id"]),
            "image": encoded_image,
            "caption": post["caption"],
            "username": user["username"] if user else "Inconnu"
        })
    return result

@router.post("/add")
async def add_post(user_id: str = Form(...), caption: str = Form(...), is_private: bool = Form(...), image: UploadFile = File(...)):
    try:
        content = await image.read()
        posts_col.insert_one({
            "user_id": ObjectId(user_id),
            "caption": caption,
            "is_private": is_private,
            "image": content
        })
        return {"message": "Publication ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de l'ajout du post")
