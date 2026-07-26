import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getMastra } from "@/lib/mastra";

export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as { message: string };
  const { env } = getCloudflareContext();
  const mastra = getMastra((env as unknown as { DB?: D1Database }).DB);
  const agent = mastra.getAgent("assistant");
  const result = await agent.generate(message);
  return NextResponse.json({ text: result.text });
}
