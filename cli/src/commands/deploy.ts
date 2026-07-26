import { defineCommand } from "citty";
import * as clack from "@clack/prompts";
import { execa } from "execa";

const FREE_TIER_REMINDER =
  "Free tier: 100k requests/day, 10ms CPU time/request (the one that actually bites — " +
  "avoid synchronous image/JSON-heavy work), D1 5GB/5M reads/day, R2 10GB, KV 100k reads + 1k writes/day.";

export const deployCommand = defineCommand({
  meta: { name: "deploy", description: "Build and deploy the current project to Cloudflare Workers" },
  args: {
    dryRun: { type: "boolean", description: "Build and dry-run the deploy instead of shipping" },
  },
  async run({ args }) {
    clack.log.info(FREE_TIER_REMINDER);
    const cwd = process.cwd();
    const spinner = clack.spinner();

    // Every base defines its own cf:deploy / cf:dry-run script (opennextjs-cloudflare
    // for the TS bases, `uv run pywrangler deploy` for Python) — deploy stays generic
    // across languages by just delegating to whichever one the base shipped.
    const script = args.dryRun ? "cf:dry-run" : "cf:deploy";
    spinner.start(args.dryRun ? "Building and running a dry-run deploy" : "Building and deploying to Cloudflare Workers");
    try {
      const { stdout } = await execa("npm", ["run", script], { cwd });
      spinner.stop("Done");
      console.log(stdout);
      const match = stdout.match(/https?:\/\/\S+\.workers\.dev\S*/);
      if (match) clack.outro(`Live at ${match[0]}`);
    } catch (err) {
      spinner.stop("Deploy failed");
      throw err;
    }
  },
});
