# hackpack 🚀

**Scaffold full-stack hackathon projects in seconds.** Pick a language/framework, select features (UI kit, auth, DB, AI), generate prebuilt pages with routes wired end-to-end, and ship to Cloudflare Workers.

```
hackpack new my-hack --base=ts-nextjs --features=ui-shadcn,auth-better-auth,db-d1-drizzle
cd my-hack && npm install && npm run dev
```

→ Live SPA with login/signup/dashboard, auth wiring, D1 database schema, and route handlers. No boilerplate.

## Features

**7 Bases** across TypeScript, Python, and framework variants:
- `ts-nextjs` — Next.js App Router on Cloudflare Workers
- `ts-vite-react` — Vite + React (fast SSG)
- `ts-sveltekit` — SvelteKit (file-based routing)
- `ts-hono-api` — Hono REST API (API-only)
- `py-fastapi` — FastAPI on Pyodide (Python backend)
- `shadcn-svelte` — SvelteKit + shadcn-svelte
- `shadcn-vue` — Nuxt + shadcn-vue

**16 Features** (modular, composable):
- **UI:** shadcn/ui, Aceternity, shadcn-svelte, shadcn-vue
- **AI:** Mastra, LangChain (JS + Python), Pydantic AI, Vercel AI SDK
- **Auth:** Better Auth, JWT (Python)
- **DB:** D1 + Drizzle (TS), D1 + SQLModel (Python)
- **Testing:** Vitest (TS), pytest (Python)
- **CI/CD:** GitHub Actions

**Prebuilt Pages** (wired to your auth/DB choice):
- `landing` — Hero + CTA
- `login` / `signup` — Auth UI (best-auth variant or UI-only stub)
- `dashboard` — Route-guarded, user-specific data

**Custom Page Generator** — `hackpack page add orders --fields=title:string,price:number,userId:relation --auth=protected`
- Generates: frontend (list + detail views), backend (CRUD routes), DB schema, migrations
- Deterministic (no LLM), local NLP parser for `--describe` flag
- Auto-wires into dashboard nav, DB schema index, route handlers

## Install

```bash
npm install -g hackpack
# or
npx hackpack@latest new my-project
```

## Quick Start

### 1. Create a new project

```bash
hackpack new my-hack
```

Interactive prompts guide you through:
- Project name
- Base (framework + language)
- Features (UI, auth, DB, AI, testing)
- Pages (landing, login, signup, dashboard)

Or skip prompts with flags:
```bash
hackpack new my-hack \
  --base=ts-nextjs \
  --features=ui-shadcn,auth-better-auth,db-d1-drizzle \
  --pages=landing,login,signup,dashboard
```

### 2. Install dependencies and start dev server

```bash
cd my-hack
npm install
npm run dev
```

### 3. Add a feature post-init

```bash
hackpack add ai-mastra
npm install
```

### 4. Generate a custom page

```bash
hackpack page add orders \
  --fields=title:string,price:number,userId:relation \
  --auth=protected
```

Or describe it in English (local NLP parsing, no API call):
```bash
hackpack page add orders --describe "a page for orders with a title, a price, and a user relation, behind login"
```

### 5. Deploy to Cloudflare Workers

```bash
hackpack deploy
```

Prompts you to run `wrangler login` if needed, then ships your app live with a public URL.

---

## Commands

```
hackpack new <name>                    Create a new project
  --base=<name>                        Base template (ts-nextjs, ts-vite-react, etc.)
  --features=<list>                    Comma-separated features (ui-shadcn, auth-better-auth, ...)
  --pages=<list>                       Comma-separated pages (landing, login, signup, dashboard)
  --registry=<path|url>                Custom registry (local path or git URL)
  --install / --no-install             Run npm install after scaffolding (default: true)
  --yes                                Skip all prompts, accept defaults

hackpack add <feature>                 Add a feature to current project
  --registry=<path|url>                Override registry
  --install / --no-install             Run npm install (default: true)

hackpack page add <name>               Generate a CRUD page
  --fields=<csv>                       Fields: title:string,price:number,userId:relation
  --auth=protected|public              Route protection (default: public)
  --describe=<text>                    Natural language description (uses local NLP)

hackpack deploy                        Build and ship to Cloudflare Workers
  --dry-run                            Simulate deploy without shipping

hackpack registry list                 List configured registries
hackpack registry add <name> <url>     Add a named registry
hackpack registry remove <name>        Remove a registry

hackpack update [feature]              Re-apply feature(s) from registry
hackpack update-vendor <feature>       Refresh vendored components (e.g., Aceternity UI)
```

---

## Examples

### Full-stack SaaS starter

```bash
hackpack new saas-app \
  --base=ts-nextjs \
  --features=ui-shadcn,auth-better-auth,db-d1-drizzle,ai-mastra,testing-vitest,ci-github-actions \
  --pages=landing,login,signup,dashboard

cd saas-app
npm install
npm run dev              # dev server on http://localhost:3000
npm test                 # run vitest
npm run cf:deploy        # deploy to Workers
```

### Python FastAPI backend

```bash
hackpack new api-service \
  --base=py-fastapi \
  --features=db-d1-sqlmodel,auth-py-jwt,testing-pytest

cd api-service
uv sync                  # install Python deps (uses uv for speed)
uv run python -m app.main  # run locally via Pyodide simulator
uv run pytest            # run tests
npm run cf:deploy        # deploy to Workers
```

