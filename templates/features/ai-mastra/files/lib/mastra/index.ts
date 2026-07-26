import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { D1Store } from "@mastra/cloudflare-d1";

const assistant = new Agent({
  id: "assistant",
  name: "assistant",
  instructions: "You are a helpful assistant for this hackathon project.",
  model: anthropic("claude-sonnet-4-5"),
});

/** Pass the D1 binding when db-d1-drizzle is installed to persist agent memory;
 * omit it to run in-memory only. */
export function getMastra(d1Binding?: D1Database) {
  return new Mastra({
    agents: { assistant },
    storage: d1Binding ? new D1Store({ id: "mastra", binding: d1Binding }) : undefined,
  });
}
