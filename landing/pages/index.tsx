import Link from 'next/link';
import { Github, Zap, Code2, Layers, Rocket, BookOpen, Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">hackpack</div>
          <div className="flex gap-6 items-center">
            <Link href="#features" className="hover:text-blue-400">Features</Link>
            <Link href="#examples" className="hover:text-blue-400">Examples</Link>
            <Link href="https://github.com/manish-9245/hackpack" target="_blank" className="hover:text-blue-400 flex items-center gap-2">
              <Github size={20} /> GitHub
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 gradient-text">
            Scaffold hackathon projects in seconds
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Pick a framework. Select features. Generate wired pages. Ship to Cloudflare Workers.
            No boilerplate. No configuration headaches.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://github.com/manish-9245/hackpack#quick-start" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
              <Rocket size={20} /> Get Started
            </a>
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-3 border border-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold flex items-center gap-2">
              <Github size={20} /> View on GitHub
            </a>
          </div>
          <div className="mt-12 text-sm text-slate-400">
            <p>✨ 7 bases • 16 features • prebuilt pages • Cloudflare Workers</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-12 px-4 bg-blue-600/5 border-y border-blue-400/20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400">7</div>
            <p className="text-slate-400">Frameworks</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">16</div>
            <p className="text-slate-400">Features</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-400">4</div>
            <p className="text-slate-400">Pages</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-400">∞</div>
            <p className="text-slate-400">Custom Pages</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Why hackpack?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap size={32} />}
              title="⚡ No Boilerplate"
              description="Pick framework + features, get wired pages instantly. No copy-paste, no setup time."
            />
            <FeatureCard
              icon={<Code2 size={32} />}
              title="🔒 Type-Safe"
              description="Zod schemas, Drizzle ORM, better-auth types. TypeScript everywhere. Catch bugs early."
            />
            <FeatureCard
              icon={<Layers size={32} />}
              title="🧩 Composable"
              description="Bases and features are orthogonal. Mix and match. Swap UI kits freely without side effects."
            />
            <FeatureCard
              icon={<Rocket size={32} />}
              title="🎯 Deterministic"
              description="No LLM randomness. Same input → same output. Perfect for hackathons where consistency matters."
            />
            <FeatureCard
              icon={<Code2 size={32} />}
              title="🐍 Multi-Language"
              description="TypeScript AND Python. Same CLI, same page generation, same deployment to Workers."
            />
            <FeatureCard
              icon={<BookOpen size={32} />}
              title="📦 Portable"
              description="Export to any git repo. Customize freely. Build your own registry. No vendor lock-in."
            />
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-4 bg-blue-600/5 border-y border-blue-400/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Quick Start</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">1</span>
                Create Project
              </h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-slate-300">
                  $ npx hackpack@latest new my-hack --base=ts-nextjs \
                  <br />
                  &nbsp;&nbsp;--features=ui-shadcn,auth-better-auth,db-d1-drizzle \
                  <br />
                  &nbsp;&nbsp;--pages=landing,login,signup,dashboard
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">2</span>
                Install & Run
              </h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-slate-300">
                  $ cd my-hack && npm install && npm run dev
                  <br />
                  <span className="text-green-400">→ Live at http://localhost:3000</span>
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">3</span>
                Generate Custom Page
              </h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-slate-300">
                  $ hackpack page add products \<br />
                  &nbsp;&nbsp;--fields=name:string,price:number,stock:number \<br />
                  &nbsp;&nbsp;--auth=protected
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">4</span>
                Deploy to Workers
              </h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-slate-300">
                  $ hackpack deploy
                  <br />
                  <span className="text-green-400">→ Live at https://my-hack.yourname.workers.dev</span>
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bases & Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Complete Stack</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-400">7 Frameworks</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> ts-nextjs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> ts-vite-react
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> ts-sveltekit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> ts-hono-api (REST API)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> py-fastapi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> shadcn-svelte
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> shadcn-vue
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-purple-400">16 Features</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-slate-300 mb-2">UI Kits</p>
                  <p className="text-sm text-slate-400">shadcn/ui • Aceternity • shadcn-svelte • shadcn-vue</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-2">AI & LLMs</p>
                  <p className="text-sm text-slate-400">Mastra • LangChain (JS/Python) • Pydantic AI • Vercel SDK</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-2">Auth & DB</p>
                  <p className="text-sm text-slate-400">Better Auth • JWT • D1+Drizzle • D1+SQLModel</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-2">Testing & CI</p>
                  <p className="text-sm text-slate-400">Vitest • pytest • GitHub Actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="py-20 px-4 bg-blue-600/5 border-y border-blue-400/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Example Projects</h2>

          <div className="space-y-6">
            <ExampleCard
              title="Full-Stack SaaS Starter"
              description="Complete SaaS with login, database, AI features, testing, and CI/CD"
              command={`npx hackpack new saas-app \\
  --base=ts-nextjs \\
  --features=ui-shadcn,auth-better-auth,db-d1-drizzle,ai-mastra \\
  --pages=landing,login,signup,dashboard`}
            />

            <ExampleCard
              title="Python FastAPI Backend"
              description="Backend API with SQLModel, JWT auth, and pytest"
              command={`npx hackpack new api-service \\
  --base=py-fastapi \\
  --features=db-d1-sqlmodel,auth-py-jwt,testing-pytest`}
            />

            <ExampleCard
              title="Minimal Hono API"
              description="Lightweight REST API with D1 database"
              command={`npx hackpack new api \\
  --base=ts-hono-api \\
  --features=db-d1-drizzle`}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to ship? 🚀</h2>
          <p className="text-xl text-slate-300 mb-8">
            Create a full-stack project in under 5 minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
              <Github size={20} /> View on GitHub
            </a>
            <a href="https://github.com/manish-9245/hackpack/blob/main/README.md" className="px-8 py-3 border border-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold flex items-center gap-2">
              <BookOpen size={20} /> Read Docs
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-400/20 py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          <p>Made for hackathons. Open source, MIT license.</p>
          <p className="mt-2">
            <a href="https://github.com/manish-9245/hackpack" className="hover:text-blue-400">GitHub</a> •
            <a href="https://github.com/manish-9245/hackpack/blob/main/README.md" className="hover:text-blue-400"> Docs</a> •
            <a href="https://github.com/manish-9245/hackpack/blob/main/docs/CONTRIBUTING.md" className="hover:text-blue-400"> Contributing</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass p-6 rounded-lg hover:border-blue-400/50 transition-all">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function ExampleCard({ title, description, command }: { title: string; description: string; command: string }) {
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      <div className="bg-slate-900 p-4 rounded text-sm overflow-x-auto">
        <code className="text-slate-300">{command}</code>
      </div>
    </div>
  );
}
