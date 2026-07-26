# Architecture Deep Dive

How hackpack works internally.

## Design Principles

1. **Data-Driven** — No code generation during compose. Everything is data: templates, configs, wiring rules. Keeps builds deterministic.
2. **Composable** — Bases, features, pages are orthogonal. Mix and match freely without side effects.
3. **Declarative Wiring** — No arbitrary code execution. All wiring is anchor comments in source files (safe, non-destructive).
4. **Type-Safe** — Zod, Drizzle, TypeScript everywhere. Catch bugs early.
5. **Portable** — Export to git repo. No vendor lock-in. Customize freely.

## Composition Flow

### `hackpack new`

```
1. Load registry (bundled or custom)
   ├─ bases/
   ├─ features/
   ├─ pages/
   └─ pages/_scaffold/

2. User selects:
   ├─ Base (framework + language)
   ├─ Features (modular add-ons)
   └─ Pages (prebuilt or none)

3. Layer by priority:
   ├─ Copy base files
   ├─ Apply each feature (merge dependencies, copy files, wiring)
   └─ Apply each page (variant resolution based on installed auth feature)

4. Handlebars template rendering
   ├─ {{projectName}} → user's project name
   └─ Wiring anchors → insertion points for routes, schema exports, etc.

5. Write project to disk
   ├─ package.json (merged dependencies)
   ├─ wrangler.jsonc (merged bindings)
   ├─ hackpack.json (metadata)
   ├─ hackpack.lock (reproducibility)
   └─ Source files

6. Optional: npm install + postInstall scripts
```

### `hackpack page add`

```
1. Load scaffold config for base (pages/_scaffold/{base}/scaffold.config.json)

2. User provides:
   ├─ Entity name (orders)
   ├─ Fields (name:string, price:number, userId:relation)
   ├─ Auth (protected|public)
   └─ Optional: --describe for NLP parsing

3. Determine type mappings
   ├─ TS types (string, number, boolean)
   ├─ Zod types (z.string(), z.number())
   ├─ SQL types (TEXT, REAL, INTEGER)
   └─ ORM-specific (Drizzle columns, SQLModel fields)

4. Render Handlebars templates
   ├─ list-page.tsx.hbs → app/orders/page.tsx
   ├─ detail-page.tsx.hbs → app/orders/[id]/page.tsx
   ├─ api-route.ts.hbs → app/api/orders/route.ts
   └─ schema.ts.hbs → db/schema/orders.ts

5. Apply wiring (anchor-based)
   ├─ Insert schema export into db/schema/index.ts
   ├─ Insert nav link into dashboard nav
   ├─ Update auth guard if auth=protected
   └─ All insertions at existing anchor comments

6. Return summary
   ├─ filesWritten: [list of created files]
   ├─ wiringApplied: [list of wiring successful]
   └─ wiringSkipped: [list of wiring that couldn't apply]
```

## Registry Format

```
my-registry/
├── bases/
│   └── ts-nextjs/
│       ├── template.config.json
│       ├── package.json.hbs (Handlebars)
│       ├── tsconfig.json
│       ├── wrangler.jsonc.hbs
│       ├── app/
│       │   ├── layout.tsx.hbs
│       │   ├── page.tsx
│       │   └── globals.css
│       └── ... (any project structure)
│
├── features/
│   └── db-d1-drizzle/
│       ├── template.config.json
│       ├── files-ts-nextjs/  (base-specific overlay)
│       │   └── db/
│       │       └── index.ts
│       ├── files/  (universal files)
│       │   └── db/
│       │       └── schema/
│       │           └── index.ts
│       └── migrations/  (optional DB migrations)
│
├── pages/
│   ├── landing/
│   │   ├── page.config.json
│   │   └── files-ts-nextjs/
│   │       └── app/
│   │           └── page.tsx.hbs
│   │
│   ├── login/
│   │   ├── page.config.json
│   │   └── variants/
│   │       ├── auth-better-auth/
│   │       │   └── files-ts-nextjs/
│   │       │       └── app/login/page.tsx
│   │       └── none/
│   │           └── files-ts-nextjs/
│   │               └── app/login/page.tsx
│   │
│   └── _scaffold/  (generator templates for `page add`)
│       └── ts-nextjs/
│           ├── scaffold.config.json
│           ├── list-page.tsx.hbs
│           ├── detail-page.tsx.hbs
│           ├── api-route.ts.hbs
│           └── schema.ts.hbs
│
└── registry.json  (optional: registry metadata, not used by CLI)
```

