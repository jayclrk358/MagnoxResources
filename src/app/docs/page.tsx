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

function Placeholder({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5">
      <div>
        <code className="text-sm font-medium text-accent">{name}</code>
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
            <code className="rounded bg-dark-900 px-2 py-0.5 text-xs text-gray-300">
              {key}
            </code>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("placeholders");

  const tabs = [
    { id: "placeholders", label: "Placeholders" },
    { id: "magnoxlobby", label: "MagnoxLobby" },
    { id: "magnoxpunish", label: "MagnoxPunish" },
    { id: "api", label: "Plugin API" },
  ];

  return (
    <SiteLayout active="docs">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Documentation</h1>
          <p className="mt-2 text-sm text-gray-400">
            Reference for placeholders, config files, and plugin integration.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-lg bg-dark-800 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:bg-dark-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Placeholders Tab */}
        {activeTab === "placeholders" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">
                Built-in Placeholders
              </h2>
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

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">
                PlaceholderAPI Placeholders
              </h2>
              <p className="mb-4 text-sm text-gray-400">
                Requires{" "}
                <span className="text-accent">PlaceholderAPI</span> installed on
                your server. Use{" "}
                <code className="text-gray-300">%placeholder%</code> format in
                config files.
              </p>
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
                <Placeholder name="%vault_eco_balance%" description="Player's economy balance (requires Vault)" />
                <Placeholder name="%vault_prefix%" description="Player's chat prefix (requires Vault)" />
                <Placeholder name="%vault_suffix%" description="Player's chat suffix (requires Vault)" />
                <Placeholder name="%vault_rank%" description="Player's primary group/rank (requires Vault)" />
                <Placeholder name="%luckperms_prefix%" description="Player's LuckPerms prefix" />
                <Placeholder name="%luckperms_suffix%" description="Player's LuckPerms suffix" />
                <Placeholder name="%luckperms_primary_group_name%" description="Player's primary LuckPerms group" />
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">
                MiniMessage Formatting
              </h2>
              <p className="mb-4 text-sm text-gray-400">
                MagnoxLobby supports MiniMessage tags for rich text formatting in
                all config values. Legacy{" "}
                <code className="text-gray-300">&amp;c</code> color codes are
                also supported.
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

        {/* MagnoxLobby Tab */}
        {activeTab === "magnoxlobby" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">
                MagnoxLobby
              </h2>
              <p className="text-sm text-gray-400">
                A comprehensive lobby management plugin for Paper 1.21.4+.
                Manage spawn, protection, cosmetics, server selectors, and more.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
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
                ].map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-dark-600 px-3 py-1 text-xs text-gray-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-300">
              Configuration Files
            </h3>

            <ConfigFileCard
              name="Settings"
              fileName="settings.yml"
              description="Main plugin configuration. Message prefix and panel token."
              keys={["prefix", "panel.token"]}
            />
            <ConfigFileCard
              name="Spawn"
              fileName="configs/spawn.yml"
              description="Spawn location and join teleportation settings."
              keys={[
                "spawn.world",
                "spawn.x",
                "spawn.y",
                "spawn.z",
                "spawn.yaw",
                "spawn.pitch",
                "teleport-on-join",
                "clear-inventory-on-join",
              ]}
            />
            <ConfigFileCard
              name="Protection"
              fileName="configs/protection.yml"
              description="World protection toggles for the lobby."
              keys={[
                "no-pvp",
                "no-hunger",
                "no-build",
                "no-item-drop",
                "no-item-pickup",
                "no-fall-damage",
                "no-all-damage",
                "void-protection",
                "no-weather",
                "no-mob-spawning",
                "no-fire-spread",
                "no-block-interact",
                "no-leaf-decay",
                "no-explosions",
                "disable-achievements",
              ]}
            />
            <ConfigFileCard
              name="Double Jump"
              fileName="configs/doublejump.yml"
              description="Double jump mechanics and effects."
              keys={[
                "enabled",
                "horizontal-multiplier",
                "vertical-force",
                "cooldown-seconds",
                "sound",
                "sound-volume",
                "sound-pitch",
                "particles",
                "particle-type",
                "particle-count",
              ]}
            />
            <ConfigFileCard
              name="Scoreboard"
              fileName="configs/scoreboard.yml"
              description="Sidebar scoreboard content and animation."
              keys={["enabled", "title", "update-interval-ticks", "lines"]}
            />
            <ConfigFileCard
              name="Tab List"
              fileName="configs/tablist.yml"
              description="Player list header, footer, and name format."
              keys={[
                "enabled",
                "update-interval-ticks",
                "header",
                "footer",
                "name-format",
              ]}
            />
            <ConfigFileCard
              name="Hotbar"
              fileName="configs/hotbar.yml"
              description="Items given to players on join with click actions."
              keys={[
                "enabled",
                "items.{id}.material",
                "items.{id}.slot",
                "items.{id}.name",
                "items.{id}.lore",
                "items.{id}.action",
              ]}
            />
            <ConfigFileCard
              name="Server Selector"
              fileName="configs/server-selector.yml"
              description="GUI menu for BungeeCord server switching."
              keys={[
                "title",
                "size",
                "border",
                "servers.{id}.material",
                "servers.{id}.name",
                "servers.{id}.slot",
                "servers.{id}.bungee-name",
              ]}
            />
            <ConfigFileCard
              name="Cosmetics"
              fileName="configs/cosmetics.yml"
              description="Particle trails, chat colors, join/leave messages, nickname colors, and gadgets."
              keys={[
                "particle-trails.{id}",
                "chat-colors.{id}",
                "join-messages.{id}",
                "leave-messages.{id}",
                "nickname-colors.{id}",
                "gadgets.{id}",
              ]}
            />
            <ConfigFileCard
              name="Player"
              fileName="configs/player.yml"
              description="Player state on join (heal, feed, gamemode, speed)."
              keys={[
                "heal-on-join",
                "feed-on-join",
                "clear-effects-on-join",
                "gamemode-on-join",
                "fly-speed",
                "walk-speed",
              ]}
            />
            <ConfigFileCard
              name="Chat"
              fileName="configs/chat.yml"
              description="Custom chat format with placeholder support."
              keys={["enabled", "format"]}
            />
            <ConfigFileCard
              name="Join & Leave"
              fileName="configs/join-leave.yml"
              description="Custom join/leave messages and sounds."
              keys={[
                "custom-join-message",
                "join-message",
                "leave-message",
                "join-sound",
                "join-sound-volume",
                "join-sound-pitch",
              ]}
            />
            <ConfigFileCard
              name="Messages"
              fileName="configs/messages.yml"
              description="All player-facing messages and notifications."
              keys={[
                "no-permission",
                "spawn-set",
                "spawn-teleport",
                "visibility-hidden",
                "visibility-shown",
                "cosmetic-equipped",
                "cosmetic-unequipped",
                "cosmetic-no-permission",
                "cooldown-active",
                "config-reloaded",
                "fly-enabled",
                "fly-disabled",
                "vanish-enabled",
                "vanish-disabled",
              ]}
            />
            <ConfigFileCard
              name="Hooks"
              fileName="configs/hooks.yml"
              description="NPC click actions for FancyNpcs integration."
              keys={["npc-actions.{name}.action", "npc-actions.{name}.data"]}
            />
            <ConfigFileCard
              name="Announcements"
              fileName="configs/announcements.yml"
              description="Auto-broadcast messages to all players on a timed interval."
              keys={["enabled", "interval-seconds", "messages"]}
            />
            <ConfigFileCard
              name="Database"
              fileName="configs/database.yml"
              description="Database backend for player data. Supports SQLite, MySQL, MariaDB, PostgreSQL, and MongoDB."
              keys={[
                "type",
                "sqlite.file",
                "mysql.host",
                "mysql.port",
                "mysql.database",
                "mysql.username",
                "mysql.password",
                "mysql.pool-size",
                "mariadb.*",
                "postgresql.*",
                "mongodb.connection-string",
                "mongodb.database",
              ]}
            />

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Permissions
              </h3>
              <div className="space-y-2">
                <Placeholder
                  name="magnoxlobby.admin"
                  description="Access to /magnoxlobby reload, version, and help"
                />
                <Placeholder
                  name="magnoxlobby.admin.setspawn"
                  description="Set the lobby spawn point"
                />
                <Placeholder
                  name="magnoxlobby.admin.build"
                  description="Bypass build protection in the lobby"
                />
                <Placeholder
                  name="magnoxlobby.fly"
                  description="Toggle flight mode with /fly"
                />
                <Placeholder
                  name="magnoxlobby.vanish"
                  description="Toggle vanish mode with /vanish"
                />
                <Placeholder
                  name="magnoxlobby.doublejump"
                  description="Use double jump"
                />
                <Placeholder
                  name="magnoxlobby.visibility"
                  description="Toggle player visibility"
                />
                <Placeholder
                  name="magnoxlobby.cosmetic.*"
                  description="Access all cosmetics"
                />
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Commands
              </h3>
              <div className="space-y-2">
                <Placeholder
                  name="/spawn"
                  description="Teleport to the lobby spawn point"
                />
                <Placeholder
                  name="/setspawn"
                  description="Set the lobby spawn to your current location"
                />
                <Placeholder
                  name="/fly"
                  description="Toggle flight mode on/off"
                />
                <Placeholder
                  name="/vanish"
                  description="Toggle vanish — hide from all other players"
                />
                <Placeholder
                  name="/magnoxlobby reload"
                  description="Reload all configuration files"
                />
                <Placeholder
                  name="/magnoxlobby version"
                  description="Show the plugin version"
                />
                <Placeholder
                  name="/magnoxlobby help"
                  description="List all available commands"
                />
              </div>
            </div>
          </div>
        )}

        {/* MagnoxPunish Tab */}
        {activeTab === "magnoxpunish" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">
                MagnoxPunish
              </h2>
              <p className="text-sm text-gray-400">
                A punishment management system for Velocity proxies. Supports
                bans, temp bans, mutes, temp mutes, kicks, warnings, and full
                history tracking with multiple database backends.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Permanent Bans",
                  "Temp Bans",
                  "Permanent Mutes",
                  "Temp Mutes",
                  "Kicks",
                  "Warnings",
                  "History",
                  "MySQL",
                  "MariaDB",
                  "PostgreSQL",
                  "SQLite",
                ].map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-dark-600 px-3 py-1 text-xs text-gray-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <ConfigFileCard
              name="Config"
              fileName="config.toml"
              description="Main configuration file for MagnoxPunish. Database connection, messages, and panel settings."
              keys={[
                "database.type",
                "database.host",
                "database.port",
                "database.database",
                "database.username",
                "database.password",
                "database.pool-size",
                "general.prefix",
                "general.date-format",
                "general.history-limit",
                "panel.enabled",
                "panel.url",
                "panel.token",
              ]}
            />

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Commands
              </h3>
              <div className="space-y-2">
                <Placeholder
                  name="/ban <player> <reason>"
                  description="Permanently ban a player"
                />
                <Placeholder
                  name="/tempban <player> <duration> <reason>"
                  description="Temporarily ban a player (e.g. 1d2h30m)"
                />
                <Placeholder
                  name="/unban <player>"
                  description="Remove an active ban"
                />
                <Placeholder
                  name="/mute <player> <reason>"
                  description="Permanently mute a player"
                />
                <Placeholder
                  name="/tempmute <player> <duration> <reason>"
                  description="Temporarily mute a player"
                />
                <Placeholder
                  name="/unmute <player>"
                  description="Remove an active mute"
                />
                <Placeholder
                  name="/kick <player> <reason>"
                  description="Kick a player from the proxy"
                />
                <Placeholder
                  name="/warn <player> <reason>"
                  description="Issue a warning to a player"
                />
                <Placeholder
                  name="/history <player>"
                  description="View a player's full punishment history"
                />
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Permissions
              </h3>
              <div className="space-y-2">
                <Placeholder
                  name="punishments.ban"
                  description="Use /ban command"
                />
                <Placeholder
                  name="punishments.tempban"
                  description="Use /tempban command"
                />
                <Placeholder
                  name="punishments.unban"
                  description="Use /unban command"
                />
                <Placeholder
                  name="punishments.mute"
                  description="Use /mute command"
                />
                <Placeholder
                  name="punishments.tempmute"
                  description="Use /tempmute command"
                />
                <Placeholder
                  name="punishments.unmute"
                  description="Use /unmute command"
                />
                <Placeholder
                  name="punishments.kick"
                  description="Use /kick command"
                />
                <Placeholder
                  name="punishments.warn"
                  description="Use /warn command"
                />
                <Placeholder
                  name="punishments.history"
                  description="View punishment history"
                />
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Duration Format
              </h3>
              <p className="mb-3 text-sm text-gray-400">
                Used for <code className="text-gray-300">/tempban</code> and{" "}
                <code className="text-gray-300">/tempmute</code> durations.
                Combine multiple units.
              </p>
              <div className="space-y-2">
                <Placeholder name="s" description="Seconds (e.g. 30s)" />
                <Placeholder name="m" description="Minutes (e.g. 15m)" />
                <Placeholder name="h" description="Hours (e.g. 2h)" />
                <Placeholder name="d" description="Days (e.g. 7d)" />
                <Placeholder name="w" description="Weeks (e.g. 2w)" />
                <Placeholder
                  name="1d2h30m"
                  description="Combined: 1 day, 2 hours, 30 minutes"
                />
              </div>
            </div>

            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Message Placeholders
              </h3>
              <p className="mb-3 text-sm text-gray-400">
                Available in message templates in{" "}
                <code className="text-gray-300">config.toml</code>.
              </p>
              <div className="space-y-2">
                <Placeholder
                  name="{player}"
                  description="Target player's name"
                />
                <Placeholder
                  name="{reason}"
                  description="Punishment reason"
                />
                <Placeholder
                  name="{punisher}"
                  description="Staff member who issued the punishment"
                />
                <Placeholder
                  name="{duration}"
                  description="Duration string (e.g. '2 hours 30 minutes')"
                />
                <Placeholder
                  name="{remaining}"
                  description="Time remaining until expiry"
                />
                <Placeholder
                  name="{id}"
                  description="Punishment database ID (history)"
                />
                <Placeholder
                  name="{status}"
                  description="ACTIVE or INACTIVE label (history)"
                />
                <Placeholder
                  name="{type}"
                  description="Punishment type (BAN, MUTE, etc.)"
                />
                <Placeholder
                  name="{date}"
                  description="Date punishment was issued (history)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Plugin API Tab */}
        {activeTab === "api" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <h2 className="mb-1 text-lg font-semibold text-white">
                Plugin API
              </h2>
              <p className="text-sm text-gray-400">
                REST API endpoints used by plugins to communicate with the
                panel. All requests require a{" "}
                <code className="text-gray-300">Bearer</code> token in the{" "}
                <code className="text-gray-300">Authorization</code> header.
              </p>
            </div>

            <Collapsible
              title="POST /api/v1/sync — Push configs to panel"
              defaultOpen
            >
              <p className="mb-3 text-sm text-gray-400">
                Called by the plugin on startup. Registers the plugin and
                uploads all config files. Auto-creates the server entry if the
                token is new.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    Request Body
                  </span>
                  <CopyButton
                    text={`{
  "pluginType": "MAGNOX_LOBBY",
  "version": "1.0.0",
  "configs": [
    {
      "fileName": "settings.yml",
      "name": "settings",
      "content": { "prefix": "&6[MagnoxLobby] &r" }
    }
  ]
}`}
                  />
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
                Called periodically by the plugin. Returns any config changes
                made through the panel that haven&apos;t been applied yet.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">
                  Query Parameter
                </span>
                <pre className="mt-1 text-xs text-gray-300">{`?pluginType=MAGNOX_LOBBY`}</pre>
              </div>
              <div className="mt-3 rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">
                  Response
                </span>
                <pre className="mt-1 overflow-x-auto text-xs text-gray-300">{`{
  "changes": [
    {
      "fileName": "configs/protection.yml",
      "name": "protection",
      "content": { "no-pvp": true, ... }
    }
  ]
}`}</pre>
              </div>
            </Collapsible>

            <Collapsible title="POST /api/v1/heartbeat — Server status update">
              <p className="mb-3 text-sm text-gray-400">
                Called periodically to report server status. Updates the online
                indicator, player count, and TPS on the dashboard.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    Request Body
                  </span>
                  <CopyButton
                    text={`{ "players": 12, "maxPlayers": 100, "tps": 19.98 }`}
                  />
                </div>
                <pre className="text-xs text-gray-300">{`{ "players": 12, "maxPlayers": 100, "tps": 19.98 }`}</pre>
              </div>
            </Collapsible>

            <Collapsible title="POST /api/v1/verify — Validate token">
              <p className="mb-3 text-sm text-gray-400">
                Verify a server token and retrieve server info. Returns the
                server ID, name, and list of registered plugins.
              </p>
              <div className="rounded-lg bg-dark-900 p-4">
                <span className="text-xs font-medium text-gray-400">
                  Response
                </span>
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
