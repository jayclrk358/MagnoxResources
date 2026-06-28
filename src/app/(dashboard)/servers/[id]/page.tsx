"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

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
  token: string;
  address: string | null;
  online: boolean;
  players: number;
  maxPlayers: number;
  tps: number | null;
  lastSeen: string | null;
  plugins: Plugin[];
}

export default function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchServer();
  }, [id]);

  async function fetchServer() {
    const res = await fetch(`/api/servers/${id}`);
    if (res.ok) {
      const data = await res.json();
      setServer(data);
      setEditName(data.name);
      setEditAddress(data.address || "");
    }
    setLoading(false);
  }

  async function regenerateToken() {
    const res = await fetch(`/api/servers/${id}/regenerate-token`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setServer((s) => (s ? { ...s, token: data.token } : null));
      setShowToken(true);
    }
  }

  async function saveEdit() {
    const res = await fetch(`/api/servers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, address: editAddress || null }),
    });
    if (res.ok) {
      await fetchServer();
      setEditing(false);
    }
  }

  async function deleteServer() {
    const res = await fetch(`/api/servers/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
  }

  function pluginLabel(type: string) {
    switch (type) {
      case "AURO_LOBBY": return "AuroLobby";
      case "AURO_PUNISH": return "AuroPunish";
      default: return type;
    }
  }

  function pluginDescription(type: string) {
    switch (type) {
      case "AURO_LOBBY": return "Lobby management, cosmetics, server selector, and more";
      case "AURO_PUNISH": return "Punishment system with bans, mutes, kicks, and warnings";
      default: return "";
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="py-20 text-center text-gray-400">Server not found.</div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-sm text-gray-400 transition hover:text-white"
      >
        &larr; Back to Dashboard
      </button>

      {/* Server Info */}
      <div className="mb-8 rounded-xl border border-dark-600 bg-dark-800 p-6">
        <div className="flex items-start justify-between">
          <div>
            {editing ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-white focus:border-accent focus:outline-none"
                />
                <input
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Address"
                  className="rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                />
                <button
                  onClick={saveEdit}
                  className="rounded-lg bg-accent px-4 py-1.5 text-sm text-white hover:bg-accent-hover"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-dark-500 px-4 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">
                    {server.name}
                  </h1>
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
                  <p className="mt-1 text-sm text-gray-400">
                    {server.address}
                  </p>
                )}
              </>
            )}
          </div>
          {!editing && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-300 transition hover:border-accent hover:text-accent"
              >
                Edit
              </button>
              {confirmDelete ? (
                <div className="flex gap-2">
                  <button
                    onClick={deleteServer}
                    className="rounded-lg bg-danger px-3 py-1.5 text-sm text-white"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-300 transition hover:border-danger hover:text-danger"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {server.online && (
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="text-gray-400">Players: </span>
              <span className="text-white">
                {server.players}/{server.maxPlayers}
              </span>
            </div>
            {server.tps !== null && (
              <div>
                <span className="text-gray-400">TPS: </span>
                <span className="text-white">{server.tps.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Token Section */}
      <div className="mb-8 rounded-xl border border-dark-600 bg-dark-800 p-6">
        <h2 className="mb-3 text-lg font-semibold text-white">Server Token</h2>
        <p className="mb-4 text-sm text-gray-400">
          Place this token in your plugin configuration to connect it to this
          panel. The plugin will use this token to authenticate API requests.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 overflow-x-auto rounded-lg bg-dark-900 px-4 py-2.5 font-mono text-sm text-gray-300">
            {showToken ? server.token : "••••••••••••••••••••••••••••••••"}
          </code>
          <div className="flex gap-2">
            <button
              onClick={() => setShowToken(!showToken)}
              className="rounded-lg border border-dark-500 px-3 py-2 text-sm text-gray-300 transition hover:border-accent hover:text-accent"
            >
              {showToken ? "Hide" : "Reveal"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(server.token);
              }}
              className="rounded-lg border border-dark-500 px-3 py-2 text-sm text-gray-300 transition hover:border-accent hover:text-accent"
            >
              Copy
            </button>
            <button
              onClick={regenerateToken}
              className="rounded-lg border border-dark-500 px-3 py-2 text-sm text-gray-300 transition hover:border-warning hover:text-warning"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* Plugins */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Plugins</h2>
        {server.plugins.length === 0 ? (
          <div className="rounded-xl border border-dark-600 bg-dark-800 py-12 text-center">
            <h3 className="text-base font-semibold text-white">
              No plugins connected
            </h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-gray-400">
              Add the server token to your AuroLobby or AuroPunish plugin
              configuration, then restart the server. The plugin will
              automatically register itself.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {server.plugins.map((plugin) => (
              <div
                key={plugin.id}
                className="rounded-xl border border-dark-600 bg-dark-800 p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {pluginLabel(plugin.type)}
                  </h3>
                  {plugin.version && (
                    <span className="rounded-md bg-dark-600 px-2 py-0.5 text-xs text-gray-400">
                      v{plugin.version}
                    </span>
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-400">
                  {pluginDescription(plugin.type)}
                </p>

                {plugin.lastSync && (
                  <p className="mb-4 text-xs text-gray-500">
                    Last synced:{" "}
                    {new Date(plugin.lastSync).toLocaleString()}
                  </p>
                )}

                {plugin.configs.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">
                      Configuration Files
                    </h4>
                    {plugin.configs.map((config) => (
                      <button
                        key={config.id}
                        onClick={() =>
                          router.push(
                            `/servers/${id}/config/${plugin.id}?file=${encodeURIComponent(config.fileName)}`
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-left transition hover:border-dark-400"
                      >
                        <div>
                          <span className="text-sm font-medium text-white">
                            {config.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {config.fileName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {config.pending && (
                            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">
                              Pending
                            </span>
                          )}
                          <span className="text-gray-500">&rarr;</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Waiting for initial sync...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
