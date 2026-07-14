import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { code: 0, data: null, message: "Blog System API is running" },
    { status: 200 }
  );
}
