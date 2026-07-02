"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { siteUrls } from "@/lib/sites";

interface ConfigSummary {
  id: string;
  name: string;
  fileName: string;
  pending: boolean;
  updatedAt: string;
}

interface Plugin {
  id: string;
  type: string;
  version: string | null;
  lastSync: string | null;
  configs: ConfigSummary[];
}

interface Server {
  id: string;
  name: string;
  online: boolean;
  players: number;
  maxPlayers: number;
  tps: number | null;
  lastSeen: string | null;
  plugins: Plugin[];
  createdAt: string;
}

const SYNC_INTERVAL = 30;

function StatCard({
  label,
  value,
  sub,
  color = "text-white",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800 p-3 sm:p-5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold sm:text-2xl ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 truncate text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function nextSyncSeconds(lastSync: string | null, online: boolean): number | null {
  if (!online || !lastSync) return null;
  const elapsed = (Date.now() - new Date(lastSync).getTime()) / 1000;
  const remaining = SYNC_INTERVAL - (elapsed % SYNC_INTERVAL);
  return Math.max(0, Math.ceil(remaining));
}

function formatSyncCountdown(seconds: number | null): string {
  if (seconds === null) return "--";
  if (seconds <= 0) return "syncing...";
  return `${seconds}s`;
}

function serverNextSync(server: Server): number | null {
  if (!server.online) return null;
  const syncs = server.plugins
    .map((p) => nextSyncSeconds(p.lastSync, true))
    .filter((s): s is number => s !== null);
  return syncs.length > 0 ? Math.min(...syncs) : null;
}

function pluginLabel(type: string) {
  switch (type) {
    case "MAGNOX_LOBBY":
      return "MagnoxLobby";
    case "MAGNOX_PUNISH":
      return "MagnoxPunish";
    default:
      return type;
  }
}

function pluginIcon(type: string) {
  switch (type) {
    case "MAGNOX_LOBBY":
      return "/icon-magnoxlobby.svg";
    case "MAGNOX_PUNISH":
      return "/icon-magnoxpunish.svg";
    default:
      return "/icon-magnoxresources.svg";
  }
}

function pluginDescription(type: string) {
  switch (type) {
    case "MAGNOX_LOBBY":
      return "Lobby management, cosmetics, server selector, scoreboards, tab list, and more";
    case "MAGNOX_PUNISH":
      return "Punishment system — bans, mutes, kicks, warnings, and history tracking";
    default:
      return "";
  }
}

function tpsColor(tps: number) {
  if (tps >= 19) return "text-success";
  if (tps >= 15) return "text-warning";
  return "text-danger";
}

function ServerSection({
  server,
  collapsed,
  onToggleCollapse,
  onRename,
  onRemove,
}: {
  server: Server;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (serverId: string, name: string) => Promise<void>;
  onRemove: (serverId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(server.name);
  const [saving, setSaving] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (collapsed) return;
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [collapsed]);

  useEffect(() => {
    if (!editing) setEditName(server.name);
  }, [server.name, editing]);

  async function handleRename() {
    if (!editName.trim()) return;
    setSaving(true);
    await onRename(server.id, editName.trim());
    setEditing(false);
    setSaving(false);
  }

  async function handleRemove() {
    setRemoving(true);
    await onRemove(server.id);
    setRemoving(false);
  }

  const totalConfigs = server.plugins.reduce(
    (sum, p) => sum + p.configs.length,
    0
  );
  const pendingConfigs = server.plugins.reduce(
    (sum, p) => sum + p.configs.filter((c) => c.pending).length,
    0
  );
  const nextSync = serverNextSync(server);

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-900 p-4 sm:p-6">
      {/* Server Header — always visible */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-dark-700 hover:text-white"
            title={collapsed ? "Expand" : "Minimize"}
          >
            <svg
              className={`h-4 w-4 transition-transform ${collapsed ? "-rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            {editing ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  className="min-w-0 rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-xl font-bold text-white focus:border-accent focus:outline-none sm:text-2xl"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  disabled={saving}
                  className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-hover disabled:opacity-50"
                >
                  {saving ? "..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditName(server.name);
                  }}
                  className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="break-all text-xl font-bold text-white sm:text-2xl">{server.name}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-md px-2 py-1 text-xs text-gray-500 transition hover:bg-dark-600 hover:text-gray-300"
                >
                  Rename
                </button>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    server.online
                      ? "bg-success/10 text-success"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      server.online ? "bg-success" : "bg-gray-500"
                    }`}
                  />
                  {server.online ? "Online" : "Offline"}
                </span>
                {collapsed && server.online && (
                  <span className="text-xs text-gray-500">
                    {server.players}/{server.maxPlayers} players
                    {server.plugins.length > 0 && ` · ${server.plugins.length} plugins`}
                    {pendingConfigs > 0 && (
                      <span className="text-warning"> · {pendingConfigs} pending</span>
                    )}
                  </span>
                )}
              </div>
            )}
            {!collapsed && server.lastSeen && (
              <p className="mt-1 text-xs text-gray-500">
                Last activity: {timeAgo(server.lastSeen)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!collapsed && (
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="flex-1 rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent sm:flex-initial"
            >
              {showSetup ? "Hide Setup" : "Setup Guide"}
            </button>
          )}
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex-1 rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 transition hover:border-danger hover:text-danger disabled:opacity-50 sm:flex-initial"
          >
            {removing ? "..." : "Remove"}
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <>
          {/* Setup Guide */}
          {showSetup && (
            <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-6">
              <h3 className="mb-3 text-sm font-semibold text-accent">
                Quick Setup Guide
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-dark-800 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    1
                  </div>
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Install Plugin
                  </h4>
                  <p className="text-xs text-gray-400">
                    Drop the MagnoxLobby or MagnoxPunish JAR into your server&apos;s{" "}
                    <code className="text-gray-300">plugins/</code> folder and restart.
                  </p>
                </div>
                <div className="rounded-lg bg-dark-800 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    2
                  </div>
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Start the Server
                  </h4>
                  <p className="text-xs text-gray-400">
                    Start or restart your server. A panel token is auto-generated
                    on first run and printed to the server console.
                  </p>
                </div>
                <div className="rounded-lg bg-dark-800 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    3
                  </div>
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Enter Token
                  </h4>
                  <p className="text-xs text-gray-400">
                    Copy the token from your plugin config and enter it on this
                    panel. Your configs will appear automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="mt-6 mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
            <StatCard
              label="Players"
              value={
                server.online
                  ? `${server.players}/${server.maxPlayers}`
                  : "--"
              }
              sub={server.online ? "currently online" : "server offline"}
              color={server.online ? "text-white" : "text-gray-500"}
            />
            <StatCard
              label="TPS"
              value={
                server.online && server.tps !== null
                  ? server.tps.toFixed(1)
                  : server.online && server.plugins.some((p) => p.type === "MAGNOX_PUNISH")
                    ? "N/A"
                    : "--"
              }
              sub={
                server.online && server.tps !== null
                  ? server.tps >= 19
                    ? "healthy"
                    : server.tps >= 15
                      ? "moderate lag"
                      : "severe lag"
                  : server.online && server.plugins.some((p) => p.type === "MAGNOX_PUNISH")
                    ? "velocity proxy"
                    : "no data"
              }
              color={
                server.online && server.tps !== null
                  ? tpsColor(server.tps)
                  : "text-gray-500"
              }
            />
            <StatCard
              label="Plugins"
              value={String(server.plugins.length)}
              sub={`${totalConfigs} config files`}
            />
            <StatCard
              label="Pending"
              value={String(pendingConfigs)}
              sub={
                pendingConfigs > 0
                  ? "changes awaiting sync"
                  : "all synced"
              }
              color={pendingConfigs > 0 ? "text-warning" : "text-success"}
            />
            <StatCard
              label="Next Sync"
              value={server.online ? formatSyncCountdown(nextSync) : "--"}
              sub={
                server.online
                  ? nextSync !== null && nextSync <= 0
                    ? "syncing now"
                    : "until plugin polls"
                  : "server offline"
              }
              color={
                !server.online
                  ? "text-gray-500"
                  : nextSync !== null && nextSync <= 5
                    ? "text-accent"
                    : "text-white"
              }
            />
          </div>

          {/* Plugins */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Plugins</h3>
            <a
              href={siteUrls.docs}
              className="text-xs text-gray-400 transition hover:text-accent"
            >
              View Documentation &rarr;
            </a>
          </div>

          {server.plugins.length === 0 ? (
            <div className="rounded-xl border border-dark-600 bg-dark-800 py-12 text-center">
              <div className="mb-3 text-4xl text-gray-600">+</div>
              <h3 className="text-base font-semibold text-white">
                No plugins connected yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
                Enable the panel in your plugin config, restart the server, and
                the plugin will automatically register itself here.
              </p>
              <button
                onClick={() => setShowSetup(true)}
                className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                View Setup Guide
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {server.plugins.map((plugin) => {
                const pluginSync = nextSyncSeconds(plugin.lastSync, server.online);
                return (
                  <div
                    key={plugin.id}
                    className="rounded-xl border border-dark-600 bg-dark-800 p-4 sm:p-6"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={pluginIcon(plugin.type)}
                          alt={pluginLabel(plugin.type)}
                          className="h-10 w-10 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <h4 className="text-lg font-semibold text-white">
                            {pluginLabel(plugin.type)}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {pluginDescription(plugin.type)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {plugin.type === "MAGNOX_PUNISH" && (
                          <button
                            onClick={() =>
                              router.push(`/dashboard/punishments/${plugin.id}`)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-dark-500 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-danger/50 hover:text-danger"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View Punishments
                          </button>
                        )}
                        {plugin.version && (
                          <span className="rounded-md bg-dark-600 px-2.5 py-1 text-xs font-medium text-gray-300">
                            v{plugin.version}
                          </span>
                        )}
                        {plugin.lastSync && (
                          <span className="text-xs text-gray-500">
                            Synced {timeAgo(plugin.lastSync)}
                            {server.online && pluginSync !== null && (
                              <span className="text-gray-600">
                                {" · "}next in {formatSyncCountdown(pluginSync)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {plugin.configs.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {plugin.configs.map((config) => (
                          <button
                            key={config.id}
                            onClick={() =>
                              router.push(
                                `/dashboard/config/${plugin.id}?file=${encodeURIComponent(config.fileName)}`
                              )
                            }
                            className="group flex items-center justify-between rounded-lg border border-dark-600 bg-dark-700 px-4 py-3 text-left transition hover:border-accent/30 hover:bg-dark-600"
                          >
                            <div className="min-w-0">
                              <span className="block truncate text-sm font-medium text-white">
                                {config.name}
                              </span>
                              <span className="block truncate text-xs text-gray-500">
                                {config.fileName}
                              </span>
                            </div>
                            <div className="ml-2 flex shrink-0 items-center gap-2">
                              {config.pending && (
                                <span className="h-2 w-2 rounded-full bg-warning" title="Pending changes" />
                              )}
                              <span className="text-gray-600 transition group-hover:text-accent">
                                &rarr;
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-dark-500 py-6 text-center">
                        <p className="text-sm text-gray-500">
                          Waiting for initial config sync...
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          The plugin will push its configs on next restart
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AddServerForm({
  onAdd,
}: {
  onAdd: (token: string) => Promise<string | null>;
}) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setError("");
    setLoading(true);
    const err = await onAdd(token.trim());
    if (err) {
      setError(err);
    } else {
      setToken("");
      setOpen(false);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-dark-600 bg-dark-900/50 py-6 text-gray-500 transition hover:border-accent/30 hover:text-accent"
      >
        <span className="text-2xl">+</span>
        <span className="text-sm font-medium">Add Server</span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-900 p-4 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Add Server</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-lg border border-dark-500 bg-dark-700 px-4 py-2.5 font-mono text-sm text-white placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Paste server token from plugin config"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-danger">{error}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50 sm:flex-initial"
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setToken("");
              setError("");
            }}
            className="flex-1 rounded-lg border border-dark-500 px-4 py-2.5 text-sm text-gray-400 transition hover:text-white sm:flex-initial"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchServers() {
      const res = await fetch("/api/server");
      if (res.ok) {
        const data = await res.json();
        setServers(Array.isArray(data) ? data : [data]);
      }
      setLoading(false);
    }

    fetchServers();
    const interval = setInterval(fetchServers, 10000);
    return () => clearInterval(interval);
  }, []);

  function toggleCollapse(serverId: string) {
    setCollapsed((prev) => ({ ...prev, [serverId]: !prev[serverId] }));
  }

  async function handleRename(serverId: string, name: string) {
    const res = await fetch("/api/server", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, serverId }),
    });
    if (res.ok) {
      setServers((prev) =>
        prev.map((s) => (s.id === serverId ? { ...s, name } : s))
      );
    }
  }

  async function handleRemove(serverId: string) {
    const res = await fetch("/api/auth/token", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId }),
    });
    if (res.ok) {
      setServers((prev) => prev.filter((s) => s.id !== serverId));
    }
  }

  async function handleAddServer(token: string): Promise<string | null> {
    const res = await fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const data = await res.json();
      return data.error || "Invalid token";
    }
    const refreshRes = await fetch("/api/server");
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setServers(Array.isArray(data) ? data : [data]);
    }
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="space-y-6">
        <AddServerForm onAdd={handleAddServer} />
        <div className="py-12 text-center text-gray-400">
          No servers connected. Add a server to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddServerForm onAdd={handleAddServer} />
      {servers.map((server) => (
        <ServerSection
          key={server.id}
          server={server}
          collapsed={!!collapsed[server.id]}
          onToggleCollapse={() => toggleCollapse(server.id)}
          onRename={handleRename}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
