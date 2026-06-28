"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Plugin {
  id: string;
  type: string;
  version: string | null;
  lastSync: string | null;
}

interface Server {
  id: string;
  name: string;
  token: string;
  address: string | null;
  online: boolean;
  players: number;
  maxPlayers: number;
  tps: number | null;
  lastSeen: string | null;
  plugins: Plugin[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  async function fetchServers() {
    const res = await fetch("/api/servers");
    if (res.ok) setServers(await res.json());
    setLoading(false);
  }

  async function createServer(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/servers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, address: newAddress || undefined }),
    });
    if (res.ok) {
      setNewName("");
      setNewAddress("");
      setShowCreate(false);
      await fetchServers();
    }
    setCreating(false);
  }

  function pluginLabel(type: string) {
    switch (type) {
      case "AURO_LOBBY": return "AuroLobby";
      case "AURO_PUNISH": return "AuroPunish";
      default: return type;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Servers</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your Minecraft servers and plugin configurations
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          + Add Server
        </button>
      </div>

      {showCreate && (
        <div className="mb-8 rounded-xl border border-dark-600 bg-dark-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">New Server</h2>
          <form onSubmit={createServer} className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Server name"
              className="flex-1 rounded-lg border border-dark-500 bg-dark-700 px-4 py-2 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
              required
            />
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Address (optional)"
              className="flex-1 rounded-lg border border-dark-500 bg-dark-700 px-4 py-2 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-accent px-6 py-2 font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}

      {servers.length === 0 ? (
        <div className="rounded-xl border border-dark-600 bg-dark-800 py-16 text-center">
          <div className="mb-4 text-5xl">🖥️</div>
          <h3 className="text-lg font-semibold text-white">No servers yet</h3>
          <p className="mt-2 text-sm text-gray-400">
            Add a server and connect your plugins to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => router.push(`/servers/${server.id}`)}
              className="rounded-xl border border-dark-600 bg-dark-800 p-6 text-left transition hover:border-dark-400"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {server.name}
                </h3>
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
              </div>

              {server.address && (
                <p className="mb-3 text-sm text-gray-400">{server.address}</p>
              )}

              {server.online && (
                <div className="mb-3 flex gap-4 text-sm text-gray-400">
                  <span>
                    {server.players}/{server.maxPlayers} players
                  </span>
                  {server.tps !== null && (
                    <span>{server.tps.toFixed(1)} TPS</span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {server.plugins.map((plugin) => (
                  <span
                    key={plugin.id}
                    className="rounded-md bg-dark-600 px-2.5 py-1 text-xs font-medium text-gray-300"
                  >
                    {pluginLabel(plugin.type)}
                    {plugin.version && (
                      <span className="ml-1 text-gray-500">
                        v{plugin.version}
                      </span>
                    )}
                  </span>
                ))}
                {server.plugins.length === 0 && (
                  <span className="text-xs text-gray-500">
                    No plugins connected
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
