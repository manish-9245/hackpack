# hackpack v1.6 Execution Plan — Mascot, Full Customization, World-Class Boilerplate

> **How to use this document:** This is a fully detailed, ordered execution plan
> for a future session (intended to be run with a smaller/cheaper model) to
> implement without needing to re-explore the codebase. Follow the parts in
> order (A → B → C). Each step names the exact file, the exact action, and
> exact code/content to write. Run the "Verify" command at the end of each part
> before moving to the next. Do not skip steps or improvise scope beyond what's
> written here — if something doesn't match reality (a file has moved, content
> differs from what's quoted below), stop and re-read that file before
> proceeding, don't guess.

## Context (why this exists)

hackpack is a hackathon scaffolding CLI (`cli/` = TypeScript/citty, `go-cli/` =
Go/cobra) that composes projects from `templates/bases/`, `templates/features/`,
and `templates/pages/`. v1.5 shipped 7 bases / 16 features feature-complete but
visually bare: an unused ASCII banner, a thin wizard (name/base/features/pages
only), and minimal boilerplate (no README/license/editorconfig, placeholder
default pages). This plan adds:

- **Part A** — a "Packy" ASCII mascot + colorized banner, wired into the TS CLI
  (Go CLI gets a plain static banner only, no new deps/wizard — intentional,
  Go CLI's non-interactive design is a deliberate existing choice, not a gap).
- **Part B** — a full customization surface in `hackpack new`'s wizard (package
  manager, git init, license, author, description).
- **Part C** — baseline hygiene (README, `.editorconfig`, LICENSE, `.env.example`,
  redesigned default pages using the existing-but-unused `docs/DESIGN_SYSTEM.md`
  tokens) baked into **every** base by default, plus Python CI support.

Explicitly out of scope (v2 stretch, don't touch): Go binary packaging/release
workflows, community registries, `hackpack.lock` reproducible updates, extra
page presets, more Aceternity components.

Work in `cli/` (Node/TS, entry `cli/bin/hackpack.ts`), `go-cli/` (Go, entry
`go-cli/cmd/hackpack/main.go`), and `templates/` (the shared, data-only
registry both CLIs read from).

---

## Part A — Mascot + ASCII banner (TS CLI)

### A1. Add `picocolors` as a direct dependency

**File:** `cli/package.json`

It's already present transitively (pulled in by another package per the
lockfile) — this just makes it explicit so `cli/src` can `import` it. Add it
to `"dependencies"`, keeping keys alphabetical:

```json
  "dependencies": {
    "@clack/prompts": "^0.9.1",
    "citty": "^0.1.6",
    "compromise": "^14.14.4",
    "execa": "^9.5.2",
    "giget": "^3.3.1",
    "handlebars": "^4.7.8",
    "picocolors": "^1.1.1"
  },
```

Then run:
```bash
cd cli && npm install
```

### A2. Rewrite `cli/src/banner.ts`

Full replacement of the file (keep all five existing exported functions —
`showBases`, `showFeatures`, `showPages`, `showExamples`, `showHelp` — just add
color and the Packy mascot to `showWelcome`, and a colored header to the rest
for consistency):

```ts
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
    • Full docs: https://hackpack.dev
    • GitHub: https://github.com/yourusername/hackpack
    • Issues: https://github.com/yourusername/hackpack/issues
  `);
}
```

`picocolors` auto-detects non-TTY/`NO_COLOR` and disables itself — no extra
handling needed.

### A3. Show the banner on bare invocation / `--help`

**File:** `cli/bin/hackpack.ts`

Current content:
```ts
#!/usr/bin/env node
import { runMain } from "citty";
import { main } from "../src/index.ts";

runMain(main);
```

Replace with:
```ts
#!/usr/bin/env node
import { runMain } from "citty";
import { main } from "../src/index.ts";
import { showWelcome } from "../src/banner.ts";

const rest = process.argv.slice(2);
if (rest.length === 0 || rest.includes("--help") || rest.includes("-h")) {
  showWelcome();
}

