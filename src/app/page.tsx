import { SiteLayout } from "@/components/SiteLayout";
import { siteUrls } from "@/lib/sites";

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800 p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteLayout active="home">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Magnox<span className="text-accent">Resources</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-gray-400 sm:text-lg">
            Powerful tools for managing your Minecraft server. Configure
            plugins, track punishments, and customize your lobby — all from
            one platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10">
            <a
              href={siteUrls.panel}
              className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover"
            >
              Open Panel
            </a>
            <a
              href={siteUrls.docs}
              className="rounded-lg border border-dark-500 px-6 py-3 font-medium text-gray-300 transition hover:border-accent hover:text-accent"
            >
              View Docs
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
          Everything you need
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <a
            href={siteUrls.panel}
            className="group rounded-2xl border border-dark-600 bg-dark-800 p-6 transition hover:border-accent/30 sm:p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Panel</h3>
            <p className="mt-2 text-sm text-gray-400">
              Real-time config editor with server monitoring, player counts,
              TPS tracking, and live sync with your plugins.
            </p>
            <span className="mt-4 inline-block text-sm text-accent opacity-0 transition group-hover:opacity-100">
              Open Panel &rarr;
            </span>
          </a>

          <a
            href={siteUrls.plugins}
            className="group rounded-2xl border border-dark-600 bg-dark-800 p-6 sm:p-8 transition hover:border-accent/30"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Plugins</h3>
            <p className="mt-2 text-sm text-gray-400">
              Browse MagnoxLobby and MagnoxPunish. Feature-rich lobby
              management and punishment system for your network.
            </p>
            <span className="mt-4 inline-block text-sm text-accent opacity-0 transition group-hover:opacity-100">
              View Plugins &rarr;
            </span>
          </a>

          <a
            href={siteUrls.docs}
            className="group rounded-2xl border border-dark-600 bg-dark-800 p-6 sm:p-8 transition hover:border-accent/30"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Documentation</h3>
            <p className="mt-2 text-sm text-gray-400">
              Configuration reference, placeholders, commands, permissions,
              and API docs for all Magnox plugins.
            </p>
            <span className="mt-4 inline-block text-sm text-accent opacity-0 transition group-hover:opacity-100">
              Read Docs &rarr;
            </span>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Built for server admins
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureItem
            title="Live Config Sync"
            description="Edit configs in the panel and they sync to your server automatically every 30 seconds."
          />
          <FeatureItem
            title="Multi-Server Support"
            description="Manage multiple servers from a single dashboard with separate configs for each."
          />
          <FeatureItem
            title="Server Monitoring"
            description="Track TPS, player count, and server status in real-time from the panel."
          />
          <FeatureItem
            title="Lobby Customization"
            description="Scoreboards, tab lists, hotbar items, cosmetics, double jump, and more."
          />
          <FeatureItem
            title="Punishment System"
            description="Bans, mutes, kicks, warnings, and full history tracking across your network."
          />
          <FeatureItem
            title="Multiple Databases"
            description="SQLite, MySQL, MariaDB, PostgreSQL, and MongoDB support out of the box."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-3 text-sm text-gray-400">
            Install a plugin, enable the panel, and paste your token. Your
            configs will appear automatically.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={siteUrls.plugins}
              className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover"
            >
              Browse Plugins
            </a>
            <a
              href={siteUrls.docs}
              className="rounded-lg border border-dark-500 px-6 py-3 font-medium text-gray-300 transition hover:border-accent hover:text-accent"
            >
              Read the Docs
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
