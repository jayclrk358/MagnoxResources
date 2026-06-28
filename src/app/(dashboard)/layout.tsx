"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="min-h-screen">
      <nav className="border-b border-dark-600 bg-dark-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <a href="/dashboard" className="text-xl font-bold text-white">
              Magnox<span className="text-accent">Resources</span>
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === item.href
                      ? "bg-dark-600 text-white"
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-400">{user.username}</span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-300 transition hover:border-danger hover:text-danger"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
