import Link from 'next/link';
import { Github, Zap, Code2, Layers, Rocket, BookOpen, Terminal, ArrowRight, Clock, Sparkles, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">hackpack</div>
          <div className="flex gap-6 items-center">
            <Link href="#why" className="hover:text-blue-400 text-sm">Why</Link>
            <Link href="#examples" className="hover:text-blue-400 text-sm">Examples</Link>
            <a href="https://github.com/manish-9245/hackpack" target="_blank" className="hover:text-blue-400 flex items-center gap-2 text-sm">
              <Github size={18} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-600/20 border border-blue-400/50 rounded-full">
            <p className="text-sm text-blue-300 font-semibold">For hackers who ship, not debate</p>
          </div>

          <h1 className="text-7xl font-black mb-6 leading-tight">
            Full-stack in <span className="gradient-text">90 seconds</span>
          </h1>

          <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Pick a framework. Select features. Deploy. No boilerplate. No LLM guessing. No configuration paralysis.
          </p>
          <p className="text-base text-slate-400 mb-8 max-w-2xl mx-auto">
            Whether you're at a hackathon, launching an MVP, or learning full-stack—hackpack gets you wired pages, auth, and databases instantly.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a href="https://github.com/manish-9245/hackpack#quick-start" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105">
              <Terminal size={20} /> Try Now (npx)
              <ArrowRight size={18} />
            </a>
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-4 border-2 border-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold flex items-center gap-2 transition-all">
              <Github size={20} /> Star on GitHub
            </a>
          </div>

          <div className="text-sm text-slate-400">
            <p>⚡ TypeScript + Python • 7 frameworks • 16 features • Deploy to Workers</p>
          </div>
        </div>
      </header>

      {/* Value Stats */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border-y border-blue-400/20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={<Clock size={28} />} stat="90 sec" label="From zero to deployed" color="blue" />
          <StatCard icon={<Code2 size={28} />} stat="7" label="Frameworks" color="purple" />
          <StatCard icon={<Layers size={28} />} stat="16" label="Composable features" color="pink" />
          <StatCard icon={<Sparkles size={28} />} stat="∞" label="Custom pages" color="orange" />
        </div>
      </section>

      {/* Why hackpack */}
      <section id="why" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Built for shipping</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Not for setup paralysis. Not for tech debates. Ship.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <BenefitCard
              number="1"
              title="No setup tax"
              description="Auth wired. DB schema created. API routes stubbed. You write business logic, not boilerplate."
              icon={<Zap size={32} />}
              color="blue"
            />
            <BenefitCard
              number="2"
              title="Type-safe by default"
              description="Zod schemas, Drizzle ORM, TypeScript everywhere. Bugs caught at compile time, not in prod."
              icon={<Shield size={32} />}
              color="green"
            />
            <BenefitCard
              number="3"
              title="Pick once, ship fast"
              description="Choose framework + features. Bases and features don't conflict. Mix Next.js + FastAPI + auth in one command."
              icon={<Layers size={32} />}
              color="purple"
            />
            <BenefitCard
              number="4"
              title="Reproducible builds"
              description="No LLM guessing. Same input = same output. Perfect for teams where consistency matters."
              icon={<Code2 size={32} />}
              color="pink"
            />
            <BenefitCard
              number="5"
              title="Deploy in one command"
              description="All projects deploy to Cloudflare Workers. Free tier: 100k req/day, global CDN, no cold starts."
              icon={<Rocket size={32} />}
              color="orange"
            />
            <BenefitCard
              number="6"
              title="Not vendor-locked"
              description="Export to git. Run locally or in Docker. Customize freely. Your code, your repo, your rules."
              icon={<BookOpen size={32} />}
              color="indigo"
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

      {/* Social Proof */}
      <section className="py-16 px-4 bg-blue-600/5 border-y border-blue-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-400 mb-8">Trusted by hackers and builders</p>
          <div className="flex flex-wrap justify-center gap-8 items-center text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-400" />
              <span className="font-semibold">7 Frameworks</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-blue-400" />
              <span className="font-semibold">TypeScript + Python</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket size={18} className="text-green-400" />
              <span className="font-semibold">Deploy to Workers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-purple-400" />
              <span className="font-semibold">Type-Safe by Default</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-6">Ready to build?</h2>
          <p className="text-xl text-slate-300 mb-12">
            Full-stack project from zero to deployed in 90 seconds.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <a href="https://github.com/manish-9245/hackpack#quick-start" className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105">
              <Terminal size={20} /> Start Building
              <ArrowRight size={18} />
            </a>
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-4 border-2 border-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold flex items-center gap-2">
              <Github size={20} /> View Source
            </a>
          </div>
          <p className="text-sm text-slate-400">
            Open source • MIT license • <a href="https://github.com/manish-9245/hackpack" className="text-blue-400 hover:underline">Star us on GitHub</a>
          </p>
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

function StatCard({ icon, stat, label, color }: { icon: React.ReactNode; stat: string; label: string; color: string }) {
  const colorMap = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
    indigo: 'text-indigo-400',
  };

  return (
    <div className="glass p-6 rounded-lg hover:border-blue-400/50 transition-all text-center">
      <div className={`${colorMap[color as keyof typeof colorMap]} mb-3 flex justify-center`}>
        {icon}
      </div>
      <div className={`text-3xl font-black ${colorMap[color as keyof typeof colorMap]} mb-2`}>
        {stat}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

function BenefitCard({ number, title, description, icon, color }: { number: string; title: string; description: string; icon: React.ReactNode; color: string }) {
  const colorMap = {
    blue: 'border-blue-400/50 text-blue-400',
    green: 'border-green-400/50 text-green-400',
    purple: 'border-purple-400/50 text-purple-400',
    pink: 'border-pink-400/50 text-pink-400',
    orange: 'border-orange-400/50 text-orange-400',
    indigo: 'border-indigo-400/50 text-indigo-400',
  };

  return (
    <div className={`glass p-6 rounded-lg border border-slate-400/20 hover:${colorMap[color as keyof typeof colorMap].split(' ')[0]} transition-all group`}>
      <div className="flex items-start gap-4">
        <div className={`${colorMap[color as keyof typeof colorMap].split(' ')[1]} flex-shrink-0 rounded-lg p-2 bg-slate-900/50`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded-full text-slate-300">
              {number}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
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
