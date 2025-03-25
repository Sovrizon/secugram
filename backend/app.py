from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from posts import posts_bp

app = Flask(__name__)
CORS(app, origins="http://127.0.0.1:5173")


app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(posts_bp, url_prefix="/posts")

if __name__ == "__main__":
    app.run(debug=True)
