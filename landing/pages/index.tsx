import Link from 'next/link';
import {
  Github,
  Terminal,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  Code2,
  Rocket,
  BookOpen,
  Blocks,
} from 'lucide-react';
import ShaderMesh from '../components/ShaderMesh';
import TerminalDemo from '../components/TerminalDemo';
import FileTreePreview from '../components/FileTreePreview';
import RevealOnScroll from '../components/RevealOnScroll';

const STEPS = [
  {
    title: 'Pick',
    description: 'A base — Next.js, SvelteKit, Hono, FastAPI — plus the features you need: UI, auth, DB, AI, testing.',
  },
  {
    title: 'Compose',
    description: 'hackpack wires them together deterministically. Same input, same output, every time — no LLM guessing.',
  },
  {
    title: 'Ship',
    description: 'Dependencies installed, git initialized, ready to deploy to Cloudflare Workers in one more command.',
  },
];

const BENEFITS = [
  {
    title: 'No setup tax',
    description: 'Auth wired. DB schema created. API routes stubbed. You write business logic, not boilerplate.',
    icon: Zap,
  },
  {
    title: 'Type-safe by default',
    description: 'Zod schemas, Drizzle ORM, TypeScript everywhere. Bugs caught at compile time, not in prod.',
    icon: Shield,
  },
  {
    title: 'Pick once, ship fast',
    description: "Bases and features don't conflict. Mix Next.js, auth, and a database in one command.",
    icon: Blocks,
  },
  {
    title: 'Reproducible builds',
    description: 'No LLM guessing. Same input = same output — reliable for teams and for reruns at 2am.',
    icon: Code2,
  },
  {
    title: 'Deploy in one command',
    description: 'Every project ships to Cloudflare Workers. Free tier: 100k req/day, global CDN, no cold starts.',
    icon: Rocket,
  },
  {
    title: 'Not vendor-locked',
    description: 'Export to git. Run locally or in Docker. Customize freely — your code, your repo, your rules.',
    icon: BookOpen,
  },
];

const STATS = [
  ['90s', 'to a deployed app'],
  ['7', 'frameworks'],
  ['16', 'composable features'],
  ['MIT', 'licensed'],
] as const;

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <ShaderMesh />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/75 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight text-gray-900">hackpack</div>
          <div className="flex gap-5 sm:gap-6 items-center">
            <Link href="#why" className="hidden sm:block hover:text-blue-600 text-sm text-gray-700 transition-colors">
              Why
            </Link>
            <Link href="#how" className="hidden sm:block hover:text-blue-600 text-sm text-gray-700 transition-colors">
              How it works
            </Link>
            <a
              href="https://github.com/manish-9245/hackpack"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 flex items-center gap-2 text-sm text-gray-700 transition-colors"
              aria-label="View hackpack on GitHub"
            >
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 sm:pt-40 pb-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block mb-6 px-4 py-1.5 bg-blue-100/80 border border-blue-200 rounded-full">
              <p className="text-xs sm:text-sm text-blue-700 font-semibold tracking-tight">
                For hackers who ship, not debate
              </p>
            </div>

            <h1 className="text-[clamp(2.6rem,5vw+1.2rem,4.5rem)] font-black leading-[1.05] tracking-[-0.03em] text-gray-900 mb-6 text-balance">
              Full-stack in 90 seconds.
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Pick a framework. Select features. Deploy. No boilerplate, no LLM guessing, no configuration paralysis.
            </p>
            <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Whether you&apos;re at a hackathon, launching an MVP, or learning full-stack — hackpack gets you wired
              pages, auth, and a database instantly.
            </p>

            <div className="flex gap-4 justify-center lg:justify-start flex-wrap mb-8">
              <a
                href="https://github.com/manish-9245/hackpack#quick-start"
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-[1.03] shadow-md hover:shadow-lg"
              >
                <Terminal size={18} /> Get started
                <ArrowRight size={16} />
              </a>
              <a
                href="https://github.com/manish-9245/hackpack"
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Github size={18} /> Star on GitHub
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-gray-600">
              {STATS.map(([value, label]) => (
                <span key={label} className="whitespace-nowrap">
                  <span className="font-bold text-gray-900">{value}</span> {label}
                </span>
              ))}
            </div>
          </div>

          <RevealOnScroll className="flex justify-center lg:justify-end" delayMs={150}>
            <TerminalDemo />
          </RevealOnScroll>
        </div>
      </header>

      {/* How it works */}
      <section id="how" className="py-20 sm:py-24 px-4 sm:px-6 bg-white/70 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-14 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">How it works</h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">Three steps. No debates in between.</p>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-6 relative">
            <div
              aria-hidden="true"
              className="hidden sm:block absolute top-5 left-[16.5%] right-[16.5%] h-px bg-gray-200"
            />
            {STEPS.map((step, i) => (
              <RevealOnScroll key={step.title} delayMs={i * 100}>
                <div className="relative text-center sm:text-left">
                  <div className="relative z-10 inline-flex sm:flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 items-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              A real project, not a stub.
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed max-w-lg">
              Every generation writes the same structure for the same input — wired auth, typed database schema, a
              deploy config, and a lockfile that records exactly what was resolved.
            </p>
            <p className="text-base text-gray-600 max-w-lg">
              Nothing to delete, nothing to guess. Open the repo and every file is exactly where you&apos;d expect it.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delayMs={120} className="flex justify-center lg:justify-end">
            <FileTreePreview />
          </RevealOnScroll>
        </div>
      </section>

      {/* Why hackpack */}
      <section id="why" className="py-20 sm:py-24 px-4 sm:px-6 bg-white/70 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-14 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">Built for shipping</h2>
              <p className="text-lg text-gray-600">Not for setup paralysis. Not for tech debates.</p>
            </div>
          </RevealOnScroll>

          <div className="divide-y divide-gray-200">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <RevealOnScroll key={benefit.title} delayMs={Math.min(i * 60, 240)}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-6">
                    <div className="flex items-center gap-3 sm:w-48 shrink-0">
                      <Icon size={20} className="text-blue-600 shrink-0" />
                      <h3 className="text-base font-bold text-gray-900">{benefit.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 text-center">
        <RevealOnScroll className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black mb-4 text-gray-900 tracking-tight">
            Ship faster in 90 seconds
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-10">Stop building boilerplate. Start shipping features.</p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a
              href="https://github.com/manish-9245/hackpack#quick-start"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-[1.03] shadow-md hover:shadow-lg"
            >
              <Terminal size={20} /> Get started
              <ArrowRight size={18} />
            </a>
            <a
              href="https://github.com/manish-9245/hackpack"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Github size={20} /> View on GitHub
            </a>
          </div>
          <p className="text-sm text-gray-600">Open source · MIT licensed · built for hackers</p>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 bg-white/70">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>Made for hackathons. Open source, MIT license.</p>
          <p className="mt-2 flex justify-center gap-1 flex-wrap">
            <a href="https://github.com/manish-9245/hackpack" className="hover:text-blue-600">
              GitHub
            </a>
            <span>·</span>
            <a href="https://github.com/manish-9245/hackpack/blob/main/README.md" className="hover:text-blue-600">
              Docs
            </a>
            <span>·</span>
            <a
              href="https://github.com/manish-9245/hackpack/blob/main/docs/CONTRIBUTING.md"
              className="hover:text-blue-600"
            >
              Contributing
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
