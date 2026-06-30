"use client";

import { useState } from "react";
import { siteUrls } from "@/lib/sites";

const navItems = [
  { href: siteUrls.home, label: "Home", id: "home" },
  { href: siteUrls.plugins, label: "Plugins", id: "plugins" },
  { href: siteUrls.docs, label: "Docs", id: "docs" },
];

export function SiteLayout({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-dark-600 bg-dark-800/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-8">
            <a
              href={siteUrls.home}
              className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
                M
              </span>
              <span className="whitespace-nowrap">
                Magnox<span className="text-accent">Resources</span>
              </span>
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active === item.id
                      ? "bg-dark-600 text-white"
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={siteUrls.panel}
              className="hidden rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:bg-accent-hover sm:block"
            >
              Open Panel
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition hover:bg-dark-700 sm:hidden"
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
                  key={item.id}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active === item.id
                      ? "bg-dark-600 text-white"
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={siteUrls.panel}
                className="mt-2 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                Open Panel
              </a>
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-dark-700 py-8 text-center text-xs text-gray-600">
        MagnoxResources &middot; Minecraft server management tools
      </footer>
    </div>
  );
}
