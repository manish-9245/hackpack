# hackpack

> Scaffold full-stack hackathon projects in seconds.

Pick a framework, select features (UI, auth, DB, AI), generate CRUD pages, and deploy to Cloudflare Workers—all in one command.

## Features

- **7 Bases**: Next.js, Vite + React, SvelteKit, Hono, FastAPI, shadcn-svelte, shadcn-vue
- **16 Features**: UI libraries, AI/LLM integrations, authentication, databases, testing, CI/CD
- **Prebuilt Pages**: Landing, login, signup, dashboard—wired to your chosen auth + DB
- **One-Click Deploy**: Ship to Cloudflare Workers with `hackpack deploy`
- **Fully Customizable**: Pick your package manager, license, add metadata, initialize git

## Installation

```bash
npm install -g hackpack
```

Or with other package managers:
```bash
pnpm add -g hackpack
yarn global add hackpack
bun add -g hackpack
```

## Quick Start

```bash
hackpack new my-app
```

This launches an interactive wizard to choose:
- **Base template** (framework)
- **Features** (UI, auth, DB, AI, testing, CI/CD)
- **Pages** (landing, login, signup, dashboard)
- **Package manager** (npm, pnpm, yarn, bun)
- **License** (MIT, Apache 2.0, or none)
- **Author/org name** and **description**

Then scaffolds the project, initializes git, and installs dependencies.

## Non-Interactive Mode

For CI/CD or scripting, skip prompts with `--yes` and pass flags:

```bash
hackpack new my-app \
  --base ts-nextjs \
  --features ui-shadcn,auth-better-auth,db-d1-drizzle \
  --pages landing,login,dashboard \
  --pm pnpm \
  --license mit \
  --author "Your Name" \
  --description "My SaaS app" \
  --yes
```

## Available Bases

| Name | Description |
|------|-------------|
| `ts-nextjs` | Next.js App Router (file-based routing) |
| `ts-vite-react` | Vite + React (fast, minimal config) |
| `ts-sveltekit` | SvelteKit (built-in routing, Svelte reactivity) |
| `ts-hono-api` | Hono REST API (lightweight API-only) |
| `py-fastapi` | FastAPI on Pyodide (Python backend on Workers) |
| `shadcn-svelte` | SvelteKit + shadcn-svelte components |
| `shadcn-vue` | Nuxt + shadcn-vue components |

## Available Features

### UI & Styling
- `ui-shadcn` — shadcn/ui (Radix + Tailwind)
- `ui-aceternity` — Aceternity UI effects (vendored, offline)
- `ui-shadcn-svelte` — shadcn-svelte variant
- `ui-shadcn-vue` — shadcn-vue variant

### AI & LLMs
- `ai-mastra` — Mastra agent framework
- `ai-langchain-js` — LangChain.js (agentic chains)
- `ai-langchain-py` — LangChain (Python)
- `ai-pydantic-ai` — Pydantic AI (structured output)
- `ai-vercel-sdk` — Vercel AI SDK (lightweight chat)

### Authentication
- `auth-better-auth` — Better Auth (email/password + OAuth)
- `auth-py-jwt` — JWT-based auth (Python)

### Databases
- `db-d1-drizzle` — Cloudflare D1 + Drizzle ORM (TypeScript)
- `db-d1-sqlmodel` — Cloudflare D1 + SQLModel (Python)

### Testing
- `testing-vitest` — Vitest + Testing Library (TypeScript)
- `testing-pytest` — pytest (Python)

### CI/CD
- `ci-github-actions` — GitHub Actions (build, test, deploy to Cloudflare Workers)

## Prebuilt Pages

Each page is wired to your chosen auth feature and DB schema:

- `landing` — Hero section with CTA
- `login` — Auth form (auto-variants based on selected auth feature)
- `signup` — Registration form
- `dashboard` — Route-guarded dashboard with nav

## Other Commands

```bash
# Add a feature to an existing project
hackpack add ai-langchain-js

# Generate a custom CRUD page
hackpack page add products --describe "list of products with name, price, inventory"

# Deploy to Cloudflare Workers
hackpack deploy

# Manage registries (advanced)
hackpack registry list
hackpack registry add my-templates /path/to/templates
```

## Generated Project Structure

Every scaffolded project includes:

```
my-app/
├── README.md              # Project info (with your description + author)
├── LICENSE                # MIT or Apache 2.0 (if selected)
├── .editorconfig          # Editor settings (2-space indent, LF, UTF-8)
├── .env.example           # Environment variables baseline
├── hackpack.json          # Metadata (base, features, pages, author, license)
├── hackpack.lock          # Registry resolution snapshot
├── package.json / pyproject.toml
├── app/ or src/           # Framework-specific structure
└── ...                    # Feature-specific files (auth, DB, etc.)
```

## Design System

All generated projects use a semantic color palette:

```css
primary: #3b82f6 (blue)
success: #10b981 (green)
warning: #f59e0b (amber)
error: #ef4444 (red)
accent: pink, purple, orange, indigo
surface: base, elevated, muted (dark theme)
```

Available as Tailwind utilities:
```jsx
<div className="bg-surface-base text-primary">...</div>
<button className="bg-primary hover:bg-primary-dark">...</button>
```

## Deployment

Generate and deploy to Cloudflare Workers:

```bash
cd my-app
hackpack deploy
```

Requires `CLOUDFLARE_API_TOKEN` environment variable. See [Cloudflare docs](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/).

## Roadmap (v2+)

- Go binary packaging & release workflows
- Community registry hub
- `hackpack.lock` reproducible updates
- Extra page presets
- More Aceternity components

## License

MIT

## Contributing

Issues and PRs welcome. See [GitHub](https://github.com/yourusername/hackpack).
