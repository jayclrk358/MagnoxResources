"use client";

import { useEffect, useState } from "react";
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
  online: boolean;
  players: number;
  maxPlayers: number;
  tps: number | null;
  lastSeen: string | null;
  plugins: Plugin[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/server")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setServer(data);
        setLoading(false);
      });
  }, []);

  function pluginLabel(type: string) {
    switch (type) {
      case "AURO_LOBBY":
        return "AuroLobby";
      case "AURO_PUNISH":
        return "AuroPunish";
      default:
        return type;
    }
  }

  function pluginDescription(type: string) {
    switch (type) {
      case "AURO_LOBBY":
        return "Lobby management, cosmetics, server selector, and more";
      case "AURO_PUNISH":
        return "Punishment system with bans, mutes, kicks, and warnings";
      default:
        return "";
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
      <div className="py-20 text-center text-gray-400">
        Server not found. Your token may be invalid.
      </div>
    );
  }

  return (
    <div>
      {/* Server Info */}
      <div className="mb-8 rounded-xl border border-dark-600 bg-dark-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{server.name}</h1>
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
          </div>
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
            {server.lastSeen && (
              <div>
                <span className="text-gray-400">Last seen: </span>
                <span className="text-white">
                  {new Date(server.lastSeen).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plugins */}
      <h2 className="mb-4 text-lg font-semibold text-white">Plugins</h2>
      {server.plugins.length === 0 ? (
        <div className="rounded-xl border border-dark-600 bg-dark-800 py-12 text-center">
          <h3 className="text-base font-semibold text-white">
            No plugins connected yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Enable the panel in your plugin config, restart the server, and
            the plugin will automatically register itself here.
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
                  Last synced: {new Date(plugin.lastSync).toLocaleString()}
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
                          `/dashboard/config/${plugin.id}?file=${encodeURIComponent(config.fileName)}`
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
  );
}
