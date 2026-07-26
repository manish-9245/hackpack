# Quick Start Guide

Get a full-stack hackathon project running in 5 minutes.

## 1. Create a new project

```bash
npx hackpack@latest new my-hack
```

You'll be prompted to choose:
- **Project name** (your-project-name)
- **Base** (framework + language) — pick `ts-nextjs` if unsure
- **Features** (UI kit, auth, DB, AI, testing, CI)
- **Pages** (landing, login, signup, dashboard)

Or skip prompts with flags:
```bash
npx hackpack@latest new my-hack \
  --base=ts-nextjs \
  --features=ui-shadcn,auth-better-auth,db-d1-drizzle \
  --pages=landing,login,signup,dashboard \
  --yes
```

## 2. Install & run

```bash
cd my-hack
npm install
npm run dev
```

Open http://localhost:3000 — you now have:
- ✓ Landing page
- ✓ Login / signup pages (wired to Better Auth)
- ✓ Protected dashboard (auth guarded)
- ✓ D1 database ready
- ✓ Tailwind + shadcn/ui components

## 3. Generate a custom page

Add a CRUD page for a new resource:

```bash
hackpack page add products \
  --fields=name:string,price:number,stock:number \
  --auth=protected
```

Or use natural language (local NLP, no API call):
```bash
hackpack page add products --describe "a list of products with name, price, and stock count, behind login"
```

This generates:
- List page (products, table view)
- Detail page (create/edit form)
- API routes (GET, POST, PUT, DELETE)
- Database schema + Drizzle file
- Routes + schema index wiring

## 4. Add a feature

Already chose some features during `new`? Add more now:

```bash
hackpack add ai-mastra
npm install
```

Choose from 16 available features (AI, testing, CI, more UI kits, etc.).

## 5. Deploy

Ship to Cloudflare Workers (free tier available):

```bash
hackpack deploy
```

Prompts you to authenticate with Wrangler (one-time), then deploys.

Your live URL:
```
🎉 Live at https://my-hack.yourname.workers.dev
```

---

## Common Patterns

### Full-stack SaaS

```bash
hackpack new saas \
  --base=ts-nextjs \
  --features=ui-shadcn,auth-better-auth,db-d1-drizzle,ai-langchain-js,testing-vitest,ci-github-actions \
  --pages=landing,login,signup,dashboard

cd saas
npm install
# Generate your first custom page
hackpack page add clients --fields=name:string,email:string,phone:string --auth=protected
npm run dev
```

### Python API backend

```bash
hackpack new api \
  --base=py-fastapi \
  --features=db-d1-sqlmodel,auth-py-jwt,testing-pytest

cd api
uv sync
hackpack page add users --fields=email:string,name:string,role:string --auth=protected
uv run python -m app.main
```

### Minimal Hono API

```bash
hackpack new microservice \
  --base=ts-hono-api \
  --features=db-d1-drizzle

cd microservice
npm install
hackpack page add tasks --fields=title:string,completed:boolean --auth=public
npm run cf:deploy
```

### Svelte project

```bash
hackpack new svelte-app \
  --base=ts-sveltekit \
  --features=ui-shadcn,auth-better-auth,db-d1-drizzle

cd svelte-app
npm install
npm run dev
```

---

## What You Get

After `hackpack new`:

```
my-hack/
├── app/                          # Next.js App Router (or framework-specific)
│   ├── page.tsx                  # Landing page (templated with project name)
│   ├── login/page.tsx            # Auth form (wired to Better Auth)
│   ├── signup/page.tsx           # Registration form
│   ├── dashboard/
│   │   ├── layout.tsx            # Auth guard + nav component
│   │   └── page.tsx              # Dashboard home
│   └── api/                       # API routes (Hono, Next.js, FastAPI)
├── db/
│   ├── schema/
│   │   └── index.ts              # Drizzle schema exports (auto-extensible)
│   └── index.ts                  # DB client initialization
├── lib/
│   ├── auth.ts / auth-client.ts  # Better Auth config
│   └── utils.ts                  # Tailwind merge, cn() helper
├── components/
│   └── dashboard-nav.tsx          # Navigation (auto-wired with page add)
├── package.json                   # All dependencies merged
├── wrangler.jsonc                 # Cloudflare Workers config (D1 binding)
├── hackpack.json                  # Project metadata (bases, features, pages chosen)
├── hackpack.lock                  # Registry lock (reproducible installs)
└── .github/workflows/             # CI/CD (if ci-github-actions chosen)
    ├── ci.yml                     # Test on PR
    └── deploy.yml                 # Deploy on push to main
```

## File Structure Conventions

### Page generation

When you run `hackpack page add orders`:

```
app/orders/
├── page.tsx                   # List view
├── [id]/
│   └── page.tsx               # Detail/edit view
└── api/orders/
    └── route.ts               # CRUD routes (GET, POST, PUT, DELETE)

db/schema/orders.ts            # Drizzle schema (auto-exports in schema/index.ts)
components/dashboard-nav.tsx   # Auto-updates with <Link href="/orders">Orders</Link>
```

### Feature overlays

Features apply "overlays" on top of the base:
- `dependencies` → merged into package.json
- `devDependencies` → merged into devDependencies
- `envVars` → added to .env.example (you fill in values)
- `files/*` → copied into project
- `wiring` → inserted at anchor comments (safe, non-destructive)

Example: `auth-better-auth` adds:
- dependencies (better-auth package)
- files/lib/{auth,auth-client}.ts
- files/app/api/auth/[...all]/route.ts
- wiring to page templates (login/signup pick "auth-better-auth" variant if available)

---

## Troubleshooting

### "Module not found" after `hackpack new`

Run `npm install` to fetch dependencies:
```bash
npm install
```

### Page add doesn't wire into nav

If `components/dashboard-nav.tsx` doesn't exist (e.g., no dashboard page chosen), wiring is skipped. Add the page first:
```bash
hackpack new ... --pages=dashboard
hackpack page add orders ...  # now wires into nav
```

### Wrangler auth fails

Ensure you're logged in:
```bash
npx wrangler login
```

### Python dependencies missing

Use `uv` for fast, reliable Python dependency management:
```bash
uv sync      # install all py dependencies
uv run pytest  # run tests
uv run python -m app.main  # run app
```

---

## Next Steps

- **[Full Documentation](README.md)** — all commands, options, examples
- **[Features Reference](FEATURES.md)** — details on each feature
- **[Registry Development](registry.md)** — build custom registries
- **[Architecture](architecture.md)** — how hackpack works internally
