from fastapi import APIRouter
from db import posts_col, users_col
from bson import ObjectId
from fastapi import File, Form, UploadFile, HTTPException
import base64

router = APIRouter()

@router.get("/all")
def get_all_public_posts():
    posts = posts_col.find()
    result = []
    for post in posts:
        print("voici l'image" + base64.b64encode(post["image"]).decode("utf-8"))
        user = users_col.find_one({"_id": post["user_id"]})
        result.append({
            "id": str(post["_id"]),
            "image": base64.b64encode(post["image"]).decode("utf-8"),  # base64 encode the image
            "caption": post["caption"],
            "username": user["username"] if user else "Inconnu",
            "image_id": post["image_id"]
        })
    return result

@router.post("/add")
async def add_post(user_id: str = Form(...), caption: str = Form(...), image: UploadFile = File(...), image_id=Form(...)):
    try:
        content = await image.read()
        posts_col.insert_one({
            "image_id": image_id,
            "user_id": ObjectId(user_id),
            "caption": caption,
            # "is_private": is_private,
            "image": content
        })
        return {"message": "Publication ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de l'ajout du post")
