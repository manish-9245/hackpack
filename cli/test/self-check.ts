import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { resolveRegistry } from "../src/registry.ts";
import { compose } from "../src/compose.ts";
import { generatePage } from "../src/generate.ts";
import { parseDescription } from "../src/nlp.ts";

async function readFile(p: string): Promise<string> {
  return fs.readFile(p, "utf-8");
}

async function main() {
  const registryPath = await resolveRegistry();
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "hackpack-selfcheck-"));
  const projectDir = path.join(tmp, "demo");

  // 1. compose() with the auth variant present — the full golden path.
  await compose({
    registryPath,
    registryLabel: "bundled",
    targetDir: projectDir,
    projectName: "demo",
    base: "ts-nextjs",
    features: ["ui-shadcn", "db-d1-drizzle", "auth-better-auth"],
    pages: ["landing", "login", "signup", "dashboard"],
  });

  assert.ok(await fs.stat(path.join(projectDir, "package.json")).then(() => true));
  const pkg = JSON.parse(await readFile(path.join(projectDir, "package.json")));
  assert.equal(pkg.name, "demo");
  assert.ok(pkg.dependencies["better-auth"], "auth-better-auth dependency merged into package.json");
  assert.ok(pkg.dependencies["drizzle-orm"], "db-d1-drizzle dependency merged into package.json");
  assert.ok(pkg.dependencies["clsx"], "ui-shadcn dependency merged into package.json");
  // regression check: a feature with no devDependencies of its own (ui-shadcn) must not
  // wipe out devDependencies contributed by the base or by a later feature.
  assert.ok(pkg.devDependencies["typescript"], "base devDependencies survived feature composition");
  assert.ok(pkg.devDependencies["drizzle-kit"], "db-d1-drizzle devDependency survived a later feature with none of its own");

  const wrangler = await readFile(path.join(projectDir, "wrangler.jsonc"));
  assert.ok(wrangler.includes('"d1_databases"'), "db-d1-drizzle wiring inserted into wrangler.jsonc");
  assert.ok(wrangler.includes('"name": "demo"'), "projectName templated into wrangler.jsonc");

  const loginPage = await readFile(path.join(projectDir, "app", "login", "page.tsx"));
  assert.ok(loginPage.includes("authClient.signIn.email"), "login page picked the better-auth variant, not the stub");

  const dashboardLayout = await readFile(path.join(projectDir, "app", "dashboard", "layout.tsx"));
  assert.ok(dashboardLayout.includes("redirect(\"/login\")"), "dashboard picked the guarded variant");

  const landingPage = await readFile(path.join(projectDir, "app", "page.tsx"));
  assert.ok(landingPage.includes("demo"), "landing page overwrote the base's default home page with projectName filled in");

  const hackpackJson = JSON.parse(await readFile(path.join(projectDir, "hackpack.json")));
  assert.deepEqual(hackpackJson.features, ["ui-shadcn", "db-d1-drizzle", "auth-better-auth"]);
  assert.equal(hackpackJson.pages.find((p: { name: string }) => p.name === "login").variant, "auth-better-auth");

  // 2. compose() with NO auth feature — pages must fall back to the "none" stub variant.
  const bareDir = path.join(tmp, "bare");
  await compose({
    registryPath,
    registryLabel: "bundled",
    targetDir: bareDir,
    projectName: "bare",
    base: "ts-nextjs",
    features: [],
    pages: ["login", "dashboard"],
  });
  const bareLogin = await readFile(path.join(bareDir, "app", "login", "page.tsx"));
  assert.ok(bareLogin.includes("No auth provider configured"), "login falls back to the stub when no auth feature is installed");
  const bareDashboardLayout = await readFile(path.join(bareDir, "app", "dashboard", "layout.tsx"));
  assert.ok(!bareDashboardLayout.includes("redirect(\"/login\")"), "dashboard has no route guard when no auth feature is installed");

  // 3. hackpack page add --fields — deterministic CRUD generator + wiring.
  const genResult = await generatePage({
    registryPath,
    targetDir: projectDir,
    base: "ts-nextjs",
    entityName: "orders",
    fields: [
      { name: "title", type: "string" },
      { name: "price", type: "number" },
      { name: "userId", type: "relation" },
    ],
    auth: "protected",
  });
  assert.equal(genResult.filesWritten.length, 4);
  assert.deepEqual(genResult.wiringApplied.sort(), ["components/dashboard-nav.tsx", "db/schema/index.ts"]);

  const schema = await readFile(path.join(projectDir, "db", "schema", "orders.ts"));
  assert.ok(schema.includes('sqliteTable("orders"'));
  assert.ok(schema.includes('price: real("price")'));
  assert.ok(schema.includes('userId: text("userId")'));

  const schemaIndex = await readFile(path.join(projectDir, "db", "schema", "index.ts"));
  assert.ok(schemaIndex.includes('export * from "./orders";'));
  assert.ok(schemaIndex.trim().endsWith("// hackpack:schema-exports"), "anchor stays in place for the next page add");

  const nav = await readFile(path.join(projectDir, "components", "dashboard-nav.tsx"));
  assert.ok(nav.includes('<Link href="/orders">Orders</Link>'));

  const listPage = await readFile(path.join(projectDir, "app", "orders", "page.tsx"));
  assert.ok(listPage.includes("redirect"), "protected flag pulled in the auth guard");
  assert.ok(listPage.includes("price: number"));

  // 4. page add against a project with a dashboard but no db feature — schema wiring
  // should be skipped gracefully (best-effort), not throw; nav wiring still applies.
  const genResult2 = await generatePage({
    registryPath,
    targetDir: bareDir,
    base: "ts-nextjs",
    entityName: "notes",
    fields: [{ name: "body", type: "string" }],
    auth: "public",
  });
  assert.deepEqual(genResult2.wiringApplied, ["components/dashboard-nav.tsx"]);
  assert.equal(genResult2.wiringSkipped.length, 1);

  // 5. local NLP parser — the actual "--describe" path, offline, no LLM call.
  const parsed = parseDescription(
    "a page for orders with a title, a price, and a user relation, behind login",
  );
  assert.equal(parsed.entity, "orders");
  assert.equal(parsed.confidence, "high");
  assert.equal(parsed.auth, "protected");
  assert.deepEqual(
    parsed.fields.map((f) => `${f.name}:${f.type}`),
    ["title:string", "price:number", "userId:relation"],
  );

  const vague = parseDescription("something cool");
  assert.equal(vague.confidence, "low", "parser reports low confidence instead of guessing on vague input");

  // 6. py-fastapi: pyproject.toml dependency merge + JWT auth + D1 + CRUD scaffold,
  // verified for real in the design pass (uv sync, py_compile, pytest all ran green;
  // `from app.main import app` genuinely requires Pyodide once auth-py-jwt is wired
  // in, since `asgi` imports `js` at module load — that's an inherent Python Workers
  // constraint, not a bug, so this only re-checks the parts compose/generate own).
  const pyDir = path.join(tmp, "pydemo");
  await compose({
    registryPath,
    registryLabel: "bundled",
    targetDir: pyDir,
    projectName: "pydemo",
    base: "py-fastapi",
    features: ["db-d1-sqlmodel", "auth-py-jwt", "testing-pytest"],
    pages: [],
  });
  const pyproject = await readFile(path.join(pyDir, "pyproject.toml"));
  assert.ok(pyproject.includes('"fastapi>=0.115.0"'), "base dependency present");
  assert.ok(pyproject.includes('"sqlmodel>=0.0.22"'), "db-d1-sqlmodel merged into pyproject.toml dependencies");
  assert.ok(pyproject.includes('"pyjwt>=2.10.0"'), "auth-py-jwt merged into pyproject.toml dependencies");
  assert.ok(pyproject.includes('"pytest>=8.3.0"'), "testing-pytest merged into pyproject.toml dependencies");
  const pyPkg = JSON.parse(await readFile(path.join(pyDir, "package.json")));
  assert.equal(pyPkg.scripts.test, "uv run pytest", "testing-pytest merged its script into package.json");

  const pyMainBefore = await readFile(path.join(pyDir, "src", "app", "main.py"));
  assert.ok(pyMainBefore.includes("from app.auth.routes import router as auth_router"));
  assert.ok(pyMainBefore.includes("app.include_router(auth_router)"));

  const pyGen = await generatePage({
    registryPath,
    targetDir: pyDir,
    base: "py-fastapi",
    entityName: "orders",
    fields: [
      { name: "title", type: "string" },
      { name: "price", type: "number" },
      { name: "userId", type: "relation" },
    ],
    auth: "protected",
  });
  assert.deepEqual(pyGen.filesWritten.sort(), [
    "migrations/orders.sql",
    "src/app/orders/__init__.py",
    "src/app/orders/routes.py",
    "src/app/orders/schema.py",
  ]);
  const pySchema = await readFile(path.join(pyDir, "src", "app", "orders", "schema.py"));
  assert.ok(pySchema.includes("price: float"));
  assert.ok(pySchema.includes("userId: str"));
  const pyRoutes = await readFile(path.join(pyDir, "src", "app", "orders", "routes.py"));
  assert.ok(pyRoutes.includes("Depends(get_current_user_id)"), "protected flag pulled in the auth dependency");
  const pyMigration = await readFile(path.join(pyDir, "migrations", "orders.sql"));
  assert.ok(pyMigration.includes("price REAL"));

  await fs.rm(tmp, { recursive: true, force: true });
  console.log("self-check: all assertions passed");
}

main().catch((err) => {
  console.error("self-check FAILED:", err);
  process.exit(1);
});
