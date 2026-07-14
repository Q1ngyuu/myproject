import { NextRequest, NextResponse } from "next/server";
import { initStore, getPostById, updatePost, deletePost } from "@/lib/store";

initStore();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) {
    return NextResponse.json({ code: 1, data: null, message: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ code: 0, data: post, message: "success" });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) {
    return NextResponse.json({ code: 1, data: null, message: "Post not found" }, { status: 404 });
  }

  try {
    const data = await request.json();
    const title = data.title !== undefined ? (data.title || "").trim() : undefined;
    const content = data.content !== undefined ? (data.content || "").trim() : undefined;

    if (title === "") {
      return NextResponse.json({ code: 1, data: null, message: "Title cannot be empty" }, { status: 400 });
    }
    if (content === "") {
      return NextResponse.json({ code: 1, data: null, message: "Content cannot be empty" }, { status: 400 });
    }

    const updated = updatePost(Number(id), {
      title: title,
      content: content,
      summary: data.summary !== undefined ? data.summary : undefined,
      category_id: data.category_id ?? undefined,
    });
    return NextResponse.json({ code: 0, data: updated, message: "Post updated" });
  } catch {
    return NextResponse.json({ code: 1, data: null, message: "Request body must be JSON" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) {
    return NextResponse.json({ code: 1, data: null, message: "Post not found" }, { status: 404 });
  }

  deletePost(Number(id));
  return NextResponse.json({ code: 0, data: null, message: "Post deleted" });
}
