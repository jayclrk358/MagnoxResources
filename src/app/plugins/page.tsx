import { SiteLayout } from "@/components/SiteLayout";
import { siteUrls } from "@/lib/sites";

function FeatureBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-dark-600 px-3 py-1 text-xs text-gray-300">
      {label}
    </span>
  );
}

function RequirementItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-dark-700 px-4 py-2.5">
      <span className="block text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className="mt-0.5 block text-xs font-medium text-gray-300">{value}</span>
    </div>
  );
}

export default function PluginsPage() {
  return (
    <SiteLayout active="plugins">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Plugins</h1>
          <p className="mt-2 text-sm text-gray-400">
            Powerful, feature-rich plugins for your Minecraft server and
            proxy network.
          </p>
        </div>

        <div className="space-y-8">
          {/* MagnoxLobby */}
          <div className="rounded-2xl border border-dark-600 bg-dark-800 p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent">
                L
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">MagnoxLobby</h2>
                  <span className="rounded-md bg-dark-600 px-2.5 py-1 text-xs font-medium text-gray-300">
                    Paper Plugin
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  A comprehensive lobby management plugin for Paper servers.
                  Manage spawn, world protection, cosmetics, server selectors,
                  scoreboards, tab lists, and much more — all configurable
                  through the web panel.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Spawn Management",
                  "World Protection",
                  "Double Jump",
                  "Scoreboard",
                  "Tab List",
                  "Hotbar Items",
                  "Server Selector",
                  "Cosmetics",
                  "Chat Formatting",
                  "NPC Hooks",
                  "Gadgets",
                  "Player Visibility",
                  "Announcements",
                  "Fly",
                  "Vanish",
                  "Multi-Database",
                  "PlaceholderAPI",
                  "MiniMessage",
                  "Panel Sync",
                ].map((f) => (
                  <FeatureBadge key={f} label={f} />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <RequirementItem label="Platform" value="Paper 1.21.4+" />
              <RequirementItem label="Java" value="Java 21+" />
              <RequirementItem label="Databases" value="SQLite, MySQL, MariaDB, PostgreSQL, MongoDB" />
              <RequirementItem label="Optional" value="PlaceholderAPI, Vault, LuckPerms, FancyNpcs" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={siteUrls.docs}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                View Documentation
              </a>
            </div>
          </div>

          {/* MagnoxPunish */}
          <div className="rounded-2xl border border-dark-600 bg-dark-800 p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent">
                P
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">MagnoxPunish</h2>
                  <span className="rounded-md bg-dark-600 px-2.5 py-1 text-xs font-medium text-gray-300">
                    Velocity Plugin
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  A punishment management system for Velocity proxies. Supports
                  bans, temp bans, mutes, temp mutes, kicks, warnings, and full
                  history tracking with multiple database backends.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Permanent Bans",
                  "Temp Bans",
                  "Permanent Mutes",
                  "Temp Mutes",
                  "Kicks",
                  "Warnings",
                  "History Tracking",
                  "Duration Parser",
                  "Custom Messages",
                  "MiniMessage",
                  "Panel Sync",
                  "Multi-Database",
                ].map((f) => (
                  <FeatureBadge key={f} label={f} />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <RequirementItem label="Platform" value="Velocity" />
              <RequirementItem label="Java" value="Java 17+" />
              <RequirementItem label="Databases" value="SQLite, MySQL, MariaDB, PostgreSQL" />
              <RequirementItem label="Config" value="YAML" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={siteUrls.docs}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>

        {/* Quick Setup */}
        <div className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-white">Quick Setup</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-dark-800 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                1
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">
                Install Plugin
              </h3>
              <p className="text-xs text-gray-400">
                Drop the plugin JAR into your server&apos;s{" "}
                <code className="text-gray-300">plugins/</code> folder and
                restart the server.
              </p>
            </div>
            <div className="rounded-xl bg-dark-800 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                2
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">
                Enable Panel
              </h3>
              <p className="text-xs text-gray-400">
                Set{" "}
                <code className="text-gray-300">panel.enabled: true</code> in
                the plugin config and restart. A token is auto-generated.
              </p>
            </div>
            <div className="rounded-xl bg-dark-800 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                3
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">
                Connect
              </h3>
              <p className="text-xs text-gray-400">
                Copy the token from your plugin config and enter it on the{" "}
                <a href={siteUrls.panel} className="text-accent hover:underline">
                  panel
                </a>
                . Your configs will appear automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
