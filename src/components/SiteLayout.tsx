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
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-dark-600 bg-dark-800/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <a
              href={siteUrls.home}
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
          <a
            href={siteUrls.panel}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            Open Panel
          </a>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-dark-700 py-8 text-center text-xs text-gray-600">
        MagnoxResources &middot; Minecraft server management tools
      </footer>
    </div>
  );
}
