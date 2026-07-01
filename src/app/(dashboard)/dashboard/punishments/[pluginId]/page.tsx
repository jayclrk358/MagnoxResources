"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Punishment {
  id: string;
  playerUuid: string;
  playerName: string;
  type: string;
  reason: string;
  punisherName: string;
  issuedAt: string;
  expiresAt: string | null;
  active: boolean;
  removedBy: string | null;
  removedAt: string | null;
}

type FilterTab = "all" | "bans" | "mutes" | "other";

function typeLabel(type: string) {
  switch (type) {
    case "BAN": return "Ban";
    case "TEMP_BAN": return "Temp Ban";
    case "MUTE": return "Mute";
    case "TEMP_MUTE": return "Temp Mute";
    case "KICK": return "Kick";
    case "WARN": return "Warning";
    default: return type;
  }
}

function typeBadge(type: string) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
  switch (type) {
    case "BAN": return `${base} bg-danger/10 text-danger`;
    case "TEMP_BAN": return `${base} bg-orange-500/10 text-orange-400`;
    case "MUTE": return `${base} bg-warning/10 text-warning`;
    case "TEMP_MUTE": return `${base} bg-yellow-500/10 text-yellow-400`;
    case "KICK": return `${base} bg-blue-500/10 text-blue-400`;
    case "WARN": return `${base} bg-gray-500/10 text-gray-400`;
    default: return `${base} bg-gray-500/10 text-gray-400`;
  }
}

function statusBadge(p: Punishment) {
  if (!p.active) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {p.removedBy ? "Removed" : "Expired"}
      </span>
    );
  }
  if (p.expiresAt && new Date(p.expiresAt) < new Date()) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-danger">
      <span className="h-1.5 w-1.5 rounded-full bg-danger" />
      Active
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatExpiry(p: Punishment) {
  if (!p.expiresAt) return "Permanent";
  const d = new Date(p.expiresAt);
  if (d < new Date()) return `Expired ${formatDate(p.expiresAt)}`;
  return formatDate(p.expiresAt);
}

function matchesTab(p: Punishment, tab: FilterTab) {
  if (tab === "all") return true;
  if (tab === "bans") return p.type === "BAN" || p.type === "TEMP_BAN";
  if (tab === "mutes") return p.type === "MUTE" || p.type === "TEMP_MUTE";
  if (tab === "other") return p.type === "KICK" || p.type === "WARN";
  return true;
}

export default function PunishmentsPage({
  params,
}: {
  params: Promise<{ pluginId: string }>;
}) {
  const { pluginId } = use(params);
  const router = useRouter();
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tab, setTab] = useState<FilterTab>("all");
  const [showInactive, setShowInactive] = useState(false);

  async function fetchPunishments(silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    const res = await fetch(`/api/server/plugins/${pluginId}/punishments`);
    if (res.ok) {
      const data = await res.json();
      setPunishments(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchPunishments();
    const interval = setInterval(() => fetchPunishments(true), 10000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pluginId]);

  const filtered = punishments.filter((p) => {
    if (!showInactive && !p.active) return false;
    return matchesTab(p, tab);
  });

  const activeBans = punishments.filter(
    (p) => p.active && (p.type === "BAN" || p.type === "TEMP_BAN")
  ).length;
  const activeMutes = punishments.filter(
    (p) => p.active && (p.type === "MUTE" || p.type === "TEMP_MUTE")
  ).length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: punishments.filter((p) => showInactive || p.active).length },
    { key: "bans", label: "Bans", count: activeBans },
    { key: "mutes", label: "Mutes", count: activeMutes },
    { key: "other", label: "Kicks & Warns" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">Punishments</h1>
            <p className="text-xs text-gray-500">MagnoxPunish live view</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-600">
              {refreshing ? "Refreshing..." : `Updated ${lastUpdated.toLocaleTimeString()}`}
            </span>
          )}
          <button
            onClick={() => fetchPunishments(true)}
            disabled={refreshing}
            className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Active Bans", value: activeBans, color: activeBans > 0 ? "text-danger" : "text-white" },
          { label: "Active Mutes", value: activeMutes, color: activeMutes > 0 ? "text-warning" : "text-white" },
          { label: "Total Records", value: punishments.length, color: "text-white" },
          {
            label: "Last Sync",
            value: lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--",
            color: "text-gray-400",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-dark-600 bg-dark-800 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-dark-600 bg-dark-800 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  tab === t.key ? "bg-white/20" : "bg-dark-600"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-dark-500 bg-dark-700 text-accent"
          />
          Show expired / removed
        </label>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-dark-600 bg-dark-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl text-gray-600">✓</p>
            <p className="mt-3 text-base font-semibold text-white">
              {punishments.length === 0 ? "No punishment records" : "No matching records"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {punishments.length === 0
                ? "MagnoxPunish hasn't pushed any data yet. It syncs every 60 seconds."
                : "Try changing the filter or enabling 'Show expired / removed'."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-600 text-left">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Player</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Reason</th>
                  <th className="hidden px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">By</th>
                  <th className="hidden px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Issued</th>
                  <th className="hidden px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Expires</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition hover:bg-dark-700/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">{p.playerName}</span>
                      <span className="block truncate font-mono text-[10px] text-gray-600 max-w-[120px]">{p.playerUuid}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={typeBadge(p.type)}>{typeLabel(p.type)}</span>
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      <span className="line-clamp-2 text-gray-300">{p.reason}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-400 sm:table-cell">{p.punisherName}</td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                      {formatDate(p.issuedAt)}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                      {formatExpiry(p)}
                    </td>
                    <td className="px-4 py-3">{statusBadge(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-xs text-gray-600">
          Showing {filtered.length} of {punishments.length} records · Auto-refreshes every 30 seconds
        </p>
      )}
    </div>
  );
}
