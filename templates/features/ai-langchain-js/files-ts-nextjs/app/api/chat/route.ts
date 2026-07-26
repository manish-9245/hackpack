import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/langchain";

export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as { message: string };
  const text = await chat(message);
  return NextResponse.json({ text });
}