runMain(main);
```

This shows the mascot once on `hackpack` (no args) and on `hackpack --help` /
`hackpack <subcommand> --help`, but not on every ordinary command run.

### A4. Show the banner at the start of the `new` wizard

**File:** `cli/src/commands/new.ts`

Add the import:
```ts
import { showWelcome } from "../banner.ts";
```

Find this line (inside `run({ args })`, right after `const interactive = !args.yes;`):
```ts
    const interactive = !args.yes;
    if (interactive) clack.intro("hackpack");
```

Replace with:
```ts
    const interactive = !args.yes;
    if (interactive) {
      showWelcome();
      clack.intro("hackpack new");
    }
```

(Bare `hackpack` already shows the banner via A3, but `hackpack new` is
commonly run directly too, so show it there as well — `showWelcome()` is cheap
and idempotent, no reason to gate it further.)

### A5. Go CLI — plain static banner only (no wizard, no new deps)

**File:** `go-cli/cmd/hackpack/main.go`

Current content:
```go
// Command hackpack is a Go port of the TS hackpack CLI (cli/), consuming the
// same data-only registry at templates/. See go-cli's top-level report for
// scope and known gaps (NLP --describe, remote git registries, interactive
// wizard — all intentionally not ported).
package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func main() {
	root := &cobra.Command{
		Use:   "hackpack",
		Short: "Scaffold hackathon projects from a template registry",
	}
	root.AddCommand(
		newNewCmd(),
		newAddCmd(),
		newPageCmd(),
		newDeployCmd(),
		newRegistryCmd(),
		newUpdateCmd(),
	)
	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}
```

Replace with (adds a plain-text `banner` constant + prints it only on bare
invocation or `--help`/`-h`, so ordinary command runs stay unaffected — no new
imports, no ANSI codes):

```go
// Command hackpack is a Go port of the TS hackpack CLI (cli/), consuming the
// same data-only registry at templates/. See go-cli's top-level report for
// scope and known gaps (NLP --describe, remote git registries, interactive
// wizard — all intentionally not ported).
package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// Same glyph-for-glyph mascot as the TS CLI's banner.ts (uncolored — Go CLI
// takes on no color dependency). Raw string literal: backslashes below are
// literal, not escapes.
const banner = `
      .        
     (o)       
      |        
   ^       ^   
  / '.___.' \  
 |  o     o  | 
 |     v     | 
  \_________/  
   .-------.   
  /  o---o  \  
 |  |▓▓▓▓▓|  | 
  \  o---o  /  
   '-------'   

    HACKPACK — Scaffold full-stack hackathon projects in seconds.
`

func main() {
	if len(os.Args) <= 1 || os.Args[1] == "--help" || os.Args[1] == "-h" {
		fmt.Println(banner)
	}

	root := &cobra.Command{
		Use:   "hackpack",
		Short: "Scaffold hackathon projects from a template registry",
	}
	root.AddCommand(
		newNewCmd(),
		newAddCmd(),
		newPageCmd(),
		newDeployCmd(),
		newRegistryCmd(),
		newUpdateCmd(),
	)
	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}
```

(No emoji/backpack glyph in the Go version's mascot — kept ASCII-only since
Go CLI output should stay copy-paste-safe in any terminal encoding.)

### Verify Part A
```bash
cd cli && npm install && npm run selfcheck
node --no-warnings bin/hackpack.ts               # bare invocation shows banner
node --no-warnings bin/hackpack.ts --help        # shows banner + citty help
node --no-warnings bin/hackpack.ts new /tmp/hp-banner-test --base ts-nextjs --yes --install=false
cd ../go-cli && go build ./... && ./hackpack --help   # shows plain banner, no regressions
```

---

## Part B — Full customization surface (TS CLI, `hackpack new`)

New flags + matching wizard prompts:

| Customization | Flag | Wizard prompt | Default |
|---|---|---|---|
| Package manager | `--pm <npm\|pnpm\|yarn\|bun>` | select | `npm` |
| Git init + first commit | `--git` / `--no-git` | confirm | `true` |
| License | `--license <mit\|apache-2.0\|none>` | select | `mit` |
| Author/org name | `--author` | text | `git config user.name` (empty if unset) |
| Project description | `--description` | text | `""` |

### B1. Extend shared types

**File:** `cli/src/types.ts`

Add fields to `HackpackManifest` (keep everything else in the file unchanged):

```ts
export interface HackpackManifest {
  base: string;
  features: string[];
  pages: InstalledPage[];
  createdAt: string;
  author?: string;
  description?: string;
  license?: "mit" | "apache-2.0" | "none";
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
}
```

### B2. Add package-manager helper

**File:** `cli/src/fsutil.ts`

Append at the end of the file:

```ts
const PM_INSTALL: Record<string, [string, string[]]> = {
  npm: ["npm", ["install"]],
  pnpm: ["pnpm", ["install"]],
  yarn: ["yarn", []],
  bun: ["bun", ["install"]],
};

