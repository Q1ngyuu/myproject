import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# --- Config ---
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

database_url = os.getenv("DATABASE_URL", "sqlite:///blog.db")
# Railway provides postgres:// but SQLAlchemy needs postgresql://
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# --- Extensions ---
CORS(app)
db = SQLAlchemy(app)

# --- Routes ---

@app.route("/api/health")
def health():
    return jsonify(status="ok", message="Blog System API is running")


# --- Models ---
import models  # noqa: E402 F401 — ensure models are registered with SQLAlchemy

# --- Blueprints ---
from routes.posts import posts_bp
from routes.categories import categories_bp

app.register_blueprint(posts_bp, url_prefix="/api/posts")
app.register_blueprint(categories_bp, url_prefix="/api/categories")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