## Template Manifest Format

### Base

```json
{
  "name": "ts-nextjs",
  "type": "base",
  "description": "Next.js App Router + TypeScript + Tailwind",
  "postInstall": []
}
```

### Feature

```json
{
  "name": "db-d1-drizzle",
  "type": "feature",
  "category": "db",
  "description": "D1 + Drizzle ORM",
  "compatibleWith": ["ts-nextjs", "ts-vite-react", "ts-sveltekit", "ts-hono-api"],
  "dependencies": { "drizzle-orm": "^0.45.2" },
  "devDependencies": { "drizzle-kit": "^0.31.10" },
  "envVars": [
    { "key": "SOME_VAR", "value": "default", "comment": "explanation" }
  ],
  "wiring": [
    {
      "file": "wrangler.jsonc",
      "anchor": "// hackpack:bindings",
      "insert": ",\n  \"d1_databases\": [...]"
    }
  ],
  "postInstall": []
}
```

### Page

```json
{
  "name": "login",
  "type": "page",
  "description": "Login page",
  "requiresCategory": "auth",
  "wiring": [
    {
      "file": "components/app-nav.tsx",
      "anchor": "{/* hackpack:nav-links */}",
      "insert": "<Link href=\"/login\">Login</Link>"
    }
  ]
}
```

## Dependency Merging

### package.json (JavaScript)

```javascript
// Base:
{
  "dependencies": { "react": "^19.0.0", "next": "^15.1.0" },
  "devDependencies": { "typescript": "^5.7.2" }
}

// Feature (ui-shadcn):
{
  "dependencies": { "clsx": "^2.1.1" }
}

// Result (deep merge, feature deps added):
{
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.1.0",
    "clsx": "^2.1.1"  // ← from feature
  },
  "devDependencies": { "typescript": "^5.7.2" }
}
```

### pyproject.toml (Python)

```toml
# Base:
[project]
dependencies = ["fastapi>=0.115.0"]

# Feature (db-d1-sqlmodel):
dependencies = ["sqlmodel>=0.0.22"]

# Result (array append):
[project]
dependencies = [
  "fastapi>=0.115.0",
  "sqlmodel>=0.0.22"  # ← from feature
]
```

## Wiring (Anchor-Based)

All wiring is **declarative and non-destructive**. The CLI finds anchor comments and inserts new code at them.

### Example: Adding a route

**Before:**
```typescript
// app/page.tsx
export default function Home() { ... }

// app/layout.tsx
export default function RootLayout() { ... }
// hackpack:routes
```

**Feature declares wiring:**
```json
{
  "wiring": [{
    "file": "app/layout.tsx",
    "anchor": "// hackpack:routes",
    "insert": "import routes from './api/orders/route';"
  }]
}
```

**After:**
```typescript
// app/layout.tsx
export default function RootLayout() { ... }
// hackpack:routes
import routes from './api/orders/route';  // ← inserted here
```

**Key properties:**
- `file` — relative path in project
- `anchor` — exact comment string to find
- `insert` — code to insert before anchor comment
- `optional` (default: false) — if true, wiring skip quietly if anchor not found

## Multi-Registry Support

```bash
hackpack registry add work github:mycompany/templates
hackpack new my-project --registry=work
```

Resolution order:
1. Check if argument is a named registry in `~/.hackpack/config.json`
2. If not, treat as local path or git URL
3. Local paths: absolute or relative to cwd
4. Git URLs: `github:org/repo`, `gitlab:`, `https://...`

