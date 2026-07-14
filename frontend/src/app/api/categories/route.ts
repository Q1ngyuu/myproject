import { NextRequest, NextResponse } from "next/server";
import { initStore, getCategoryList, createCategory } from "@/lib/store";

initStore();

export async function GET() {
  return NextResponse.json({ code: 0, data: getCategoryList(), message: "success" });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const name = (data.name || "").trim();
    if (!name) {
      return NextResponse.json({ code: 1, data: null, message: "Category name is required" }, { status: 400 });
    }

    const category = createCategory(name);
    if (!category) {
      return NextResponse.json({ code: 1, data: null, message: `Category '${name}' already exists` }, { status: 400 });
    }

    return NextResponse.json({ code: 0, data: category, message: "Category created" });
  } catch {
    return NextResponse.json({ code: 1, data: null, message: "Request body must be JSON" }, { status: 400 });
  }
}
