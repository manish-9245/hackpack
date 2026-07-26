# Features Reference

Complete list of all available features, their dependencies, and compatibility.

## UI & Components

### ui-shadcn
**shadcn/ui components** — Radix UI primitives + Tailwind CSS

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit
- **Dependencies:** clsx, tailwind-merge, class-variance-authority, lucide-react, Radix UI
- **PostInstall:** Runs `npx shadcn@latest add button card input label`
- **Description:** Industry-standard component library for React
- **Use case:** Professional UIs, design consistency, accessibility

### ui-aceternity
**Aceternity UI effects** — Vendored, offline-first Tailwind + Framer Motion

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit
- **Vendored components:** spotlight, background-beams, moving-border, shimmer-button
- **Dependencies:** motion (Framer Motion)
- **Description:** Eye-catching animated effects for landing pages, hero sections
- **Use case:** Landing pages, hero sections, visual impact

### ui-shadcn-svelte
**shadcn-svelte components** — Radix UI for Svelte

- **Compatible with:** shadcn-svelte (base)
- **Dependencies:** bits-ui, cmdk-sv, lucide-svelte, mode-watcher, svelte-radix
- **Description:** Full-featured Svelte component library
- **Use case:** Svelte projects needing polished UI

### ui-shadcn-vue
**shadcn-vue components** — Radix UI for Vue

- **Compatible with:** shadcn-vue (base)
- **Dependencies:** shadcn-vue, lucide-vue-next, radix3
- **Description:** Vue 3 component library with Radix primitives
- **Use case:** Nuxt/Vue projects

---

## AI & Language Models

### ai-mastra
**Mastra agent framework** — Orchestrate multi-step LLM workflows

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit, ts-hono-api
- **Dependencies:** @mastra/core, @mastra/cloudflare-d1, @ai-sdk/anthropic
- **Env vars:** ANTHROPIC_API_KEY
- **Description:** Native Cloudflare D1 integration, multi-step agent chains
- **Use case:** Complex AI workflows, tool calling, D1 memory/storage
- **Example:** Document processing, customer support agents, data extraction

### ai-langchain-js
**LangChain.js** — Chain LLMs with tools and memory

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit, ts-hono-api
- **Dependencies:** @langchain/core, @langchain/anthropic
- **Env vars:** ANTHROPIC_API_KEY
- **Description:** Agentic chains, RAG, multi-model orchestration
- **Use case:** LLM chaining, retrieval-augmented generation (RAG)
- **Example:** Document Q&A, multi-step reasoning

### ai-langchain-py
**LangChain (Python)** — Python variant for FastAPI backends

- **Compatible with:** py-fastapi
- **Dependencies:** langchain-anthropic, langchain-core
- **Env vars:** ANTHROPIC_API_KEY
- **Description:** Same LangChain API as JS version, native Python
- **Use case:** Python-based backends, async/await chains

### ai-pydantic-ai
**Pydantic AI** — Structured output validation for LLM calls

- **Compatible with:** py-fastapi
- **Dependencies:** pydantic-ai
- **Env vars:** ANTHROPIC_API_KEY
- **Description:** Pydantic integration, guaranteed structured JSON output
- **Use case:** Parsing LLM responses into schemas, data validation
- **Example:** Extracting entities, generating JSON from text

### ai-vercel-sdk
**Vercel AI SDK** — Lightweight chat and streaming

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit, ts-hono-api
- **Dependencies:** ai, @ai-sdk/anthropic
- **Env vars:** ANTHROPIC_API_KEY
- **Description:** Minimal overhead, streaming responses, React hooks
- **Use case:** Chat UIs, streaming text generation
- **Example:** Real-time chatbot, streaming content generation

---

## Authentication

### auth-better-auth
**Better Auth** — Email/password + OAuth

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit
- **Dependencies:** better-auth
- **Env vars:** BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_BETTER_AUTH_URL
- **Wiring:** API route handlers, login/signup pages (variants)
- **Description:** Type-safe auth, session management, OAuth support
- **Use case:** User authentication, multi-tenant apps
- **PostInstall:** Requires secret generation: `openssl rand -hex 32`

