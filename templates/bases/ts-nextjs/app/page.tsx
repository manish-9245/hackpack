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
