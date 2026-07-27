<div align="center">

```
    ██╗  ██╗ █████╗  ██████╗██╗  ██╗██████╗  █████╗  ██████╗██╗  ██╗
    ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝
    ███████║███████║██║     █████╔╝ ██████╔╝███████║██║     █████╔╝
    ██╔══██║██╔══██║██║     ██╔═██╗ ██╔═══╝ ██╔══██║██║     ██╔═██╗
    ██║  ██║██║  ██║╚██████╗██║  ██╗██║     ██║  ██║╚██████╗██║  ██╗
    ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
```

**Full-stack hackathon projects, scaffolded in 90 seconds.**

Pick a framework. Select features. Deploy. No boilerplate, no LLM guessing, no configuration paralysis.

[![npm version](https://img.shields.io/npm/v/create-hackpack.svg?color=3b82f6)](https://www.npmjs.com/package/create-hackpack)
[![npm downloads](https://img.shields.io/npm/dm/create-hackpack.svg?color=3b82f6)](https://www.npmjs.com/package/create-hackpack)
[![license](https://img.shields.io/npm/l/create-hackpack.svg?color=10b981)](https://github.com/manish-9245/hackpack/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/create-hackpack.svg)](https://www.npmjs.com/package/create-hackpack)
[![GitHub stars](https://img.shields.io/github/stars/manish-9245/hackpack?style=flat&color=f59e0b)](https://github.com/manish-9245/hackpack)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ec4899.svg)](https://github.com/manish-9245/hackpack/blob/main/docs/CONTRIBUTING.md)

[Quick Start](#quick-start) · [Bases](#available-bases) · [Features](#available-features) · [Commands](#other-commands) · [Deploy](#deployment) · [Contributing](#contributing)

</div>

---

```bash
npx create-hackpack new my-app
```

That's it — a wired, typed, deployable full-stack app in the time it takes to read this line.

## Table of contents

<details>
<summary>Expand</summary>

- [Why hackpack](#why-hackpack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Non-Interactive Mode](#non-interactive-mode)
- [Available Bases](#available-bases)
- [Available Features](#available-features)
- [Prebuilt Pages](#prebuilt-pages)
- [Other Commands](#other-commands)
- [Generated Project Structure](#generated-project-structure)
- [Design System](#design-system)
- [Deployment](#deployment)
- [How it compares](#how-it-compares)
- [Roadmap](#roadmap-v2)
- [Contributing](#contributing)
- [License](#license)

</details>

## Why hackpack

- **Speed** — full-stack project in 90 seconds, zero onboarding tax.
- **Composability** — pick any base + feature combo; bases and features don't conflict.
- **Determinism** — same input, same output, every time. No LLM randomness, perfect for reproducible builds.
- **Type-safety** — Zod, Drizzle, TypeScript by default. Bugs caught at compile time.
- **Portable** — exports to plain git. No vendor lock-in, deploy to Workers, Docker, or anywhere.

| | |
|---|---|
| **7 Bases** | Next.js, Vite + React, SvelteKit, Hono, FastAPI, shadcn-svelte, shadcn-vue |
| **16 Features** | UI libraries, AI/LLM integrations, authentication, databases, testing, CI/CD |
| **Prebuilt Pages** | Landing, login, signup, dashboard — wired to your chosen auth + DB |
| **One-Click Deploy** | Ship to Cloudflare Workers with `hackpack deploy` |
| **Fully Customizable** | Pick your package manager, license, add metadata, initialize git |

## Installation

Run it directly, no install needed:

```bash
npx create-hackpack new my-app
```

Or install the `hackpack` command globally:

```bash
npm install -g create-hackpack
pnpm add -g create-hackpack
yarn global add create-hackpack
bun add -g create-hackpack
```

> Published on npm as **`create-hackpack`**; the command it installs is **`hackpack`**.

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

<table>
<tr><td valign="top">

**UI & Styling**
- `ui-shadcn` — shadcn/ui (Radix + Tailwind)
- `ui-aceternity` — Aceternity UI effects (vendored, offline)
- `ui-shadcn-svelte` — shadcn-svelte variant
- `ui-shadcn-vue` — shadcn-vue variant

**AI & LLMs**
- `ai-mastra` — Mastra agent framework
- `ai-langchain-js` — LangChain.js (agentic chains)
- `ai-langchain-py` — LangChain (Python)
- `ai-pydantic-ai` — Pydantic AI (structured output)
- `ai-vercel-sdk` — Vercel AI SDK (lightweight chat)

</td><td valign="top">

**Authentication**
- `auth-better-auth` — Better Auth (email/password + OAuth)
- `auth-py-jwt` — JWT-based auth (Python)

**Databases**
- `db-d1-drizzle` — Cloudflare D1 + Drizzle ORM (TypeScript)
- `db-d1-sqlmodel` — Cloudflare D1 + SQLModel (Python)

**Testing**
- `testing-vitest` — Vitest + Testing Library (TypeScript)
- `testing-pytest` — pytest (Python)

**CI/CD**
- `ci-github-actions` — GitHub Actions (build, test, deploy to Cloudflare Workers)

</td></tr>
</table>

## Prebuilt Pages

Each page is wired to your chosen auth feature and DB schema:

| Page | Description |
|------|-------------|
| `landing` | Hero section with CTA |
| `login` | Auth form (auto-variants based on selected auth feature) |
| `signup` | Registration form |
| `dashboard` | Route-guarded dashboard with nav |

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
├── hackpack.json           # Metadata (base, features, pages, author, license)
├── hackpack.lock           # Registry resolution snapshot
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

Requires a `CLOUDFLARE_API_TOKEN` environment variable. See the [Cloudflare docs](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/).

## How it compares

| | hackpack | Framework CLI (`create-next-app`, etc.) | LLM code generators |
|---|---|---|---|
| Cross-framework feature composition | ✅ | ❌ single framework | ⚠️ inconsistent |
| Reproducible output (same input → same output) | ✅ | ✅ | ❌ |
| Auth + DB + pages wired together | ✅ | ❌ manual | ⚠️ varies |
| No cloud vendor required | ✅ local-first | ✅ | ✅ |
| Auditable, no black box | ✅ | ✅ | ❌ |

## Roadmap (v2+)

- Go binary packaging & release workflows
- Community registry hub
- `hackpack.lock` reproducible updates
- Extra page presets
- More Aceternity components

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](https://github.com/manish-9245/hackpack/blob/main/docs/CONTRIBUTING.md) and the [GitHub repo](https://github.com/manish-9245/hackpack).

## License

[MIT](https://github.com/manish-9245/hackpack/blob/main/LICENSE) © [Manish Tiwari](https://github.com/manish-9245)

---

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=manish-9245/hackpack&type=Date)](https://star-history.com/#manish-9245/hackpack)

</div>
