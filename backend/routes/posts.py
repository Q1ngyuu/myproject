from flask import Blueprint, request, jsonify
from app import db
from models import Post, Category

posts_bp = Blueprint("posts", __name__)


def ok(data=None, message="success", code=0):
    return jsonify(code=code, data=data, message=message), 200


def fail(message, code=1, status=400):
    return jsonify(code=code, data=None, message=message), status


# --- GET /api/posts ---
@posts_bp.route("/", methods=["GET"])
def list_posts():
    q = request.args.get("q", "").strip()
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 100, type=int)

    query = (
        db.session.query(
            Post.id,
            Post.title,
            Post.summary,
            Category.name.label("category_name"),
            Post.created_at,
        )
        .outerjoin(Category, Post.category_id == Category.id)
    )

    if q:
        query = query.filter(
            db.or_(
                Post.title.ilike(f"%{q}%"),
                Post.content.ilike(f"%{q}%"),
                Post.summary.ilike(f"%{q}%"),
                Category.name.ilike(f"%{q}%"),
            )
        )

    total = query.count()
    total_pages = max(1, (total + limit - 1) // limit)

    posts = (
        query
        .order_by(Post.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    result = [
        {
            "id": p.id,
            "title": p.title,
            "summary": p.summary,
            "category_name": p.category_name,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in posts
    ]

    return ok({
        "posts": result,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": total_pages,
    })


# --- GET /api/posts/<id> ---
@posts_bp.route("/<int:id>", methods=["GET"])
def get_post(id):
    post = Post.query.get(id)
    if not post:
        return fail("Post not found", status=404)

    result = {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "summary": post.summary,
        "category_id": post.category_id,
        "category_name": post.category.name if post.category else None,
        "created_at": post.created_at.isoformat() if post.created_at else None,
        "updated_at": post.updated_at.isoformat() if post.updated_at else None,
    }
    return ok(result)


# --- POST /api/posts ---
@posts_bp.route("/", methods=["POST"])
def create_post():
    data = request.get_json(silent=True)
    if not data:
        return fail("Request body must be JSON")

    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()

    if not title:
        return fail("Title is required")
    if not content:
        return fail("Content is required")

    post = Post(
        title=title,
        content=content,
        summary=(data.get("summary") or "").strip() or None,
        category_id=data.get("category_id"),
    )
    db.session.add(post)
    db.session.commit()

    return ok(
        {
            "id": post.id,
            "title": post.title,
            "summary": post.summary,
            "created_at": post.created_at.isoformat() if post.created_at else None,
        },
        message="Post created",
    )


# --- PUT /api/posts/<id> ---
@posts_bp.route("/<int:id>", methods=["PUT"])
def update_post(id):
    post = Post.query.get(id)
    if not post:
        return fail("Post not found", status=404)

    data = request.get_json(silent=True)
    if not data:
        return fail("Request body must be JSON")

    if "title" in data:
        title = (data["title"] or "").strip()
        if not title:
            return fail("Title cannot be empty")
        post.title = title

    if "content" in data:
        content = (data["content"] or "").strip()
        if not content:
            return fail("Content cannot be empty")
        post.content = content

    if "summary" in data:
        post.summary = (data["summary"] or "").strip() or None

    if "category_id" in data:
        post.category_id = data["category_id"]

    db.session.commit()

    return ok(
        {
            "id": post.id,
            "title": post.title,
            "summary": post.summary,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
        },
        message="Post updated",
    )


# --- DELETE /api/posts/<id> ---
@posts_bp.route("/<int:id>", methods=["DELETE"])
def delete_post(id):
    post = Post.query.get(id)
    if not post:
        return fail("Post not found", status=404)

    db.session.delete(post)
    db.session.commit()

    return ok(message="Post deleted")
