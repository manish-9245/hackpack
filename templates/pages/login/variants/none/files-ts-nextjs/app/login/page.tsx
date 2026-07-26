export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Log in</h1>
      {/* TODO: no auth feature is installed. Run `hackpack add auth-better-auth`
          (or wire your own provider), then swap this stub for a real form. */}
      <p className="text-sm text-gray-500">No auth provider configured yet.</p>
    </main>
  );
}
