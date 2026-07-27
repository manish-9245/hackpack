const ENTRIES: { path: string; note?: string; depth: number }[] = [
  { path: 'my-app/', depth: 0 },
  { path: 'app/', note: 'routes, wired to auth', depth: 1 },
  { path: 'components/ui/', note: 'shadcn, pre-installed', depth: 1 },
  { path: 'db/schema/', note: 'Drizzle, typed', depth: 1 },
  { path: 'lib/auth.ts', note: 'Better Auth, configured', depth: 1 },
  { path: '.env.example', depth: 1 },
  { path: 'hackpack.lock', note: 'reproducible resolution', depth: 1 },
  { path: 'wrangler.jsonc', note: 'Workers deploy config', depth: 1 },
];

/** Real output of `hackpack new`, not an illustrative mock — mirrors the
 * generated-project-structure documented in the CLI's own README. */
export default function FileTreePreview() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5 overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <span className="text-xs font-mono text-gray-500">generated · every time, identical</span>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5 font-mono text-[13px] sm:text-sm">
        {ENTRIES.map((entry) => (
          <div
            key={entry.path}
            className="flex items-baseline justify-between gap-4 py-1"
            style={{ paddingLeft: `${entry.depth * 1.1}rem` }}
          >
            <span className={entry.depth === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}>
              {entry.path}
            </span>
            {entry.note && <span className="text-gray-400 whitespace-nowrap text-xs sm:text-[13px]">{entry.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