### auth-py-jwt
**JWT (Python)** — JSON Web Token auth for FastAPI

- **Compatible with:** py-fastapi
- **Dependencies:** pyjwt
- **Env vars:** JWT_SECRET
- **Description:** Pure-Python JWT implementation (no C extensions, safe under Pyodide)
- **Use case:** Stateless auth for APIs, Python backends
- **Requires:** db-d1-sqlmodel for user table

---

## Database

### db-d1-drizzle
**Cloudflare D1 + Drizzle ORM** — SQLite with TypeScript ORM

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit, ts-hono-api
- **Dependencies:** drizzle-orm
- **DevDependencies:** drizzle-kit
- **Wiring:** wrangler.jsonc (D1 binding), db/schema/index.ts (schema exports)
- **Description:** Type-safe queries, migrations, D1 integration
- **Use case:** All TypeScript projects needing relational data
- **Page generator:** Auto-generates Drizzle schema files, types

### db-d1-sqlmodel
**Cloudflare D1 + SQLModel** — SQLite with Python SQLAlchemy-like ORM

- **Compatible with:** py-fastapi
- **Dependencies:** sqlmodel
- **Wiring:** wrangler.jsonc (D1 binding), migrations/ (SQL files)
- **Description:** Pydantic + SQLAlchemy, Pythonic ORM
- **Use case:** Python backends needing structured data
- **Page generator:** Auto-generates SQLModel schemas, migrations

---

## Testing

### testing-vitest
**Vitest + Testing Library** — Fast unit/component tests (TypeScript)

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit, ts-hono-api
- **DevDependencies:** vitest, @vitejs/plugin-react, @testing-library/react, jsdom
- **Scripts:** `npm run test` (run), `npm run test:watch` (watch)
- **Description:** Vite-native test runner, jsdom for DOM tests
- **Use case:** Component testing, unit tests
- **Example:** React component snapshots, hook testing

### testing-pytest
**pytest** — Python testing framework

- **Compatible with:** py-fastapi
- **Dependencies:** pytest
- **Scripts:** `uv run pytest`
- **Description:** Python standard test runner, async support
- **Use case:** API endpoint testing, business logic tests
- **Limitation:** Only covers pure Python logic; D1/js integration requires Pyodide runtime

---

## CI/CD

### ci-github-actions
**GitHub Actions** — Automated build, test, deploy pipeline

- **Compatible with:** ts-nextjs, ts-vite-react, ts-sveltekit, ts-hono-api
- **Files:** .github/workflows/ci.yml, .github/workflows/deploy.yml
- **CI workflow:** Lint, typecheck, test on every PR
- **Deploy workflow:** Auto-deploy to Cloudflare Workers on merge to main
- **Description:** Production-grade CI/CD
- **Requires:** Wrangler API token in GitHub secrets (CLOUDFLARE_API_TOKEN)

---

## Feature Compatibility Matrix

| Feature | ts-nextjs | ts-vite-react | ts-sveltekit | ts-hono-api | py-fastapi | shadcn-svelte | shadcn-vue |
|---------|:---------:|:-------------:|:------------:|:-----------:|:----------:|:-------------:|:----------:|
| ui-shadcn | ✓ | ✓ | ✓ | — | — | — | — |
| ui-aceternity | ✓ | ✓ | ✓ | — | — | — | — |
| ui-shadcn-svelte | — | — | — | — | — | ✓ | — |
| ui-shadcn-vue | — | — | — | — | — | — | ✓ |
| ai-mastra | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| ai-langchain-js | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| ai-langchain-py | — | — | — | — | ✓ | — | — |
| ai-pydantic-ai | — | — | — | — | ✓ | — | — |
| ai-vercel-sdk | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| auth-better-auth | ✓ | ✓ | ✓ | — | — | ✓ | ✓ |
| auth-py-jwt | — | — | — | — | ✓ | — | — |
| db-d1-drizzle | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| db-d1-sqlmodel | — | — | — | — | ✓ | — | — |
| testing-vitest | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| testing-pytest | — | — | — | — | ✓ | — | — |
| ci-github-actions | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Adding Custom Features

You can add custom features to your own registry. See [Registry Development](registry.md).
