"use client";

import Link from "next/link";

export function DashboardNav() {
  return (
    <nav className="flex w-48 flex-col gap-2 border-r p-4">
      <Link href="/dashboard">Overview</Link>
      {/* hackpack:nav-links */}
    </nav>
  );
}
