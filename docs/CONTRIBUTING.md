# Contributing to hackpack

Thank you for interest in contributing! hackpack is built to be extended.

## Areas to Contribute

### 1. New Bases

A **base** is a framework template (Next.js, SvelteKit, FastAPI, etc.). Create a directory in `templates/bases/{base-name}/` with:

- `template.config.json` — metadata
- `package.json.hbs` or `pyproject.toml.hbs` — dependencies
- `tsconfig.json`, `wrangler.jsonc.hbs`, etc. — config files
- Source structure (e.g., `src/`, `app/`) — starter code
- `pages/_scaffold/{base-name}/scaffold.config.json` — CRUD page generator config

**Example:** Add `ts-remix` base:
```
templates/bases/ts-remix/
├── template.config.json
├── package.json.hbs
├── remix.config.js
├── wrangler.jsonc.hbs
├── tsconfig.json
├── app/
│   ├── root.tsx
│   ├── routes/
│   │   └── index.tsx
│   └── styles/
└── pages/_scaffold/ts-remix/
    ├── scaffold.config.json
    ├── list-page.tsx.hbs
    ├── detail-page.tsx.hbs
    ├── api-route.ts.hbs
    └── schema.ts.hbs
```

### 2. New Features

A **feature** is a modular add-on (DB, auth, AI, testing, UI kit). Create a directory in `templates/features/{feature-name}/` with:

- `template.config.json` — dependencies, wiring rules, env vars
- `files/` or `files-{base}/` — code to inject
- `migrations/` — database migrations (optional)

**Example:** Add `db-turso` feature:
```
templates/features/db-turso/
├── template.config.json
├── files/
│   └── lib/db.ts (Turso client)
└── env.example (TURSO_CONNECTION_URL)
```

Template config:
```json
{
  "name": "db-turso",
  "type": "feature",
  "category": "db",
  "description": "Turso SQLite (edge-hosted)",
  "compatibleWith": ["ts-nextjs", "ts-vite-react", "ts-sveltekit", "ts-hono-api"],
  "dependencies": { "@libsql/client": "^0.5.0" },
  "envVars": [{
    "key": "TURSO_CONNECTION_URL",
    "value": "REPLACE_ME",
    "comment": "get from https://turso.tech"
  }],
  "wiring": [],
  "postInstall": []
}
```

### 3. New Pages (Prebuilt)

Add a **page** in `templates/pages/{page-name}/` with variants for different auth features:

```
templates/pages/team/
├── page.config.json
└── variants/
    ├── auth-better-auth/
    │   └── files-ts-nextjs/
    │       └── app/team/page.tsx
    └── none/
        └── files-ts-nextjs/
            └── app/team/page.tsx
```

Page config:
```json
{
  "name": "team",
  "type": "page",
  "description": "Team management page",
  "requiresCategory": "auth",
  "wiring": [{
    "file": "components/dashboard-nav.tsx",
    "anchor": "{/* hackpack:nav-links */}",
    "insert": "<Link href=\"/team\">Team</Link>"
  }]
}
```

### 4. CLI Enhancements

- Bug fixes
- New flags / commands
- Better error messages
- Performance improvements

Clone and test locally:
```bash
cd cli
npm install
npm run selfcheck    # runs full integration test
npx bin/hackpack.ts new --help  # test CLI
```

### 5. Documentation

- Fix typos
- Improve examples
- Add FAQ section
- Document edge cases

---

## Development Setup

### Prerequisites
- Node.js 22.6.0+
- Git
- (Optional) Go 1.21+ for Go CLI work
- (Optional) Python 3.11+ for Python base testing

### Install

```bash
git clone https://github.com/yourusername/hackpack.git
cd hackpack/cli
npm install
npm run selfcheck    # verify everything works
```

### Make a Change

