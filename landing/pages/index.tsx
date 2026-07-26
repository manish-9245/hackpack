import Link from 'next/link';
import { Github, Zap, Code2, Layers, Rocket, BookOpen, Terminal, ArrowRight, Clock, Sparkles, Shield } from 'lucide-react';

type ColorVariant = 'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'indigo';

const colorConfig: Record<ColorVariant, { stat: string; benefit: string }> = {
  blue: { stat: 'text-blue-400', benefit: 'border-blue-400/50 text-blue-400' },
  purple: { stat: 'text-purple-400', benefit: 'border-purple-400/50 text-purple-400' },
  pink: { stat: 'text-pink-400', benefit: 'border-pink-400/50 text-pink-400' },
  orange: { stat: 'text-orange-400', benefit: 'border-orange-400/50 text-orange-400' },
  green: { stat: 'text-green-400', benefit: 'border-green-400/50 text-green-400' },
  indigo: { stat: 'text-indigo-400', benefit: 'border-indigo-400/50 text-indigo-400' },
};

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
            <p>⚡ Deploy live in seconds • No boilerplate • No LLM randomness</p>
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


      {/* Social Proof */}
      <section className="py-16 px-4 bg-blue-600/5 border-y border-blue-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-400 mb-8">Built for hackathons • Open source • MIT license</p>
          <div className="flex flex-wrap justify-center gap-6 items-center text-slate-300">
            <a href="https://github.com/manish-9245/hackpack" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Github size={18} />
              <span className="font-semibold">Star on GitHub</span>
            </a>
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-blue-400" />
              <span className="font-semibold">Deterministic builds</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket size={18} className="text-green-400" />
              <span className="font-semibold">Global CDN deployment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-4">Ship faster in 90 seconds</h2>
          <p className="text-xl text-slate-300 mb-12">
            Stop building boilerplate. Start shipping features.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <a href="https://github.com/manish-9245/hackpack#quick-start" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg">
              <Terminal size={20} /> Deploy Now
              <ArrowRight size={18} />
            </a>
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-4 border-2 border-slate-500 hover:border-blue-400 hover:text-blue-400 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Github size={20} /> View on GitHub
            </a>
          </div>
          <p className="text-sm text-slate-400">
            Open source • MIT licensed • <a href="https://github.com/manish-9245/hackpack" className="text-blue-400 hover:underline">Built for hackers</a>
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

function StatCard({ icon, stat, label, color }: { icon: React.ReactNode; stat: string; label: string; color: ColorVariant }) {
  return (
    <div className="glass p-6 rounded-lg hover:border-blue-400/50 transition-all text-center">
      <div className={`${colorConfig[color].stat} mb-3 flex justify-center`}>
        {icon}
      </div>
      <div className={`text-3xl font-black ${colorConfig[color].stat} mb-2`}>
        {stat}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

function BenefitCard({ number, title, description, icon, color }: { number: string; title: string; description: string; icon: React.ReactNode; color: ColorVariant }) {
  const [borderColor, textColor] = colorConfig[color].benefit.split(' ');

  return (
    <div className={`glass p-6 rounded-lg border border-slate-400/20 hover:${borderColor} transition-all group`}>
      <div className="flex items-start gap-4">
        <div className={`${textColor} flex-shrink-0 rounded-lg p-2 bg-slate-900/50`}>
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
