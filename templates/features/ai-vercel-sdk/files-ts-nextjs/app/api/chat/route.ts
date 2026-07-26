import { NextRequest } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as { message: string };
  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: "You are a helpful assistant for this hackathon project.",
    prompt: message,
  });
  return result.toTextStreamResponse();
}
