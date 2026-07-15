import { NextRequest, NextResponse } from "next/server";
import { initStore, getPostList, createPost } from "@/lib/store";

initStore();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const all = getPostList(q);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const posts = all.slice(start, start + limit);

  return NextResponse.json({
    code: 0,
    data: { posts, total, page, limit, totalPages },
    message: "success",
  });
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