#### Option A: Add a feature
```bash
mkdir -p ../templates/features/my-feature/files
cat > ../templates/features/my-feature/template.config.json << 'EOF'
{
  "name": "my-feature",
  "type": "feature",
  "description": "My new feature",
  "compatibleWith": ["ts-nextjs"],
  "dependencies": {},
  "wiring": [],
  "postInstall": []
}
EOF

# Test:
npm run selfcheck    # should still pass
```

#### Option B: Fix a bug in the CLI
```bash
# Edit src/... files
npm run selfcheck    # test
```

#### Option C: Add a base
```bash
mkdir -p ../templates/bases/my-base/app
cat > ../templates/bases/my-base/template.config.json << 'EOF'
{
  "name": "my-base",
  "type": "base",
  "description": "My new base",
  "postInstall": []
}
EOF

mkdir ../templates/pages/_scaffold/my-base
cat > ../templates/pages/_scaffold/my-base/scaffold.config.json << 'EOF'
{
  "language": "ts",
  "templates": {
    "list-page.tsx.hbs": "app/{{entityName}}/page.tsx"
  },
  "wiring": []
}
EOF

# Test:
npm run selfcheck    # verify
```

### Run Self-Check Test

```bash
npm run selfcheck
```

This integration test:
1. Creates 2 full projects (ts-nextjs + py-fastapi)
2. Adds features to both
3. Generates custom CRUD pages
4. Tests NLP parser
5. Verifies all files + wiring

If it passes, your changes are solid.

### Test End-to-End

```bash
npx bin/hackpack.ts new my-test --base=ts-nextjs --features=ui-shadcn
cd my-test
npm install
npm run dev        # verify runs locally
npm run cf:deploy  # test deploy (dry-run)
```

---

## Submitting Changes

1. **Fork** the repository
2. **Create a branch** (`git checkout -b feature/my-feature`)
3. **Make changes** + test locally with `npm run selfcheck`
4. **Commit** with clear messages:
   ```bash
   git add .
   git commit -m "Add ts-remix base + page scaffolds"
   ```
5. **Push** to your fork
6. **Open a PR** with description of what you added/fixed

### PR Checklist
- [ ] `npm run selfcheck` passes
- [ ] Documentation updated (README, docs/, docs/index.html)
- [ ] Examples added (if applicable)
- [ ] No breaking changes to existing CLI API
- [ ] All new features have `compatibleWith` lists

---

## Code Style

- **TypeScript** — strict mode, no `any`
- **File naming** — camelCase for utilities, PascalCase for React components
- **Comments** — explain WHY, not WHAT
- **Git commits** — imperative mood ("Add feature", not "Added feature")

---

## Template Development Guidelines

### package.json.hbs / pyproject.toml.hbs

Use **semver ranges** that are stable but permissive:
- `"^1.0.0"` — accept minor/patch updates
- NOT `"latest"` or `"*"`

Keep dependencies **minimal**. Avoid bloat.

### Handlebars Templates

Available variables in page scaffolds:
- `{{entityName}}` — snake_case (orders)
- `{{entityNamePascal}}` — PascalCase (Orders)
- `{{fields}}` — array of `{name, type, tsType, pyType, ...}`
- `{{protected}}` — boolean (auth=protected?)

Available helpers:
- `{{#if condition}}` — conditional
- `{{#each fields}}` — iterate
- `{{capitalize name}}` — capitalize string
- `{{eq field 'value'}}` — equality check

### Wiring Rules

**Anchor format:**
- Comments: `// hackpack:anchor-name` (JavaScript/TypeScript)
- Comments: `# hackpack:anchor-name` (Python)
- HTML: `{/* hackpack:anchor-name */}`
- Svelte: `{<!-- hackpack:anchor-name -->}`

**Never hardcode wiring.** Always add anchors to base templates, feature declarations find them.

---

## Community

- **Discussions:** GitHub Discussions for ideas
- **Issues:** Bug reports, feature requests
- **Registries:** Build your own registry, share with the community

---

## License

All contributions are under MIT license. By submitting a PR, you agree to license your code under MIT.

---

**Thank you for building hackpack!** 🚀