Git registries are cached in `~/.hackpack/cache/<sha1-hash>` and updated on next `new` call.

## Type Mappings

The generator maps field types to language-specific types:

```
Field Type  | TS Type | Zod Type | SQL Type | Drizzle | SQLModel | Python Type
:-----------|:-------:|:--------:|:--------:|:-------:|:--------:|:----------:
string      | string  | z.string() | TEXT | text() | str | str
number      | number  | z.number() | REAL | real() | float | float
boolean     | boolean | z.boolean() | INTEGER | integer({mode}) | bool | bool
date        | string  | z.string() | TEXT | integer({mode}) | str | str
relation    | string  | z.string() | TEXT | text() | str | str
```

Handlebars helpers in templates:
- `{{tsType}}` — JavaScript type
- `{{zodType}}` — Zod validator
- `{{sqlType}}` — SQL type
- `{{drizzleField}}` — Drizzle ORM column definition
- `{{pyType}}` — Python type
- `{{fields}}` — array of field specs with types
- `{{entityName}}` — snake_case entity name
- `{{entityNamePascal}}` — PascalCase entity name

## NLP Parser (Local)

`hackpack page add orders --describe "a list of products with name, price, and inventory"`

Uses `compromise` (lightweight, offline NLP library):

```
Input: "a list of products with name, price, and inventory"

Parse:
  ├─ Entity: "products" (detected as plural noun)
  ├─ Fields: extract nouns → [name, price, inventory]
  ├─ Types: heuristic guessing
  │   ├─ price → number (keyword "price")
  │   └─ inventory → number (keyword "count"/"inventory")
  └─ Auth: "public" (no auth keywords like "login"/"protected")

Output: {
  entity: "products",
  fields: [
    { name: "name", type: "string" },
    { name: "price", type: "number" },
    { name: "inventory", type: "number" }
  ],
  auth: "public",
  confidence: "high"
}
```

Confidence scoring:
- **high** — Entity found + ≥1 field found
- **low** — Vague input (e.g., "something cool")

Low confidence → falls back to interactive prompts instead of guessing.

## CLI Distribution

### TypeScript (npm)

- Full features (interactive wizard, remote git, NLP)
- Distributed via npm as executable script
- Requires Node.js 22.6.0+

### Go (optional)

- Minimal, self-contained binary
- No Node.js dependency
- Remote git support (git CLI), no NLP (uses `--describe` prompt fallback)
- Build: `go build -o hackpack ./cmd/hackpack`

## Reproducibility

Two metadata files ensure reproducible builds:

### hackpack.json
```json
{
  "base": "ts-nextjs",
  "features": ["ui-shadcn", "db-d1-drizzle", "auth-better-auth"],
  "pages": [
    { "name": "landing", "variant": null },
    { "name": "login", "variant": "auth-better-auth" },
    { "name": "dashboard", "variant": "auth-better-auth" }
  ]
}
```

### hackpack.lock
```json
{
  "registry": "bundled",
  "resolvedAt": "2026-07-26T12:00:00Z",
  "base": { "name": "ts-nextjs", "source": "bundled" },
  "features": [
    { "name": "ui-shadcn", "source": "bundled" },
    { "name": "db-d1-drizzle", "source": "bundled" }
  ],
  "pages": [...]
}
```

`hackpack update` re-applies features from locked registry, ensuring reproducible updates.

## Deployment

All bases are optimized for **Cloudflare Workers**:
- Next.js → OpenNext adapter
- Vite → custom Wrangler config
- SvelteKit → SvelteKit adapter
- Hono → native (already on Workers)
- FastAPI → Pyodide runtime

`hackpack deploy`:
1. Runs framework-specific build script (cf:deploy or equivalent)
2. Calls `wrangler deploy` with generated wrangler.jsonc
3. Prints live URL

Free tier limits:
- 100k requests/day
- 10ms CPU/request (the constraint that bites)
- D1: 5GB storage, 5M reads/day
- R2: 10GB storage
- KV: 100k reads + 1k writes/day
