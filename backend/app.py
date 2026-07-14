import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# --- Config ---
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///blog.db")
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
