"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { siteUrls } from "@/lib/sites";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const navItems = [
    { href: siteUrls.home, label: "Home", active: false },
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard" },
    { href: siteUrls.plugins, label: "Plugins", active: false },
    { href: siteUrls.docs, label: "Docs", active: false },
  ];

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-dark-600 bg-dark-800/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-8">
            <a
              href={siteUrls.home}
              className="flex min-w-0 items-center gap-2 text-base font-bold text-white sm:text-xl"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
                M
              </span>
              <span className="truncate">
                Magnox<span className="text-accent">Resources</span>
              </span>
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    item.active
                      ? "bg-dark-600 text-white"
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={siteUrls.docs}
              className="hidden rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent sm:block"
            >
              Need help?
            </a>
            <button
              onClick={handleLogout}
              className="hidden rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-300 transition hover:border-danger hover:text-danger sm:block"
            >
              Disconnect
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 transition hover:bg-dark-700 sm:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-dark-600 bg-dark-800 px-4 py-3 sm:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    item.active
                      ? "bg-dark-600 text-white"
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-dark-600 pt-3">
                <a
                  href={siteUrls.docs}
                  className="rounded-lg border border-dark-500 px-3 py-2.5 text-center text-sm text-gray-300 transition hover:border-accent hover:text-accent"
                >
                  Need help?
                </a>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-dark-500 px-3 py-2.5 text-sm text-gray-300 transition hover:border-danger hover:text-danger"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <footer className="border-t border-dark-700 bg-dark-800/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <a
                href={siteUrls.home}
                className="flex items-center gap-2 text-sm font-bold text-white"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-xs font-black text-white">
                  M
                </span>
                Magnox<span className="text-accent">Resources</span>
              </a>
              <span className="text-dark-600">|</span>
              <span className="text-xs text-gray-600">Configs sync every 30 seconds</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={siteUrls.plugins} className="text-xs text-gray-500 transition hover:text-gray-300">
                Plugins
              </a>
              <a href={siteUrls.docs} className="text-xs text-gray-500 transition hover:text-gray-300">
                Documentation
              </a>
              <a href={siteUrls.home} className="text-xs text-gray-500 transition hover:text-gray-300">
                magnoxresources.com
              </a>
            </div>
          </div>
          <div className="mt-4 border-t border-dark-700 pt-4 text-center text-xs text-gray-700">
            &copy; 2026 MagnoxResources
          </div>
        </div>
      </footer>
    </div>
  );
}
