"use client";

import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/docs", label: "Docs" },
  ];

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-dark-600 bg-dark-800/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <a
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
                M
              </span>
              Magnox<span className="text-accent">Resources</span>
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname.startsWith(item.href) &&
                    (item.href !== "/dashboard" || pathname === "/dashboard")
                      ? "bg-dark-600 text-white"
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/docs"
              className="hidden rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent sm:block"
            >
              Need help?
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-300 transition hover:border-danger hover:text-danger"
            >
              Disconnect
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      <footer className="border-t border-dark-700 py-6 text-center text-xs text-gray-600">
        MagnoxResources Panel &middot; Plugins sync every 30 seconds
      </footer>
    </div>
  );
}
