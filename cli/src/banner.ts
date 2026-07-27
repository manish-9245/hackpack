import pc from "picocolors";

// Packy: antenna + LED eyes (cyan/green, "techy"), rounded ears (blue, "cute"),
// backpack with glowing chip + straps (magenta/yellow). All box-drawing/shading
// chars are single-width in every monospace terminal font (no emoji — emoji
// render double-width in many terminals and break this alignment).
const PACKY = [
  pc.cyan("      .        "),
  pc.cyan("     (o)       "),
  pc.cyan("      |        "),
  pc.blue("   ^       ^   "),
  pc.blue("  / '.___.' \\  "),
  pc.blue(" |  ") + pc.green("o") + pc.blue("     ") + pc.green("o") + pc.blue("  | "),
  pc.blue(" |     v     | "),
  pc.blue("  \\_________/  "),
  pc.magenta("   .-------.   "),
  pc.magenta("  /  ") + pc.yellow("o---o") + pc.magenta("  \\  "),
  pc.magenta(" |  |") + pc.yellow("▓▓▓▓▓") + pc.magenta("|  | "),
  pc.magenta("  \\  ") + pc.yellow("o---o") + pc.magenta("  /  "),
  pc.magenta("   '-------'   "),
].join("\n");

export function showWelcome() {
  console.log(PACKY);
  console.log(
    pc.blue(`
    ██╗  ██╗ █████╗  ██████╗██╗  ██╗██████╗  █████╗  ██████╗██╗  ██╗
    ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝
    ███████║███████║██║     █████╔╝ ██████╔╝███████║██║     █████╔╝
    ██╔══██║██╔══██║██║     ██╔═██╗ ██╔═══╝ ██╔══██║██║     ██╔═██╗
    ██║  ██║██║  ██║╚██████╗██║  ██╗██║     ██║  ██║╚██████╗██║  ██╗
    ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`),
  );
  console.log(
    `    ${pc.dim("Packy says:")} Scaffold full-stack hackathon projects in seconds.\n` +
      `    Pick a framework, select features, ship to Cloudflare Workers.\n`,
  );
  console.log(pc.green(`    🚀 7 bases  •  16 features  •  prebuilt pages  •  end-to-end wired\n`));
}

export function showBases() {
  console.log(pc.bold(pc.blue("\n  📚 Available Bases:\n")));
  console.log(`
    TypeScript:
      • ts-nextjs      — Next.js App Router (file-based routing)
      • ts-vite-react  — Vite + React (fast, minimal config)
      • ts-sveltekit   — SvelteKit (built-in routing, Svelte reactivity)
      • ts-hono-api    — Hono REST API (lightweight API-only)

    Python:
      • py-fastapi     — FastAPI on Pyodide (Python backend on Workers)

    Framework Variants (v1.5):
      • shadcn-svelte  — SvelteKit + shadcn-svelte
      • shadcn-vue     — Nuxt + shadcn-vue
  `);
}

export function showFeatures() {
  console.log(pc.bold(pc.blue("\n  ✨ Available Features:\n")));
  console.log(`
    UI & Styling:
      • ui-shadcn      — shadcn/ui components (Radix + Tailwind)
      • ui-aceternity  — Aceternity UI effects (vendored, offline)
      • ui-shadcn-svelte — shadcn-svelte (Svelte variant)
      • ui-shadcn-vue  — shadcn-vue (Vue variant)

    AI & LLMs:
      • ai-mastra      — Mastra agent framework
      • ai-langchain-js — LangChain.js (agentic chains)
      • ai-langchain-py — LangChain (Python)
      • ai-pydantic-ai — Pydantic AI (structured output)
      • ai-vercel-sdk  — Vercel AI SDK (lightweight chat)

    Authentication:
      • auth-better-auth — Better Auth (email/password + OAuth)
      • auth-py-jwt    — JWT-based auth (Python)

    Database:
      • db-d1-drizzle  — Cloudflare D1 + Drizzle ORM (TypeScript)
      • db-d1-sqlmodel — Cloudflare D1 + SQLModel (Python)

    Testing:
      • testing-vitest — Vitest + Testing Library (TypeScript)
      • testing-pytest — pytest (Python)

    CI/CD:
      • ci-github-actions — GitHub Actions (build, test, deploy)
  `);
}

export function showPages() {
  console.log(pc.bold(pc.blue("\n  📄 Prebuilt Pages:\n")));
  console.log(`
    • landing  — Hero section with CTA
    • login    — Auth form (variant: auth-better-auth or UI-only stub)
    • signup   — Registration form (same variants)
    • dashboard — Route-guarded dashboard with nav (auth-gated or public)

    All pages are wired to your chosen auth feature + DB schema.
    Generate custom pages on-the-fly: hackpack page add orders --fields=...
  `);
}

export function showExamples() {
  console.log(pc.bold(pc.blue("\n  💡 Quick Examples:\n")));
  console.log(`
    # Full-stack SaaS starter
    hackpack new saas-app \\
      --base=ts-nextjs \\
      --features=ui-shadcn,auth-better-auth,db-d1-drizzle,ai-mastra \\
      --pages=landing,login,signup,dashboard

    # Python FastAPI backend
    hackpack new api-service \\
      --base=py-fastapi \\
      --features=db-d1-sqlmodel,auth-py-jwt

    # Minimal Hono API
    hackpack new api --base=ts-hono-api --features=db-d1-drizzle

    # Add a feature post-init
    cd my-hack && hackpack add ai-langchain-js && npm install

    # Generate a custom page with NLP
    hackpack page add products \\
      --describe "a list of products with name, price, inventory, behind login"

    # Deploy to Cloudflare Workers
    hackpack deploy
  `);
}

export function showHelp() {
  console.log(pc.bold(pc.blue("\n  📖 Full Help:\n")));
  console.log(`
    hackpack new <name>                 Create new project
    hackpack add <feature>              Add feature to project
    hackpack page add <name>            Generate CRUD page
    hackpack deploy [--dry-run]         Ship to Cloudflare Workers

    hackpack registry list              List registries
    hackpack registry add <name> <url>  Add custom registry
    hackpack registry remove <name>     Remove registry

    hackpack update [feature]           Re-apply feature(s)
    hackpack update-vendor <feature>    Refresh vendored components

  🌐 Docs & Links:
    • GitHub: https://github.com/manish-9245/hackpack
    • Issues: https://github.com/manish-9245/hackpack/issues
  `);
}
