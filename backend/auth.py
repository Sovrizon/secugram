from flask import Blueprint, request, jsonify
from db import users_col
from utils import hash_password, verify_password, get_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Champs manquants"}), 400
    if get_user(username):
        return jsonify({"error": "Utilisateur déjà existant"}), 400
    users_col.insert_one({
        "username": username,
        "password": hash_password(password)
    })
    return jsonify({"message": "Inscription réussie"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = get_user(username)
    if not user or not verify_password(password, user["password"]):
        return jsonify({"error": "Identifiants invalides"}), 401
    return jsonify({
        "message": "Connexion réussie",
        "user_id": str(user["_id"]),
        "username": user["username"]
    })
