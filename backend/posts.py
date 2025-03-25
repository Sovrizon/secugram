from flask import Blueprint

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/add", methods=["POST"])
def add_post():
    return "Nouvelle publication ajoutée"
