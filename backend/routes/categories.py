from flask import Blueprint, request, jsonify
from app import db
from models import Category

categories_bp = Blueprint("categories", __name__)


def ok(data=None, message="success", code=0):
    return jsonify(code=code, data=data, message=message), 200


def fail(message, code=1, status=400):
    return jsonify(code=code, data=None, message=message), status


# --- GET /api/categories ---
@categories_bp.route("/", methods=["GET"])
def list_categories():
    categories = Category.query.order_by(Category.id).all()
    result = [{"id": c.id, "name": c.name} for c in categories]
    return ok(result)


# --- POST /api/categories ---
@categories_bp.route("/", methods=["POST"])
def create_category():
    data = request.get_json(silent=True)
    if not data:
        return fail("Request body must be JSON")

    name = (data.get("name") or "").strip()
    if not name:
        return fail("Category name is required")

    exists = Category.query.filter_by(name=name).first()
    if exists:
        return fail(f"Category '{name}' already exists")

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()

    return ok({"id": category.id, "name": category.name}, message="Category created")
