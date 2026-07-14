import { NextRequest, NextResponse } from "next/server";
import { initStore, getPostList, createPost } from "@/lib/store";

initStore();

export async function GET() {
  return NextResponse.json({ code: 0, data: getPostList(), message: "success" });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const title = (data.title || "").trim();
    const content = (data.content || "").trim();

    if (!title) {
      return NextResponse.json({ code: 1, data: null, message: "Title is required" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ code: 1, data: null, message: "Content is required" }, { status: 400 });
    }

    const post = createPost({
      title,
      content,
      summary: data.summary || undefined,
      category_id: data.category_id ?? undefined,
    });
    return NextResponse.json({ code: 0, data: post, message: "Post created" }, { status: 200 });
  } catch {
    return NextResponse.json({ code: 1, data: null, message: "Request body must be JSON" }, { status: 400 });
  }
}
