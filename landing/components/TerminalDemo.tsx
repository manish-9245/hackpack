import { useEffect, useRef, useState } from 'react';

type Line =
  | { kind: 'command'; text: string }
  | { kind: 'prompt'; label: string; value: string }
  | { kind: 'success'; text: string }
  | { kind: 'output'; text: string };

const SCRIPT: Line[] = [
  { kind: 'command', text: 'npx create-hackpack new my-app' },
  { kind: 'prompt', label: 'Base template', value: 'Next.js App Router' },
  { kind: 'prompt', label: 'Features', value: 'ui-shadcn, auth-better-auth, db-d1-drizzle' },
  { kind: 'prompt', label: 'Pages', value: 'landing, login, dashboard' },
  { kind: 'success', text: 'Composed 18 files · wired auth + D1 schema' },
  { kind: 'success', text: 'git init · npm install' },
  { kind: 'output', text: 'Done. cd my-app && npm run dev' },
];

const TYPE_MS = 32;
const LINE_PAUSE_MS = 420;
const HOLD_MS = 2600;
const RESTART_PAUSE_MS = 900;

/** Replays the real `create-hackpack` CLI flow: typed command, then the
 * wizard's prompts and result resolving in sequence, holding on the finished
 * state before looping. One typed line only — the rest step in, so the
 * motion reads as a terminal working, not text animating for its own sake. */
export default function TerminalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) {
      setTyped(SCRIPT[0].kind === 'command' ? SCRIPT[0].text : '');
      setLineIndex(SCRIPT.length);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || reducedMotion.current) return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((resolve) => timeouts.push(setTimeout(resolve, ms)));

    async function play() {
      while (!cancelled) {
        setTyped('');
        setLineIndex(0);
        const command = SCRIPT[0].kind === 'command' ? SCRIPT[0].text : '';
        for (let i = 1; i <= command.length; i++) {
          if (cancelled) return;
          setTyped(command.slice(0, i));
          await wait(TYPE_MS);
        }
        setLineIndex(1);
        for (let i = 2; i <= SCRIPT.length; i++) {
          if (cancelled) return;
          await wait(LINE_PAUSE_MS);
          setLineIndex(i);
        }
        await wait(HOLD_MS);
        if (cancelled) return;
        await wait(RESTART_PAUSE_MS);
      }
    }

    play();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [running]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-lg rounded-xl border border-gray-200 bg-gray-950 shadow-xl shadow-gray-900/10 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 text-xs text-white/40 font-mono">my-app — hackpack</span>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5 font-mono text-[13px] sm:text-sm leading-relaxed min-h-[220px]">
        <div className="flex gap-2 text-white/90">
          <span className="text-emerald-400 shrink-0">$</span>
          <span>
            {typed}
            <span
              className={`inline-block w-[7px] h-[1em] translate-y-[2px] bg-white/70 ml-0.5 ${
                lineIndex === 0 ? 'animate-pulse' : 'opacity-0'
              }`}
            />
          </span>
        </div>
        {SCRIPT.slice(1).map((line, i) => {
          const shown = lineIndex > i + 1;
          return (
            <div
              key={i}
              className={`mt-2 transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
            >
              {line.kind === 'prompt' && (
                <div className="flex flex-wrap gap-x-2 text-white/70">
                  <span className="text-blue-400">◆</span>
                  <span className="text-white/50">{line.label}</span>
                  <span className="text-white">{line.value}</span>
                </div>
              )}
              {line.kind === 'success' && (
                <div className="flex gap-2 text-white/70">
                  <span className="text-emerald-400">✔</span>
                  <span>{line.text}</span>
                </div>
              )}
              {line.kind === 'output' && (
                <div className="mt-1 text-white/95 font-semibold">{line.text}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
