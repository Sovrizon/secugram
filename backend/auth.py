from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from db import users_col
from utils import hash_password, verify_password, get_user
import os
import requests
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class UserIn(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(user: UserIn):
    if get_user(user.username):
        raise HTTPException(status_code=400, detail="Utilisateur déjà existant")
    users_col.insert_one({
        "username": user.username,
        "password": hash_password(user.password)
    })
    return {"message": "Inscription réussie"}

@router.post("/login")
def login(user: UserIn):
    db_user = get_user(user.username)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return {
        "message": "Connexion réussie",
        "user_id": str(db_user["_id"]),
        "username": db_user["username"]
    }

def create_vault_user(username: str, password: str):

    VAULT_ADDR = os.getenv("VAULT_ADDR")
    VAULT_TOKEN = os.getenv("VAULT_TOKEN")

    url = f"{VAULT_ADDR}/v1/auth/userpass/users/{username}"
    headers = {
        "X-Vault-Token": VAULT_TOKEN,
        "Content-Type": "application/json"
    }
    data = {
        "password": password,
        "policies": "viewer"  # à adapter selon ta config Vault
    }
    response = requests.post(url, headers=headers, json=data)
    if not response.ok:
        raise Exception(f"Erreur création utilisateur Vault: {response.text}")
