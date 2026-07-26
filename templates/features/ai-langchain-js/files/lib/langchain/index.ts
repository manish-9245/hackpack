import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const SYSTEM_PROMPT = "You are a helpful assistant for this hackathon project.";

export async function chat(message: string): Promise<string> {
  const model = new ChatAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-sonnet-4-5",
  });
  const result = await model.invoke([new SystemMessage(SYSTEM_PROMPT), new HumanMessage(message)]);
  return typeof result.content === "string" ? result.content : JSON.stringify(result.content);
}
