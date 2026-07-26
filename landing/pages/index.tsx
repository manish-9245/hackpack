import Link from 'next/link';
import { Github, Zap, Code2, Layers, Rocket, BookOpen, Terminal, ArrowRight, Clock, Sparkles, Shield } from 'lucide-react';
import { useEffect, useRef } from 'react';

type ColorVariant = 'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'indigo';

const colorConfig: Record<ColorVariant, { stat: string; benefit: string }> = {
  blue: { stat: 'text-blue-600', benefit: 'border-blue-300 text-blue-700' },
  purple: { stat: 'text-purple-600', benefit: 'border-purple-300 text-purple-700' },
  pink: { stat: 'text-pink-600', benefit: 'border-pink-300 text-pink-700' },
  orange: { stat: 'text-orange-600', benefit: 'border-orange-300 text-orange-700' },
  green: { stat: 'text-green-600', benefit: 'border-green-300 text-green-700' },
  indigo: { stat: 'text-indigo-600', benefit: 'border-indigo-300 text-indigo-700' },
};

// Animated shader background component
function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Vertex shader
    const vertexShader = `#version 300 es
      precision highp float;
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader - animated gradient mesh
    const fragmentShader = `#version 300 es
      precision highp float;
      uniform float time;
      uniform vec2 resolution;

      out vec4 fragColor;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        // Animated gradient layers
        float wave1 = sin(uv.x * 3.0 + time * 0.5) * 0.5 + 0.5;
        float wave2 = cos(uv.y * 2.5 + time * 0.3) * 0.5 + 0.5;
        float wave3 = sin((uv.x + uv.y) * 2.0 + time * 0.4) * 0.5 + 0.5;

        // Color channels - light theme
        float r = mix(0.95, 0.85, wave1);
        float g = mix(0.97, 0.90, wave2);
        float b = mix(0.99, 0.95, wave3);

        // Subtle noise
        float noise = fract(sin(uv.x * 12.9898 + uv.y * 78.233) * 43758.5453) * 0.02;

        fragColor = vec4(r + noise, g + noise, b + noise, 1.0);
      }
    `;

    // Create program
    const program = gl.createProgram()!;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(vs, vertexShader);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(vs);
    gl.compileShader(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader linking failed');
      return;
    }

    gl.useProgram(program);

    // Create quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-blue-50 relative">
      <ShaderBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">hackpack</div>
          <div className="flex gap-6 items-center">
            <Link href="#why" className="hover:text-blue-600 text-sm text-gray-700">Why</Link>
            <Link href="#examples" className="hover:text-blue-600 text-sm text-gray-700">Examples</Link>
            <a href="https://github.com/manish-9245/hackpack" target="_blank" className="hover:text-blue-600 flex items-center gap-2 text-sm text-gray-700">
              <Github size={18} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
            <p className="text-sm text-blue-700 font-semibold">For hackers who ship, not debate</p>
          </div>

          <h1 className="text-7xl font-black mb-6 leading-tight text-gray-900">
            Full-stack in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">90 seconds</span>
          </h1>

          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            Pick a framework. Select features. Deploy. No boilerplate. No LLM guessing. No configuration paralysis.
          </p>
          <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're at a hackathon, launching an MVP, or learning full-stack—hackpack gets you wired pages, auth, and databases instantly.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a href="https://github.com/manish-9245/hackpack#quick-start" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md hover:shadow-lg">
              <Terminal size={20} /> Try Now (npx)
              <ArrowRight size={18} />
            </a>
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 rounded-lg font-semibold flex items-center gap-2 transition-all">
              <Github size={20} /> Star on GitHub
            </a>
          </div>

          <div className="text-sm text-gray-600">
            <p>⚡ Deploy live in seconds • No boilerplate • No LLM randomness</p>
          </div>
        </div>
      </header>

      {/* Value Stats */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
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
            <h2 className="text-5xl font-black mb-4 text-gray-900">Built for shipping</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Not for setup paralysis. Not for tech debates. Ship.</p>
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
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 mb-8">Built for hackathons • Open source • MIT license</p>
          <div className="flex flex-wrap justify-center gap-6 items-center text-gray-700">
            <a href="https://github.com/manish-9245/hackpack" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Github size={18} />
              <span className="font-semibold">Star on GitHub</span>
            </a>
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-blue-600" />
              <span className="font-semibold">Deterministic builds</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket size={18} className="text-green-600" />
              <span className="font-semibold">Global CDN deployment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-4 text-gray-900">Ship faster in 90 seconds</h2>
          <p className="text-xl text-gray-700 mb-12">
            Stop building boilerplate. Start shipping features.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <a href="https://github.com/manish-9245/hackpack#quick-start" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md hover:shadow-lg">
              <Terminal size={20} /> Deploy Now
              <ArrowRight size={18} />
            </a>
            <a href="https://github.com/manish-9245/hackpack" className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Github size={20} /> View on GitHub
            </a>
          </div>
          <p className="text-sm text-gray-600">
            Open source • MIT licensed • <a href="https://github.com/manish-9245/hackpack" className="text-blue-600 hover:underline">Built for hackers</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 mt-20 bg-white">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>Made for hackathons. Open source, MIT license.</p>
          <p className="mt-2">
            <a href="https://github.com/manish-9245/hackpack" className="hover:text-blue-600">GitHub</a> •
            <a href="https://github.com/manish-9245/hackpack/blob/main/README.md" className="hover:text-blue-600"> Docs</a> •
            <a href="https://github.com/manish-9245/hackpack/blob/main/docs/CONTRIBUTING.md" className="hover:text-blue-600"> Contributing</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, stat, label, color }: { icon: React.ReactNode; stat: string; label: string; color: ColorVariant }) {
  return (
    <div className="p-6 rounded-xl hover:shadow-lg transition-all text-center bg-white border border-gray-100 hover:border-gray-200">
      <div className={`${colorConfig[color].stat} mb-3 flex justify-center`}>
        {icon}
      </div>
      <div className={`text-3xl font-black ${colorConfig[color].stat} mb-2`}>
        {stat}
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}

function BenefitCard({ number, title, description, icon, color }: { number: string; title: string; description: string; icon: React.ReactNode; color: ColorVariant }) {
  const [borderColor, textColor] = colorConfig[color].benefit.split(' ');

  return (
    <div className={`p-6 rounded-xl border-2 ${borderColor} bg-white hover:shadow-md transition-all group`}>
      <div className="flex items-start gap-4">
        <div className={`${textColor} flex-shrink-0 rounded-lg p-2 bg-gray-50`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-full text-gray-700">
              {number}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2 group-hover:text-gray-900 text-gray-900 transition-colors">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
