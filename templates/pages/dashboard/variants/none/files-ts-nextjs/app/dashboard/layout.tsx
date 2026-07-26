import { DashboardNav } from "@/components/dashboard-nav";

// TODO: no auth feature is installed, so this route isn't guarded. Run
// `hackpack add auth-better-auth` (or wire your own), then add a redirect here.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