/** Maps a package manager name to its install command + args. Falls back to npm
 * for anything unrecognized rather than throwing — scaffolding shouldn't hard-fail
 * over a typo'd --pm value. */
export function installCommandFor(packageManager: string | undefined): [string, string[]] {
  return PM_INSTALL[packageManager ?? "npm"] ?? PM_INSTALL.npm;
}
```

### B3. Add shared license bodies under `templates/_common/`

**New file:** `templates/_common/LICENSE-MIT.hbs`

```
MIT License

Copyright (c) {{year}} {{author}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**New file:** `templates/_common/LICENSE-APACHE-2.0.hbs`

```
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing
      the origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

   Copyright {{year}} {{author}}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

### B4. `new.ts` wizard + flags

**File:** `cli/src/commands/new.ts`

Full replacement of the file:

```ts
import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import * as clack from "@clack/prompts";
import { execa } from "execa";
import { resolveRegistry, listTemplates } from "../registry.ts";
import { compose } from "../compose.ts";
import { pathExists, installCommandFor } from "../fsutil.ts";
import { showWelcome } from "../banner.ts";

function splitCsv(value?: string): string[] {
  return value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

async function defaultAuthor(): Promise<string> {
  try {
    const { stdout } = await execa("git", ["config", "user.name"]);
    return stdout.trim();
  } catch {
    return "";
  }
}

export const newCommand = defineCommand({
  meta: { name: "new", description: "Scaffold a new hackathon project" },
  args: {
    name: { type: "positional", required: false, description: "Project name / directory" },
    base: { type: "string", description: "Base template name (e.g. ts-nextjs)" },
    features: { type: "string", description: "Comma-separated feature names" },
    pages: { type: "string", description: "Comma-separated page names" },
    registry: { type: "string", description: "Path to a template registry (defaults to the bundled one)" },
    yes: { type: "boolean", description: "Skip prompts, accept defaults, run installs non-interactively" },
    install: { type: "boolean", description: "Run the install command after scaffolding", default: true },
    pm: { type: "string", description: "Package manager: npm | pnpm | yarn | bun", default: "npm" },
    git: { type: "boolean", description: "Run git init + first commit", default: true },
    license: { type: "string", description: "License: mit | apache-2.0 | none", default: "mit" },
    author: { type: "string", description: "Author/org name (used in LICENSE, package.json, README)" },
    description: { type: "string", description: "Project description", default: "" },
  },
  async run({ args }) {
    const registryPath = await resolveRegistry(args.registry);
    const registryLabel = args.registry ?? "bundled";

    const interactive = !args.yes;
    if (interactive) {
      showWelcome();
      clack.intro("hackpack new");
    }

    const projectName =
      args.name ??
      (interactive
        ? String(await clack.text({ message: "Project name", placeholder: "my-hack" }))
        : (() => {
            throw new Error("Project name is required (pass it positionally or with --yes and a default)");
          })());

    const targetDir = path.resolve(process.cwd(), projectName);
    if (await pathExists(targetDir)) {
      const files = await fs.readdir(targetDir);
      if (files.length > 0) throw new Error(`Directory "${projectName}" already exists and isn't empty`);
    }

    const bases = await listTemplates(registryPath, "base");
    let base = args.base;
    if (!base) {
      if (!interactive) throw new Error("--base is required with --yes");
      base = String(
        await clack.select({
          message: "Base template",
          options: bases.map((b) => ({ value: b.name, label: b.name, hint: b.description })),
        }),
      );
    }
    if (!bases.some((b) => b.name === base)) {
      throw new Error(`Unknown base "${base}". Available: ${bases.map((b) => b.name).join(", ")}`);
    }

    const allFeatures = (await listTemplates(registryPath, "feature")).filter(
      (f) => !f.compatibleWith?.length || f.compatibleWith.includes(base),
    );
    let features = splitCsv(args.features);
    if (!args.features && interactive) {
      const picked = await clack.multiselect({
        message: "Features",
        options: allFeatures.map((f) => ({ value: f.name, label: f.name, hint: f.description })),
        required: false,
      });
      features = clack.isCancel(picked) ? [] : (picked as string[]);
    }

    const allPages = (await listTemplates(registryPath, "page")).filter(
      (p) => !p.compatibleWith?.length || p.compatibleWith.includes(base),
    );
    let pages = splitCsv(args.pages);
    if (!args.pages && interactive) {
      const picked = await clack.multiselect({
        message: "Pages",
        options: allPages.map((p) => ({ value: p.name, label: p.name, hint: p.description })),
        required: false,
      });
      pages = clack.isCancel(picked) ? [] : (picked as string[]);
    }

    // --- v1.6 customization surface ---
    let packageManager = args.pm;
    if (!args.pm && interactive) {
      packageManager = String(
        await clack.select({
          message: "Package manager",
          options: [
            { value: "npm", label: "npm" },
            { value: "pnpm", label: "pnpm" },
            { value: "yarn", label: "yarn" },
            { value: "bun", label: "bun" },
          ],
          initialValue: "npm",
        }),
      );
    }

    let gitInit = args.git;
    if (interactive) {
      const picked = await clack.confirm({ message: "Initialize a git repository?", initialValue: true });
      gitInit = clack.isCancel(picked) ? false : picked;
    }

    let license = args.license;
    if (!args.license && interactive) {
      license = String(
        await clack.select({
          message: "License",
          options: [
            { value: "mit", label: "MIT" },
            { value: "apache-2.0", label: "Apache 2.0" },
            { value: "none", label: "None" },
          ],
          initialValue: "mit",
        }),
      );
    }

    let author = args.author;
    if (author === undefined) {
      const gitAuthor = await defaultAuthor();
      author = interactive
        ? String(await clack.text({ message: "Author/org name", placeholder: gitAuthor || "Jane Doe", initialValue: gitAuthor }))
        : gitAuthor;
    }

    let description = args.description;
    if (!args.description && interactive) {
      const picked = await clack.text({ message: "Project description", placeholder: "(optional)" });
      description = clack.isCancel(picked) ? "" : String(picked);
    }

    const spinner = interactive ? clack.spinner() : null;
    spinner?.start("Composing project");
    const { postInstall } = await compose({
      registryPath,
      registryLabel,
      targetDir,
      projectName,
      base,
      features,
      pages,
      author,
      description,
      license: license as "mit" | "apache-2.0" | "none",
      packageManager: packageManager as "npm" | "pnpm" | "yarn" | "bun",
    });
    spinner?.stop("Project composed");

    if (gitInit) {
      const gitSpinner = interactive ? clack.spinner() : null;
      gitSpinner?.start("Initializing git repository");
      await execa("git", ["init"], { cwd: targetDir });
      await execa("git", ["add", "-A"], { cwd: targetDir });
      await execa("git", ["commit", "-m", "Initial commit (hackpack scaffold)"], { cwd: targetDir }).catch(() => {
        // no git user configured yet — leave the repo initialized but uncommitted rather than failing the scaffold
      });
      gitSpinner?.stop("Git repository initialized");
    }

    if (args.install) {
      const [bin, installArgs] = installCommandFor(packageManager);
      const installSpinner = interactive ? clack.spinner() : null;
      installSpinner?.start(`Installing dependencies (${bin})`);
      await execa(bin, installArgs, { cwd: targetDir });
      installSpinner?.stop("Dependencies installed");

      for (const cmd of postInstall) {
        const [postBin, ...rest] = cmd.split(" ");
        const cmdSpinner = interactive ? clack.spinner() : null;
        cmdSpinner?.start(cmd);
        await execa(postBin, rest, { cwd: targetDir });
        cmdSpinner?.stop(cmd);
      }
    }

    const [pmBin] = installCommandFor(packageManager);
    const summary = [
      `cd ${projectName}`,
      ...(args.install ? [] : [`${pmBin} install`]),
      `${pmBin} run dev`,
      "npx hackpack deploy   # when ready to ship",
    ].join("\n  ");

    if (interactive) {
      clack.outro(`Done. Next steps:\n\n  ${summary}`);
    } else {
      console.log(`Done. Next steps:\n  ${summary}`);
    }
  },
});
```

Notes:
- `yarn`'s install command is bare `yarn` (no `install` subcommand needed, but
  `yarn install` also works — using bare `yarn` matches Yarn's own convention).
- The git commit is best-effort (`.catch()`) since a machine with no
  `git config user.email`/`user.name` set would otherwise fail the whole
  scaffold over an unrelated git config issue — `git init` itself always runs.

### B5. Pass new vars through `compose()` + copy the `_common` layer

**File:** `cli/src/compose.ts`

Update `ComposeOptions`:
```ts
export interface ComposeOptions {
  registryPath: string;
  registryLabel: string;
  targetDir: string;
  projectName: string;
  base: string;
  features: string[];
  pages: string[];
  author?: string;
  description?: string;
  license?: "mit" | "apache-2.0" | "none";
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
}
```

Update the start of `compose()`:
```ts
export async function compose(opts: ComposeOptions): Promise<ComposeResult> {
  const { registryPath, targetDir, projectName, base, features, pages } = opts;
  const author = opts.author ?? "";
  const description = opts.description ?? "";
  const license = opts.license ?? "mit";
  const packageManager = opts.packageManager ?? "npm";
  const vars = {
    projectName,
    author,
    description,
    year: String(new Date().getFullYear()),
    pm: packageManager,
  };
  const postInstall: string[] = [];

  // Universal hygiene layer (README, .editorconfig, .env.example baseline) —
  // copied before the base so a base can still override a file by shipping
  // its own same-named file (none currently do).
  const commonDir = path.join(registryPath, "_common");
  if (await pathExists(commonDir)) {
    await copyTemplateDir(commonDir, targetDir, vars);
  }
  if (license !== "none") {
    const licenseFile = license === "apache-2.0" ? "LICENSE-APACHE-2.0.hbs" : "LICENSE-MIT.hbs";
    const licenseSrc = path.join(commonDir, licenseFile);
    if (await pathExists(licenseSrc)) {
      const raw = await fs.readFile(licenseSrc, "utf-8");
      const Handlebars = (await import("handlebars")).default;
      await fs.writeFile(path.join(targetDir, "LICENSE"), Handlebars.compile(raw)(vars));
    }
  }

  const baseManifest = await loadManifest(registryPath, "base", base);
  await copyTemplateDir(templateDir(registryPath, "base", base), targetDir, vars);
  postInstall.push(...(baseManifest.postInstall ?? []));
```

(Leave the rest of `compose()` — the features loop, pages loop, `hackpack.json`/
`hackpack.lock` writes — unchanged, except `hackpack.json`'s object literal,
covered next.)

Update the `hackpackJson` object near the end of `compose()`:
```ts
  const hackpackJson: HackpackManifest = {
    base,
    features,
    pages: installedPages,
    createdAt: new Date().toISOString(),
    author: author || undefined,
    description: description || undefined,
    license,
    packageManager,
  };
```

Add `import path from "node:path";`'s neighbor import — `fs` is already
imported at the top of `compose.ts`; `path` is already imported too. No new
top-level imports needed except the dynamic `import("handlebars")` used above
(kept dynamic/inline to avoid a second static import of `Handlebars` colliding
with `copyTemplateDir`'s own internal use — if you prefer, instead add
`import Handlebars from "handlebars";` at the top of `compose.ts` and drop the
`const Handlebars = (await import(...))` line; both work, static import is
slightly cleaner and is the preferred version if you're doing this by hand).

### B6. `_common/README.md.hbs`, `.editorconfig`, `.env.example` baseline

**New file:** `templates/_common/README.md.hbs`

```markdown
# {{projectName}}

{{#if description}}
{{description}}
{{/if}}

Built with [hackpack](https://hackpack.dev).

## Getting started

```bash
{{pm}} install
{{pm}} run dev
```

## Deploy

```bash
npx hackpack deploy
```

{{#if author}}
## Author

{{author}}
{{/if}}
```

**New file:** `templates/_common/.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

**New file:** `templates/_common/.env.example`

```
# Environment variables for {{projectName}}.
# Feature-specific variables are appended below this line as you add features.
```

Note: `.env.example` here is a plain static file (not `.hbs`) *except* it does
contain `{{projectName}}` — since `copyTemplateDir` only renders files ending
in `.hbs`, rename this to `.env.example.hbs` instead so the placeholder
actually renders (it will be written out as `.env.example`, matching what
`appendEnvVars()` in `fsutil.ts` already expects/appends to). **Use the
filename `templates/_common/.env.example.hbs`, not `.env.example`.**

### Verify Part B
```bash
cd cli && npm install
node --no-warnings bin/hackpack.ts new /tmp/hp-test-full \
  --base ts-nextjs --yes --pm pnpm --license apache-2.0 \
  --author "Test Author" --description "A test project" --install=false
ls -la /tmp/hp-test-full          # expect: README.md, LICENSE, .editorconfig, .env.example, hackpack.json
cat /tmp/hp-test-full/LICENSE      # expect Apache-2.0 body with "Test Author" and current year
cat /tmp/hp-test-full/hackpack.json  # expect author/description/license/packageManager fields set
git -C /tmp/hp-test-full log --oneline  # expect one commit (if git user.email/name configured), or an initialized repo
```

---

## Part C — World-class boilerplate (baked into every base)

### C1. Extend Tailwind config with the existing design tokens

`docs/DESIGN_SYSTEM.md` already defines a full semantic color palette
(`primary`, `success`, `warning`, `error`, `accent.*`, `surface.*`) that no
base's `tailwind.config.ts` currently uses (`theme.extend` is empty in all of
them). Apply this identical `theme.extend.colors` block to the 5 Tailwind-based
bases: `ts-nextjs`, `ts-vite-react`, `ts-sveltekit`, `shadcn-svelte`,
`shadcn-vue` (all currently have `theme: { extend: {} }`).

**Files:** `templates/bases/{ts-nextjs,ts-vite-react,ts-sveltekit,shadcn-svelte,shadcn-vue}/tailwind.config.ts`

Replace `theme: { extend: {} },` with:
```ts
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#3b82f6", dark: "#1e40af", light: "#60a5fa" },
        success: { DEFAULT: "#10b981", dark: "#059669", light: "#6ee7b7" },
        warning: { DEFAULT: "#f59e0b", dark: "#d97706", light: "#fbbf24" },
        error: { DEFAULT: "#ef4444", dark: "#dc2626", light: "#f87171" },
        accent: { pink: "#ec4899", purple: "#8b5cf6", orange: "#f97316", indigo: "#6366f1" },
        surface: { base: "#0f172a", elevated: "#1a2a4a", muted: "#1e293b" },
      },
    },
  },
```

(Everything else in each file — `content`, `plugins` — stays the same. Check
each file's exact current `content` glob before editing since they differ
slightly per framework; only touch the `theme` block.)

### C2. Redesign the default page per base

Replace the literal "Welcome to your hackpack project" placeholder in each of
these 7 files. Keep each file non-`.hbs` (static) as it is today — none of
these currently receive template vars, and none need to; `layout.tsx.hbs` (or
equivalent) already handles the page `<title>`.

**`templates/bases/ts-nextjs/app/page.tsx`:**
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-base p-24 text-center">
      <pre className="text-primary text-xs leading-tight">{`   /\\_/\\
  ( ^.^ )
 =( 🎒 )=`}</pre>
      <h1 className="text-4xl font-bold text-slate-100">Welcome to your hackpack project</h1>
      <p className="max-w-md text-slate-400">
        Edit <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm">app/page.tsx</code> to get started.
      </p>
      <a
        href="https://hackpack.dev/docs"
        className="rounded-sm bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
      >
        View Docs
      </a>
    </main>
  );
}
```

**`templates/bases/ts-vite-react/src/App.tsx`:**
```tsx
export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-base p-24 text-center">
      <pre className="text-primary text-xs leading-tight">{`   /\\_/\\
  ( ^.^ )
 =( 🎒 )=`}</pre>
      <h1 className="text-4xl font-bold text-slate-100">Welcome to your hackpack project</h1>
      <p className="max-w-md text-slate-400">
        Edit <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm">src/App.tsx</code> to get started.
      </p>
      <a
        href="https://hackpack.dev/docs"
        className="rounded-sm bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
      >
        View Docs
      </a>
    </main>
  );
}
```

**`templates/bases/ts-sveltekit/src/routes/+page.svelte`** (and identically
**`templates/bases/shadcn-svelte/src/routes/+page.svelte`**):
```svelte
<main>
  <pre>{`   /\\_/\\
  ( ^.^ )
 =( 🎒 )=`}</pre>
  <h1>Welcome to your hackpack project</h1>
  <p>Edit <code>src/routes/+page.svelte</code> to get started.</p>
  <a href="https://hackpack.dev/docs">View Docs</a>
</main>

<style>
  main {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    background: #0f172a;
    padding: 6rem;
    text-align: center;
  }
  pre {
    color: #3b82f6;
    font-size: 0.75rem;
    line-height: 1.2;
  }
  h1 {
    font-size: 2.25rem;
    font-weight: bold;
    color: #f1f5f9;
  }
  p {
    color: #94a3b8;
    max-width: 28rem;
  }
  code {
    background: #1e293b;
    border-radius: 4px;
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
  }
  a {
    background: #3b82f6;
    color: white;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
  }
  a:hover {
    background: #1e40af;
  }
</style>
```

**`templates/bases/shadcn-vue/app.vue`:**
```vue
<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-base p-24 text-center">
    <pre class="text-primary text-xs leading-tight">{{ mascot }}</pre>
    <h1 class="text-4xl font-bold text-slate-100">Welcome to your hackpack project</h1>
    <p class="max-w-md text-slate-400">
      Edit <code class="rounded bg-surface-muted px-1.5 py-0.5 text-sm">app.vue</code> to get started.
    </p>
    <a
      href="https://hackpack.dev/docs"
      class="rounded-sm bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
    >
      View Docs
    </a>
  </div>
</template>

<script setup>
const mascot = "   /\\_/\\\n  ( ^.^ )\n =( \u{1F392} )=";
</script>
```

**`templates/bases/ts-hono-api/src/index.ts`** — polish the JSON welcome
payload (keep the rest of the file, including `# hackpack:routes`, unchanged):
```ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to your hackpack API',
    docs: 'https://hackpack.dev/docs',
    routes: {
      get: '/ (this)',
      post: '/example (demo)',
    },
  });
});

app.post('/example', async (c) => {
  const data = await c.req.json().catch(() => ({}));
  return c.json({ received: data, timestamp: new Date().toISOString() });
});

// hackpack:routes

export default app;
```

**`templates/bases/py-fastapi/src/app/main.py`** — polish the root route
(keep `# hackpack:imports` / `# hackpack:routers` anchors exactly as-is):
```python
from fastapi import FastAPI

# hackpack:imports

app = FastAPI()


@app.get("/")
async def root():
    return {
        "message": "Welcome to your hackpack project",
        "docs": "https://hackpack.dev/docs",
    }


# hackpack:routers
```

### C3. Extend `ci-github-actions` to cover `py-fastapi`

**File:** `templates/features/ci-github-actions/template.config.json`

Change:
```json
  "compatibleWith": ["ts-nextjs", "ts-vite-react", "ts-sveltekit", "ts-hono-api"],
```
to:
```json
  "compatibleWith": ["ts-nextjs", "ts-vite-react", "ts-sveltekit", "ts-hono-api", "py-fastapi"],
```

Read `templates/features/ci-github-actions/files/.github/workflows/ci.yml` and
`deploy.yml` first — they're currently JS-only (npm build/test/wrangler
dry-run). Since features apply the *same* `files/` to every compatible base
today (no per-base overlay exists yet for this feature), and Python's CI steps
(`uv sync`, `pytest`, wrangler dry-run via `pywrangler`) genuinely differ from
the JS steps, add a per-base overlay the same way other features already do it
(see `copyLayeredFiles()` in `cli/src/compose.ts`: `files/` first, then an
optional `files-{base}/` overlay). Concretely:

1. Move Python-specific steps out of the shared `files/.github/workflows/*.yml`
   if they'd otherwise be wrong for JS bases — in this case, simplest: leave
   `files/` exactly as-is (JS-only, used by the 4 existing JS bases), and add
   a new directory `templates/features/ci-github-actions/files-py-fastapi/`
   containing its own `.github/workflows/ci.yml` and `deploy.yml` with
   `uv sync` / `pytest` (if `testing-pytest` is present — otherwise skip the
   test step) / wrangler dry-run steps, mirroring the structure of the
   existing JS workflow files but with Python tooling substituted in.
2. Because `copyLayeredFiles()` copies `files/` then overlays `files-{base}/`
   (overlay wins on same-path collisions), and `files/` only contains
   `.github/workflows/ci.yml` + `deploy.yml`, the `files-py-fastapi/` overlay
   fully replacing those two files at the same paths is exactly the existing
   overlay mechanism working as designed — no code changes needed in
   `compose.ts`/`fsutil.ts` for this part, only new template files.

Read the two existing workflow YAML files before writing the Python variants
so step names/style match the existing JS ones (typecheck/build/test/wrangler
dry-run pattern in `ci.yml`, deploy-on-merge pattern in `deploy.yml`).

### Verify Part C
```bash
cd cli
node --no-warnings bin/hackpack.ts new /tmp/hp-nextjs --base ts-nextjs --yes --install=false
cat /tmp/hp-nextjs/tailwind.config.ts   # expect the new colors block
cat /tmp/hp-nextjs/app/page.tsx         # expect the redesigned page

node --no-warnings bin/hackpack.ts new /tmp/hp-py --base py-fastapi --features ci-github-actions --yes --install=false
ls /tmp/hp-py/.github/workflows/         # expect ci.yml + deploy.yml with Python steps, not npm steps

# Smoke test end to end (requires network for install):
cd /tmp/hp-nextjs && npm install && npm run dev &   # verify redesigned page renders, then stop the dev server
cd /tmp/hp-py && uv sync && echo ok                 # verify Python base still installs cleanly
```

---

## Final checklist (run after A + B + C are all done)

- [ ] `cd cli && npm run selfcheck` passes
- [ ] `cd go-cli && go build ./...` succeeds, `./hackpack --help` shows the plain banner
- [ ] `hackpack new` interactive run shows: Packy banner → clack intro → all prompts in order (name, base, features, pages, package manager, git, license, author, description)
- [ ] `hackpack new --yes --pm pnpm --license apache-2.0 --author "..." --description "..."` produces a project with correct LICENSE/README/.editorconfig/.env.example/hackpack.json
- [ ] Generated `ts-nextjs` project boots with `npm run dev` and shows the redesigned page
- [ ] Generated `py-fastapi` project's root route returns the polished JSON payload
- [ ] `py-fastapi` + `ci-github-actions` together produce a Python-appropriate workflow, not the old npm-only one
- [ ] Update `docs/CONTRIBUTING.md` and `docs/ARCHITECTURE.md`: document the `templates/_common/` layer, the new Handlebars vars (`author`, `description`, `year`, `pm`), and the new `hackpack new` flags (`--pm`, `--git`/`--no-git`, `--license`, `--author`, `--description`)
- [ ] Update root `README.md` quickstart section to mention the new flags