### Minimal Hono API

```bash
hackpack new api \
  --base=ts-hono-api \
  --features=db-d1-drizzle

cd api
npm install
npm run dev              # dev server
hackpack page add users --fields=email:string,name:string
npm run cf:deploy
```

### Custom page with NLP

```bash
hackpack page add products --describe "a list of products with name, price, and inventory count, behind login"
# Prompts: "Parsed: entity=products, fields=[name:string, price:number, inventory:number], auth=protected. Generate? (yes/no)"
# Generates: list page, detail page, API routes, DB schema, migrations, wiring into nav + schema index
```

---

## Registry System

**Multi-registry support** — point `hackpack` at any git repo containing `bases/`, `features/`, `pages/` folders.

Default registry: included in the CLI (bundled templates).

Custom registry:
```bash
# Local path
hackpack new my-hack --registry=../my-templates

# GitHub shorthand
hackpack new my-hack --registry=github:myorg/my-templates

# Full git URL
hackpack new my-hack --registry=https://github.com/myorg/my-templates.git

# Named registry (add once, reuse always)
hackpack registry add work github:mycompany/templates
hackpack new project --registry=work
```

**Registry format** — any git repo with this structure:
```
my-templates/
├── bases/
│   ├── ts-nextjs/
│   │   ├── template.config.json
│   │   ├── package.json.hbs
│   │   ├── ...
│   └── ...
├── features/
│   ├── ui-shadcn/
│   │   ├── template.config.json
│   │   ├── files/
│   │   └── ...
│   └── ...
└── pages/
    ├── landing/
    ├── login/variants/{better-auth,none}/
    └── _scaffold/
        ├── ts-nextjs/
        ├── ts-vite-react/
        └── ...
```

---

## Architecture

### Composition Model

Projects are built by **layering**:
1. **Base** (framework + language) → `package.json`, dev scripts, config
2. **Features** (modular add-ons) → merge dependencies, env vars, code overlays, route/schema wiring
3. **Pages** (prebuilt or generated) → frontend + API + DB schema + wiring anchors

**No code generation during compose** — everything is data (config, templates, wiring rules). Keeps builds deterministic and debuggable.

### Page Generation

`hackpack page add` uses a **deterministic generator**, not LLM:
- Parse entity name, fields, auth from CLI flags or `--describe` (local `compromise` NLP, no API)
- Render `.hbs` Handlebars templates with Zod/SQLite/Drizzle type mappings
- Insert generated code at anchor comments (`// hackpack:routes`, `# hackpack:imports`)
- No arbitrary code execution — all wiring is declarative

**Anchor-based wiring** keeps manual edits safe:
```typescript
// app/page.tsx — your code
export default function App() { /* ... */ }
// hackpack:dashboard-nav — wiring point (never overwritten, only inserted at)
```

---

## Deployment

### Cloudflare Workers

Every base is optimized for **Workers** (serverless, low latency, global):
- Next.js → OpenNext + Workers adapter
- Vite/React → custom Wrangler config
- SvelteKit → SvelteKit Cloudflare adapter
- Hono → native Workers framework
- FastAPI → Pyodide runtime on Workers

**Deploy:**
```bash
hackpack deploy                    # interactive: prompts for wrangler login, then deploys
hackpack deploy --dry-run          # dry-run: build + wrangler deploy --dry-run
```

Free tier: 100k requests/day, 10ms CPU/request (the one that bites), D1 5GB/5M reads/day, R2 10GB, KV 100k reads + 1k writes/day.

---

## CLI Distribution

**TypeScript (npm):** `npx hackpack` — fastest, all features (interactive wizard, remote git registries, NLP `--describe`)

**Go binary (experimental):** Smaller, no Node.js runtime dependency. Clone locally: git registries auto-cached, no NLP. Ship with `--registry` flag or bundled templates.

---

## Why hackpack?

- **No boilerplate** — pick stack once, get wired pages instantly
- **Type-safe** — Zod schemas, Drizzle ORM, better-auth types, TypeScript everywhere
- **Composable** — bases and features are orthogonal; add auth without breaking your DB setup
- **Deterministic** — no LLM randomness; same input → same output, ideal for hackathons
- **Multi-language** — TypeScript *and* Python, same CLI, same page generation
- **Portable** — export to any git repo; run from CDN, customize freely

---

## Contributing

Community registries, themes, and feature packs welcome. See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

## License

MIT

---

## Quick Links

- **[Full Documentation](docs/)**
- **[Features Reference](docs/features.md)**
- **[Registry Development](docs/registry.md)**
- **[Architecture Deep Dive](docs/architecture.md)**
- **[GitHub](https://github.com/manish-9245/hackpack)**
- **[Landing Page](./landing/)** — Deploy to Vercel, showcase your project

---

## 🌐 Landing Page (Vercel)

A beautiful **Next.js showcase site** for hackpack is included in the `landing/` directory.

**Deploy to Vercel in 30 seconds:**
1. Go to https://vercel.com/new
2. Import repo: `manish-9245/hackpack`
3. Set root directory to `./landing`
4. Click "Deploy"

Your landing page will be live at `hackpack.vercel.app` (or your custom domain).

See [landing/README.md](./landing/README.md) for customization options.

---

Built for hackathons. Ship fast. 🚀
