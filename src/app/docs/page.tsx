"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded px-1.5 py-0.5 text-xs text-gray-500 transition hover:bg-dark-600 hover:text-gray-300"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function Placeholder({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5">
      <div className="min-w-0">
        <code className="break-words text-sm font-medium text-accent">{name}</code>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
      <CopyButton text={name} />
    </div>
  );
}

function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="border-t border-dark-600 p-4">{children}</div>}
    </div>
  );
}

function ConfigFileCard({
  name,
  fileName,
  description,
  keys,
}: {
  name: string;
  fileName: string;
  description: string;
  keys: string[];
}) {
  return (
    <Collapsible title={`${name} — ${fileName}`}>
      <p className="mb-3 text-sm text-gray-400">{description}</p>
      <div className="space-y-1">
        {keys.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <code className="rounded bg-dark-900 px-2 py-0.5 text-xs text-gray-300">{key}</code>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800 p-4 transition hover:border-accent/30">
      <div className="mb-2 text-2xl leading-none">{icon}</div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-400">{description}</p>
    </div>
  );
}

function CommandCard({ usage, description, permission }: { usage: string; description: string; permission?: string }) {
  return (
    <div className="rounded-xl border border-dark-600 border-l-4 border-l-green-500 bg-dark-800 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <code className="text-sm font-bold text-green-400">{usage}</code>
        {permission && (
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-400">
            {permission}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-gray-400">{description}</p>
    </div>
  );
}

function PermRow({ node, description }: { node: string; description: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3">
      <div className="min-w-0 flex-1">
        <code className="text-sm font-medium text-purple-400">{node}</code>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
      <CopyButton text={node} />
    </div>
  );
}

function HookCard({ action, description, example }: { action: string; description: string; example?: string }) {
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800 p-4">
      <span className="inline-block rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-400">
        {action}
      </span>
      <p className="mt-2 text-xs text-gray-400">{description}</p>
      {example && (
        <code className="mt-2 block rounded bg-dark-900 px-3 py-1.5 text-[11px] text-gray-300">
          {example}
        </code>
      )}
    </div>
  );
}

function DepChip({ name, required = false }: { name: string; required?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${required ? "border-accent/30 bg-accent/5" : "border-dark-600 bg-dark-700"}`}>
      <span className={`block text-[10px] font-semibold uppercase tracking-wide ${required ? "text-accent" : "text-gray-500"}`}>
        {required ? "Required" : "Optional"}
      </span>
      <p className="mt-0.5 text-sm font-medium text-white">{name}</p>
    </div>
  );
}

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="text-xl leading-none">{emoji}</span>
      <h2 className="text-base font-bold text-white">{label}</h2>
    </div>
  );
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("magnoxlobby");

  const tabs = [
    { id: "magnoxlobby", label: "MagnoxLobby" },
    { id: "magnoxpunish", label: "MagnoxPunish" },
    { id: "placeholders", label: "Placeholders" },
    { id: "api", label: "Plugin API" },
  ];

  return (
    <SiteLayout active="docs">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Documentation</h1>
          <p className="mt-2 text-sm text-gray-400">
            Complete reference for all Magnox plugins — features, commands, permissions, hooks, and configuration.
          </p>
        </div>

        {/* Tab nav */}
        <div className="mb-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max min-w-full gap-1 rounded-lg bg-dark-800 p-1 sm:w-full sm:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-accent text-white"
                    : "text-gray-400 hover:bg-dark-700 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── MagnoxLobby ─── */}
        {activeTab === "magnoxlobby" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-dark-800 to-dark-800 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-2xl font-black text-accent">
                  L
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">MagnoxLobby</h2>
                    <span className="rounded-md bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      Paper Plugin
                    </span>
                    <span className="rounded-md bg-dark-600 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      1.21.4+
                    </span>
                    <span className="rounded-md bg-dark-600 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      Java 21+
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-gray-300">
                    A comprehensive lobby management plugin for Paper servers. Manage spawn,
                    world protection, cosmetics, server selectors, and much more — all
                    configurable live through the web panel.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <SectionTitle emoji="✦" label="Features" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: "📍", title: "Spawn Management", description: "Set a lobby spawn point and auto-teleport players on join. Optionally clear their inventory." },
                  { icon: "🛡️", title: "World Protection", description: "15 toggleable rules: no PvP, no hunger, no build, void protection, no mob spawning, and more." },
                  { icon: "⬆️", title: "Double Jump", description: "Configurable double jump with custom horizontal/vertical force, cooldown, particles, and sounds." },
                  { icon: "📊", title: "Scoreboard", description: "Animated sidebar scoreboard with full placeholder support and configurable update interval." },
                  { icon: "📋", title: "Tab List", description: "Custom header, footer, and player name format in the tab list with placeholder support." },
                  { icon: "🎒", title: "Hotbar Items", description: "Give players custom items on join that trigger actions when clicked — open menus, run commands." },
                  { icon: "🌐", title: "Server Selector", description: "GUI menu for switching between BungeeCord/Velocity backend servers." },
                  { icon: "🎨", title: "Cosmetics", description: "Particle trails, chat colors, join/leave messages, nickname colors, and throwable gadgets." },
                  { icon: "💬", title: "Chat Formatting", description: "Custom chat format with full PlaceholderAPI and MiniMessage tag support." },
                  { icon: "🤖", title: "NPC Hooks", description: "Trigger actions when players click FancyNpcs NPCs — connect to servers, open menus, run commands." },
                  { icon: "👁️", title: "Player Visibility", description: "Let players toggle whether they can see other players in the lobby." },
                  { icon: "📢", title: "Announcements", description: "Auto-broadcast configurable messages to all players on a timed interval." },
                  { icon: "✈️", title: "Fly", description: "Permission-based flight toggle with configurable fly and walk speed." },
                  { icon: "👻", title: "Vanish", description: "Hide from all players with /vanish — invisible to everyone including staff." },
                  { icon: "🗄️", title: "Multi-Database", description: "SQLite, MySQL, MariaDB, PostgreSQL, and MongoDB backends for cosmetic data." },
                  { icon: "🔄", title: "Live Panel Sync", description: "All configs editable live in the web panel. Changes apply within 30 seconds." },
                ].map((f) => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
            </div>

            {/* Commands */}
            <div>
              <SectionTitle emoji="/" label="Commands" />
              <div className="space-y-3">
                <CommandCard usage="/spawn" description="Teleport to the lobby spawn point." />
                <CommandCard usage="/setspawn" description="Set the lobby spawn to your current location and look direction." permission="magnoxlobby.admin.setspawn" />
                <CommandCard usage="/fly" description="Toggle flight mode on/off." permission="magnoxlobby.fly" />
                <CommandCard usage="/vanish" description="Toggle vanish — become hidden from all other players." permission="magnoxlobby.vanish" />
                <CommandCard usage="/magnoxlobby reload" description="Reload all configuration files from disk without restarting the server." permission="magnoxlobby.admin" />
                <CommandCard usage="/magnoxlobby version" description="Show the currently running plugin version." permission="magnoxlobby.admin" />
                <CommandCard usage="/magnoxlobby help" description="List all available commands with descriptions." />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <SectionTitle emoji="🔑" label="Permissions" />
              <div className="space-y-2">
                <PermRow node="magnoxlobby.admin" description="Access to /magnoxlobby reload, version, and help" />
                <PermRow node="magnoxlobby.admin.setspawn" description="Set the lobby spawn point with /setspawn" />
                <PermRow node="magnoxlobby.admin.build" description="Bypass world protection — place and break blocks in the lobby" />
                <PermRow node="magnoxlobby.fly" description="Toggle flight mode with /fly" />
                <PermRow node="magnoxlobby.vanish" description="Toggle vanish with /vanish" />
                <PermRow node="magnoxlobby.doublejump" description="Use the double jump mechanic" />
                <PermRow node="magnoxlobby.visibility" description="Toggle other player visibility" />
                <PermRow node="magnoxlobby.cosmetic.*" description="Access all cosmetics — grant sub-nodes to restrict individual categories" />
              </div>
            </div>

            {/* Hooks */}
            <div>
              <SectionTitle emoji="🔗" label="Hooks" />
              <p className="mb-4 text-sm text-gray-400">
                MagnoxLobby integrates with{" "}
                <span className="font-semibold text-orange-400">FancyNpcs</span> to trigger
                actions when players click NPCs. Configure in{" "}
                <code className="text-gray-300">configs/hooks.yml</code> using each NPC&apos;s
                exact name as the key.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <HookCard action="SEND_MESSAGE" description="Send a MiniMessage-formatted message to the player who clicked the NPC." example={'data: "<green>Welcome to the lobby!"'} />
                <HookCard action="CONNECT_SERVER" description="Connect the player to a named backend BungeeCord/Velocity server." example={'data: "survival"'} />
                <HookCard action="OPEN_SERVER_SELECTOR" description="Open the server selector GUI menu defined in server-selector.yml." />
                <HookCard action="RUN_COMMAND" description="Run a console command when the player clicks. Use {player} for the player name." example={'data: "give {player} diamond 1"'} />
                <HookCard action="OPEN_COSMETICS" description="Open the cosmetics selection menu for the clicking player." />
              </div>
              <div className="mt-4 rounded-xl border border-dark-600 bg-dark-800 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">hooks.yml example</p>
                <pre className="overflow-x-auto text-xs text-gray-300">{`npc-actions:
  SurvivalNPC:
    action: CONNECT_SERVER
    data: "survival"
  ShopNPC:
    action: RUN_COMMAND
    data: "shop open {player}"
  WelcomeNPC:
    action: SEND_MESSAGE
    data: "<gold>Welcome to the network!"`}</pre>
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <SectionTitle emoji="📦" label="Dependencies" />
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <DepChip name="Paper 1.21.4+" required />
                <DepChip name="Java 21+" required />
                <DepChip name="PlaceholderAPI" />
                <DepChip name="Vault" />
                <DepChip name="LuckPerms" />
                <DepChip name="FancyNpcs" />
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Optional dependencies are detected at runtime. The plugin starts and works fully without them.
              </p>
            </div>

            {/* Config Reference */}
            <div>
              <SectionTitle emoji="⚙️" label="Configuration Reference" />
              <div className="space-y-2">
                <ConfigFileCard name="Settings" fileName="settings.yml" description="Main plugin configuration. Message prefix and panel token." keys={["prefix", "panel.token"]} />
                <ConfigFileCard name="Spawn" fileName="configs/spawn.yml" description="Spawn location and join teleportation settings." keys={["spawn.world", "spawn.x", "spawn.y", "spawn.z", "spawn.yaw", "spawn.pitch", "teleport-on-join", "clear-inventory-on-join"]} />
                <ConfigFileCard name="Protection" fileName="configs/protection.yml" description="World protection toggles for the lobby." keys={["no-pvp", "no-hunger", "no-build", "no-item-drop", "no-item-pickup", "no-fall-damage", "no-all-damage", "void-protection", "no-weather", "no-mob-spawning", "no-fire-spread", "no-block-interact", "no-leaf-decay", "no-explosions", "disable-achievements"]} />
                <ConfigFileCard name="Double Jump" fileName="configs/doublejump.yml" description="Double jump mechanics and effects." keys={["enabled", "horizontal-multiplier", "vertical-force", "cooldown-seconds", "sound", "sound-volume", "sound-pitch", "particles", "particle-type", "particle-count"]} />
                <ConfigFileCard name="Scoreboard" fileName="configs/scoreboard.yml" description="Sidebar scoreboard content and animation." keys={["enabled", "title", "update-interval-ticks", "lines"]} />
                <ConfigFileCard name="Tab List" fileName="configs/tablist.yml" description="Player list header, footer, and name format." keys={["enabled", "update-interval-ticks", "header", "footer", "name-format"]} />
                <ConfigFileCard name="Hotbar" fileName="configs/hotbar.yml" description="Items given to players on join with click actions." keys={["enabled", "items.{id}.material", "items.{id}.slot", "items.{id}.name", "items.{id}.lore", "items.{id}.action"]} />
                <ConfigFileCard name="Server Selector" fileName="configs/server-selector.yml" description="GUI menu for BungeeCord server switching." keys={["title", "size", "border", "servers.{id}.material", "servers.{id}.name", "servers.{id}.slot", "servers.{id}.bungee-name"]} />
                <ConfigFileCard name="Cosmetics" fileName="configs/cosmetics.yml" description="Particle trails, chat colors, join/leave messages, nickname colors, and gadgets." keys={["particle-trails.{id}", "chat-colors.{id}", "join-messages.{id}", "leave-messages.{id}", "nickname-colors.{id}", "gadgets.{id}"]} />
                <ConfigFileCard name="Player" fileName="configs/player.yml" description="Player state on join (heal, feed, gamemode, speed)." keys={["heal-on-join", "feed-on-join", "clear-effects-on-join", "gamemode-on-join", "fly-speed", "walk-speed"]} />
                <ConfigFileCard name="Chat" fileName="configs/chat.yml" description="Custom chat format with placeholder support." keys={["enabled", "format"]} />
                <ConfigFileCard name="Join & Leave" fileName="configs/join-leave.yml" description="Custom join/leave messages and sounds." keys={["custom-join-message", "join-message", "leave-message", "join-sound", "join-sound-volume", "join-sound-pitch"]} />
                <ConfigFileCard name="Messages" fileName="configs/messages.yml" description="All player-facing messages and notifications." keys={["no-permission", "spawn-set", "spawn-teleport", "visibility-hidden", "visibility-shown", "cosmetic-equipped", "cosmetic-unequipped", "cosmetic-no-permission", "cooldown-active", "config-reloaded", "fly-enabled", "fly-disabled", "vanish-enabled", "vanish-disabled"]} />
                <ConfigFileCard name="Hooks" fileName="configs/hooks.yml" description="NPC click actions for FancyNpcs integration." keys={["npc-actions.{name}.action", "npc-actions.{name}.data"]} />
                <ConfigFileCard name="Announcements" fileName="configs/announcements.yml" description="Auto-broadcast messages to all players on a timed interval." keys={["enabled", "interval-seconds", "messages"]} />
                <ConfigFileCard name="Database" fileName="configs/database.yml" description="Database backend for player data. Supports SQLite, MySQL, MariaDB, PostgreSQL, and MongoDB." keys={["type", "sqlite.file", "mysql.host", "mysql.port", "mysql.database", "mysql.username", "mysql.password", "mysql.pool-size", "mariadb.*", "postgresql.*", "mongodb.connection-string", "mongodb.database"]} />
              </div>
            </div>

            {/* Known Issues */}
            <div>
              <SectionTitle emoji="🐛" label="Known Issues" />
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                <div className="text-3xl">✓</div>
                <p className="mt-2 text-sm font-semibold text-green-400">No known issues</p>
                <p className="mt-1 text-xs text-gray-500">MagnoxLobby is stable. Report bugs to the developer.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── MagnoxPunish ─── */}
        {activeTab === "magnoxpunish" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-dark-800 to-dark-800 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-2xl font-black text-red-400">
                  P
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">MagnoxPunish</h2>
                    <span className="rounded-md bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                      Velocity Plugin
                    </span>
                    <span className="rounded-md bg-dark-600 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      Velocity 3+
                    </span>
                    <span className="rounded-md bg-dark-600 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      Java 17+
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-gray-300">
                    A punishment management system for Velocity proxies. Bans, mutes, kicks,
                    warnings, and full history tracking — with live data pushed to the panel every
                    60 seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <SectionTitle emoji="✦" label="Features" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: "🚫", title: "Permanent Bans", description: "Globally ban players from the entire network until manually unbanned. Immediate disconnect if online." },
                  { icon: "⏱️", title: "Temp Bans", description: "Time-limited bans with a flexible duration parser (e.g. 1d2h30m). Auto-expire on login attempt." },
                  { icon: "🔇", title: "Permanent Mutes", description: "Silence players from chat network-wide with a configurable reason." },
                  { icon: "⏳", title: "Temp Mutes", description: "Time-limited mutes that auto-expire. Chat messages from muted players are silently cancelled." },
                  { icon: "👟", title: "Kicks", description: "Instantly disconnect a player from the proxy with a custom reason message." },
                  { icon: "⚠️", title: "Warnings", description: "Issue in-game warnings that appear to the player and are recorded in their history." },
                  { icon: "📜", title: "History Tracking", description: "Full punishment history per player — view all past bans, mutes, kicks, and warnings with /history." },
                  { icon: "⏰", title: "Duration Parser", description: "Flexible duration format. Combine s, m, h, d, w units — e.g. 1d12h for 1 day 12 hours." },
                  { icon: "🎨", title: "MiniMessage Support", description: "All messages support MiniMessage tags (<red>, <gradient:red:blue>, <hover>) and legacy &c codes." },
                  { icon: "📡", title: "Panel Integration", description: "Pushes a full punishment snapshot to the panel every 60 seconds for live viewing in the dashboard." },
                  { icon: "🗄️", title: "Multi-Database", description: "SQLite (default), MySQL, MariaDB, and PostgreSQL via HikariCP connection pooling." },
                  { icon: "📢", title: "Staff Broadcasts", description: "Configurable broadcast messages notify all online staff when a punishment is issued." },
                ].map((f) => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
            </div>

            {/* Commands */}
            <div>
              <SectionTitle emoji="/" label="Commands" />
              <div className="space-y-3">
                <CommandCard usage="/ban <player> <reason>" description="Permanently ban a player from the network. Immediately disconnects them if online." permission="punishments.ban" />
                <CommandCard usage="/tempban <player> <duration> <reason>" description="Temporarily ban a player. Duration format: 1d2h30m. The ban auto-expires on their next login attempt." permission="punishments.tempban" />
                <CommandCard usage="/unban <player>" description="Remove an active permanent or temporary ban from a player." permission="punishments.unban" />
                <CommandCard usage="/mute <player> <reason>" description="Permanently mute a player across all servers on the network." permission="punishments.mute" />
                <CommandCard usage="/tempmute <player> <duration> <reason>" description="Temporarily mute a player for the specified duration." permission="punishments.tempmute" />
                <CommandCard usage="/unmute <player>" description="Remove an active permanent or temporary mute from a player." permission="punishments.unmute" />
                <CommandCard usage="/kick <player> <reason>" description="Immediately disconnect a player from the proxy with a reason message." permission="punishments.kick" />
                <CommandCard usage="/warn <player> <reason>" description="Issue an in-game warning. Shown to the player and recorded in their punishment history." permission="punishments.warn" />
                <CommandCard usage="/history <player>" description="View a player's full punishment history including all bans, mutes, kicks, and warnings." permission="punishments.history" />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <SectionTitle emoji="🔑" label="Permissions" />
              <div className="space-y-2">
                <PermRow node="punishments.ban" description="Use /ban to permanently ban a player" />
                <PermRow node="punishments.tempban" description="Use /tempban to temporarily ban a player" />
                <PermRow node="punishments.unban" description="Use /unban to remove an active ban" />
                <PermRow node="punishments.mute" description="Use /mute to permanently mute a player" />
                <PermRow node="punishments.tempmute" description="Use /tempmute to temporarily mute a player" />
                <PermRow node="punishments.unmute" description="Use /unmute to remove an active mute" />
                <PermRow node="punishments.kick" description="Use /kick to disconnect a player from the proxy" />
                <PermRow node="punishments.warn" description="Use /warn to issue an in-game warning" />
                <PermRow node="punishments.history" description="Use /history to view a player's punishment history" />
              </div>
            </div>

            {/* Hooks */}
            <div>
              <SectionTitle emoji="🔗" label="Hooks" />
              <div className="rounded-xl border border-dark-600 bg-dark-800 p-5">
                <p className="mb-4 text-sm text-gray-400">
                  MagnoxPunish has no third-party plugin integrations. It hooks into Velocity
                  network events internally and exposes data through the panel.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Panel Data Push",
                      detail: "Every 60 seconds, the plugin pushes a full punishment snapshot to the Magnox panel via POST /api/v1/punishments. Viewable in the dashboard under View Punishments.",
                    },
                    {
                      label: "Login Hook",
                      detail: "On player connect, the plugin checks for an active ban. If found, the player is immediately disconnected with the configured disconnect message.",
                    },
                    {
                      label: "Chat Hook",
                      detail: "On every chat message, the plugin checks for an active mute. If found, the message is cancelled and the player receives the muted-chat message.",
                    },
                  ].map((h) => (
                    <div key={h.label} className="flex items-start gap-3 rounded-lg bg-dark-700 px-4 py-3">
                      <span className="mt-0.5 text-orange-400">●</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{h.label}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{h.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <SectionTitle emoji="📦" label="Dependencies" />
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <DepChip name="Velocity 3+" required />
                <DepChip name="Java 17+" required />
              </div>
              <p className="mt-3 text-xs text-gray-500">
                No optional dependencies — MagnoxPunish is fully self-contained.
              </p>
            </div>

            {/* Config Reference */}
            <div>
              <SectionTitle emoji="⚙️" label="Configuration Reference" />
              <div className="space-y-2">
                <ConfigFileCard name="Settings" fileName="settings.yml" description="Panel token and general plugin settings." keys={["panel.token", "general.prefix", "general.date-format", "general.history-limit"]} />
                <ConfigFileCard name="Database" fileName="configs/database.yml" description="Database backend. Set type to sqlite, mysql, mariadb, or postgresql and fill in the matching sub-section." keys={["database.type", "database.sqlite.file", "database.mysql.host", "database.mysql.port", "database.mysql.database", "database.mysql.username", "database.mysql.password", "database.mysql.pool-size", "database.mariadb.host", "database.mariadb.port", "database.mariadb.database", "database.mariadb.username", "database.mariadb.password", "database.mariadb.pool-size", "database.postgresql.host", "database.postgresql.port", "database.postgresql.database", "database.postgresql.username", "database.postgresql.password", "database.postgresql.pool-size"]} />
                <ConfigFileCard name="Messages" fileName="configs/messages.yml" description="All player-facing messages. Supports legacy & color codes and MiniMessage tags." keys={["messages.only-players", "messages.ban.usage", "messages.ban.disconnect", "messages.ban.broadcast", "messages.tempban.usage", "messages.tempban.disconnect", "messages.tempban.broadcast", "messages.unban.usage", "messages.unban.success", "messages.unban.not-banned", "messages.mute.usage", "messages.mute.success", "messages.mute.broadcast", "messages.tempmute.usage", "messages.tempmute.success", "messages.tempmute.broadcast", "messages.unmute.usage", "messages.unmute.success", "messages.unmute.not-muted", "messages.kick.usage", "messages.kick.disconnect", "messages.kick.broadcast", "messages.warn.usage", "messages.warn.success", "messages.warn.broadcast", "messages.history.usage", "messages.history.header", "messages.history.entry", "messages.history.empty", "messages.login-ban.disconnect", "messages.muted-chat.kick"]} />
              </div>

              <div className="mt-3 space-y-2">
                <Collapsible title="Duration Format">
                  <p className="mb-3 text-sm text-gray-400">
                    Used for <code className="text-gray-300">/tempban</code> and{" "}
                    <code className="text-gray-300">/tempmute</code>. Combine multiple units.
                  </p>
                  <div className="space-y-2">
                    <Placeholder name="s" description="Seconds (e.g. 30s)" />
                    <Placeholder name="m" description="Minutes (e.g. 15m)" />
                    <Placeholder name="h" description="Hours (e.g. 2h)" />
                    <Placeholder name="d" description="Days (e.g. 7d)" />
                    <Placeholder name="w" description="Weeks (e.g. 2w)" />
                    <Placeholder name="1d2h30m" description="Combined: 1 day, 2 hours, 30 minutes" />
                  </div>
                </Collapsible>
                <Collapsible title="Message Placeholders (9)">
                  <p className="mb-3 text-sm text-gray-400">
                    Available in all message templates in{" "}
                    <code className="text-gray-300">configs/messages.yml</code>. Messages support
                    legacy <code className="text-gray-300">&amp;c</code> codes and MiniMessage tags.
                  </p>
                  <div className="space-y-2">
                    <Placeholder name="{player}" description="Target player's name" />
                    <Placeholder name="{reason}" description="Punishment reason" />
                    <Placeholder name="{punisher}" description="Staff member who issued the punishment" />
                    <Placeholder name="{duration}" description="Duration string (e.g. '2 hours 30 minutes')" />
                    <Placeholder name="{remaining}" description="Time remaining until expiry" />
                    <Placeholder name="{id}" description="Punishment database ID (history)" />
                    <Placeholder name="{status}" description="ACTIVE or INACTIVE label (history)" />
                    <Placeholder name="{type}" description="Punishment type (BAN, MUTE, KICK, WARN)" />
                    <Placeholder name="{date}" description="Date punishment was issued (history)" />
                  </div>
                </Collapsible>
              </div>
            </div>

            {/* Known Issues */}
            <div>
              <SectionTitle emoji="🐛" label="Known Issues" />
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                <div className="text-3xl">✓</div>
                <p className="mt-2 text-sm font-semibold text-green-400">No known issues</p>
                <p className="mt-1 text-xs text-gray-500">MagnoxPunish is stable. Report bugs to the developer.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Placeholders ─── */}
        {activeTab === "placeholders" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-4 sm:p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">Built-in Placeholders</h2>
              <p className="mb-4 text-sm text-gray-400">
                Available in all MagnoxLobby config files. No plugins required.
              </p>
              <div className="space-y-2">
                <Placeholder name="{player}" description="Player's display name" />
                <Placeholder name="{online}" description="Current online player count" />
                <Placeholder name="{max_players}" description="Maximum player slots" />
                <Placeholder name="{server}" description="Server name" />
                <Placeholder name="{world}" description="Player's current world name" />
                <Placeholder name="{ping}" description="Player's latency in ms" />
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-4 sm:p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">PlaceholderAPI Placeholders</h2>
              <p className="mb-4 text-sm text-gray-400">
                Requires <span className="text-accent">PlaceholderAPI</span> installed on your
                server. Use <code className="text-gray-300">%placeholder%</code> format in config
                files.
              </p>
              <div className="space-y-3">
                <Collapsible title="Player (14)">
                  <div className="space-y-2">
                    <Placeholder name="%player_name%" description="Player's username" />
                    <Placeholder name="%player_displayname%" description="Player's display name (with formatting)" />
                    <Placeholder name="%player_uuid%" description="Player's UUID" />
                    <Placeholder name="%player_health%" description="Current health (0-20)" />
                    <Placeholder name="%player_food_level%" description="Current hunger level (0-20)" />
                    <Placeholder name="%player_level%" description="Player's experience level" />
                    <Placeholder name="%player_gamemode%" description="Current gamemode (SURVIVAL, CREATIVE, etc.)" />
                    <Placeholder name="%player_world%" description="Name of the world the player is in" />
                    <Placeholder name="%player_x%" description="Player's X coordinate" />
                    <Placeholder name="%player_y%" description="Player's Y coordinate" />
                    <Placeholder name="%player_z%" description="Player's Z coordinate" />
                    <Placeholder name="%player_ping%" description="Player's latency in ms" />
                    <Placeholder name="%player_first_join%" description="Date of player's first join" />
                    <Placeholder name="%player_bed_x%" description="X coordinate of player's bed/respawn point" />
                  </div>
                </Collapsible>
                <Collapsible title="Server (10)">
                  <div className="space-y-2">
                    <Placeholder name="%server_online%" description="Total online players on the server" />
                    <Placeholder name="%server_max_players%" description="Maximum server slots" />
                    <Placeholder name="%server_tps%" description="Server TPS (ticks per second)" />
                    <Placeholder name="%server_tps_1%" description="Server TPS over last 1 minute" />
                    <Placeholder name="%server_tps_5%" description="Server TPS over last 5 minutes" />
                    <Placeholder name="%server_tps_15%" description="Server TPS over last 15 minutes" />
                    <Placeholder name="%server_ram_used%" description="RAM currently used (MB)" />
                    <Placeholder name="%server_ram_max%" description="Maximum RAM allocated (MB)" />
                    <Placeholder name="%server_uptime%" description="Server uptime since last restart" />
                    <Placeholder name="%server_version%" description="Minecraft server version" />
                  </div>
                </Collapsible>
                <Collapsible title="Economy & Ranks (7)">
                  <div className="space-y-2">
                    <Placeholder name="%vault_eco_balance%" description="Player's economy balance (requires Vault)" />
                    <Placeholder name="%vault_prefix%" description="Player's chat prefix (requires Vault)" />
                    <Placeholder name="%vault_suffix%" description="Player's chat suffix (requires Vault)" />
                    <Placeholder name="%vault_rank%" description="Player's primary group/rank (requires Vault)" />
                    <Placeholder name="%luckperms_prefix%" description="Player's LuckPerms prefix" />
                    <Placeholder name="%luckperms_suffix%" description="Player's LuckPerms suffix" />
                    <Placeholder name="%luckperms_primary_group_name%" description="Player's primary LuckPerms group" />
                  </div>
                </Collapsible>
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-4 sm:p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">MiniMessage Formatting</h2>
              <p className="mb-4 text-sm text-gray-400">
                MagnoxLobby and MagnoxPunish support MiniMessage tags for rich text. Legacy{" "}
                <code className="text-gray-300">&amp;c</code> codes are also accepted.
              </p>
              <div className="space-y-2">
                <Placeholder name="<red>text</red>" description="Basic color" />
                <Placeholder name="<bold>text</bold>" description="Bold text" />
                <Placeholder name="<italic>text</italic>" description="Italic text" />
                <Placeholder name="<underlined>text</underlined>" description="Underlined text" />
                <Placeholder name="<strikethrough>text</strikethrough>" description="Strikethrough text" />
                <Placeholder name="<gradient:red:blue>text</gradient>" description="Gradient between two colors" />
                <Placeholder name="<rainbow>text</rainbow>" description="Rainbow gradient" />
                <Placeholder name="<hover:show_text:'info'>text</hover>" description="Hover tooltip" />
                <Placeholder name="<click:run_command:'/cmd'>text</click>" description="Clickable text that runs a command" />
                <Placeholder name="<#FF5555>text</#FF5555>" description="Hex color" />
              </div>
            </div>
          </div>
        )}

        {/* ─── Plugin API ─── */}
        {activeTab === "api" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-4 sm:p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">Plugin API</h2>
              <p className="text-sm text-gray-400">
                REST API endpoints used by plugins to communicate with the panel. All requests
                require a <code className="text-gray-300">Bearer</code> token in the{" "}
                <code className="text-gray-300">Authorization</code> header.
              </p>
            </div>

            <Collapsible title="POST /api/v1/sync — Push configs to panel" defaultOpen>
              <p className="mb-3 text-sm text-gray-400">
                Called by the plugin on startup. Registers the plugin and uploads all config
                files. Auto-creates the server entry if the token is new.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Request Body</span>
                  <CopyButton text={`{\n  "pluginType": "MAGNOX_LOBBY",\n  "version": "1.0.0",\n  "configs": [\n    {\n      "fileName": "settings.yml",\n      "name": "settings",\n      "content": { "prefix": "&6[MagnoxLobby] &r" }\n    }\n  ]\n}`} />
                </div>
                <pre className="overflow-x-auto text-xs text-gray-300">{`{
  "pluginType": "MAGNOX_LOBBY",
  "version": "1.0.0",
  "configs": [
    {
      "fileName": "settings.yml",
      "name": "settings",
      "content": { "prefix": "&6[MagnoxLobby] &r" }
    }
  ]
}`}</pre>
              </div>
            </Collapsible>

            <Collapsible title="GET /api/v1/sync — Poll for pending changes">
              <p className="mb-3 text-sm text-gray-400">
                Called periodically by the plugin. Returns any config changes made through the
                panel that haven&apos;t been applied yet. Also updates the stored plugin version.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">Query Parameters</span>
                <pre className="mt-1 text-xs text-gray-300">{`?pluginType=MAGNOX_LOBBY&version=1.0.0`}</pre>
              </div>
              <div className="mt-3 rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">Response</span>
                <pre className="mt-1 overflow-x-auto text-xs text-gray-300">{`{
  "changes": [
    {
      "fileName": "configs/protection.yml",
      "name": "protection",
      "content": { "no-pvp": true }
    }
  ]
}`}</pre>
              </div>
            </Collapsible>

            <Collapsible title="POST /api/v1/heartbeat — Server status update">
              <p className="mb-3 text-sm text-gray-400">
                Called periodically to report server status. Updates the online indicator, player
                count, and TPS on the dashboard.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Request Body</span>
                  <CopyButton text={`{ "players": 12, "maxPlayers": 100, "tps": 19.98 }`} />
                </div>
                <pre className="text-xs text-gray-300">{`{ "players": 12, "maxPlayers": 100, "tps": 19.98 }`}</pre>
              </div>
            </Collapsible>

            <Collapsible title="POST /api/v1/punishments — Push punishment snapshot">
              <p className="mb-3 text-sm text-gray-400">
                Called by MagnoxPunish every 60 seconds. Replaces all stored punishments for that
                plugin with the latest snapshot.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">Request Body</span>
                <pre className="mt-1 overflow-x-auto text-xs text-gray-300">{`{
  "punishments": [
    {
      "id": "1",
      "playerUuid": "...",
      "playerName": "Steve",
      "type": "BAN",
      "reason": "Cheating",
      "punisherName": "Admin",
      "issuedAt": 1700000000000,
      "expiresAt": null,
      "active": true,
      "removedBy": null,
      "removedAt": null
    }
  ]
}`}</pre>
              </div>
            </Collapsible>

            <Collapsible title="POST /api/v1/verify — Validate token">
              <p className="mb-3 text-sm text-gray-400">
                Verify a server token and retrieve server info. Returns the server ID, name, and
                list of registered plugins.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">Response</span>
                <pre className="mt-1 overflow-x-auto text-xs text-gray-300">{`{
  "serverId": "clx...",
  "serverName": "My Server",
  "plugins": [
    { "id": "clx...", "type": "MAGNOX_LOBBY", "version": "1.0.0" }
  ]
}`}</pre>
              </div>
            </Collapsible>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
