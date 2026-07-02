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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-8">
            <a
              href={siteUrls.home}
              className="flex min-w-0 items-center gap-2 text-base font-bold text-white sm:text-xl"
            >
              <img
                src="/icon-magnoxresources.svg"
                alt="MagnoxResources"
                className="h-8 w-8 shrink-0 rounded-lg shadow-[0_0_16px_-2px_var(--color-accent)]"
              />
              <span className="truncate">
                Magnox<span className="text-gradient font-black">Resources</span>
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
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/dashboard"
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 transition hover:bg-dark-700 hover:text-white sm:block"
            >
              Dashboard
            </a>
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
                href="/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-dark-700 hover:text-white"
              >
                Dashboard
              </a>
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1 animate-fade-in-up">{children}</main>

      <footer className="relative overflow-hidden border-t border-dark-700 bg-dark-800/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <a
                href={siteUrls.home}
                className="flex items-center gap-2 text-base font-bold text-white"
              >
                <img src="/icon-magnoxresources.svg" alt="MagnoxResources" className="h-7 w-7 shrink-0 rounded-lg" />
                Magnox<span className="text-accent">Resources</span>
              </a>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                Powerful tools for Minecraft server management. Configure
                plugins, track punishments, and customise your lobby.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Products
              </h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href={siteUrls.panel} className="text-sm text-gray-400 transition hover:text-white">
                    Panel
                  </a>
                </li>
                <li>
                  <a href={siteUrls.plugins} className="text-sm text-gray-400 transition hover:text-white">
                    Plugins
                  </a>
                </li>
                <li>
                  <a href={siteUrls.docs} className="text-sm text-gray-400 transition hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Resources
              </h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href={siteUrls.docs} className="text-sm text-gray-400 transition hover:text-white">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href={siteUrls.docs} className="text-sm text-gray-400 transition hover:text-white">
                    Commands &amp; Permissions
                  </a>
                </li>
                <li>
                  <a href={siteUrls.docs} className="text-sm text-gray-400 transition hover:text-white">
                    PlaceholderAPI
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-dark-700 pt-6 flex flex-col items-center gap-1 text-center text-xs text-gray-600 sm:flex-row sm:justify-between">
            <span>&copy; 2026 MagnoxResources. All rights reserved.</span>
            <span>Minecraft server management tools</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
