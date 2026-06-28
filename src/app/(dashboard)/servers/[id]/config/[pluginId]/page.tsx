"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ConfigFile {
  id: string;
  name: string;
  fileName: string;
  content: Record<string, unknown>;
  pending: boolean;
  updatedAt: string;
}

function ConfigValue({
  path,
  value,
  onChange,
}: {
  path: string;
  value: unknown;
  onChange: (path: string, value: unknown) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <button
        onClick={() => onChange(path, !value)}
        className={`rounded-md px-3 py-1 text-sm font-medium transition ${
          value
            ? "bg-success/15 text-success hover:bg-success/25"
            : "bg-danger/15 text-danger hover:bg-danger/25"
        }`}
      >
        {value ? "true" : "false"}
      </button>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        step="any"
        onChange={(e) => onChange(path, Number(e.target.value))}
        className="w-32 rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
      />
    );
  }

  if (typeof value === "string") {
    if (value.length > 80 || value.includes("\n")) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(path, e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3 py-2 font-mono text-sm text-white focus:border-accent focus:outline-none"
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(path, e.target.value)}
        className="w-full max-w-md rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
      />
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-500">[{i}]</span>
            {typeof item === "object" && item !== null ? (
              <div className="flex-1 rounded-lg border border-dark-600 bg-dark-900 p-3">
                <ConfigSection
                  data={item as Record<string, unknown>}
                  parentPath={`${path}.${i}`}
                  onChange={onChange}
                />
              </div>
            ) : (
              <input
                type="text"
                value={String(item)}
                onChange={(e) => {
                  const newArr = [...value];
                  newArr[i] = e.target.value;
                  onChange(path, newArr);
                }}
                className="flex-1 rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
              />
            )}
            <button
              onClick={() => {
                const newArr = value.filter((_, idx) => idx !== i);
                onChange(path, newArr);
              }}
              className="rounded px-2 py-1 text-xs text-danger hover:bg-danger/10"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange(path, [...value, ""])}
          className="rounded-lg border border-dashed border-dark-500 px-3 py-1.5 text-xs text-gray-400 transition hover:border-accent hover:text-accent"
        >
          + Add Item
        </button>
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="rounded-lg border border-dark-600 bg-dark-900 p-4">
        <ConfigSection
          data={value as Record<string, unknown>}
          parentPath={path}
          onChange={onChange}
        />
      </div>
    );
  }

  return <span className="text-sm text-gray-500">null</span>;
}

function ConfigSection({
  data,
  parentPath,
  onChange,
}: {
  data: Record<string, unknown>;
  parentPath: string;
  onChange: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => {
        const fullPath = parentPath ? `${parentPath}.${key}` : key;
        const isNested =
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value);

        return (
          <div key={key}>
            <div
              className={`${
                isNested ? "" : "flex items-center justify-between gap-4"
              }`}
            >
              <label className="mb-1 block text-sm font-medium text-gray-300">
                {key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                <span className="ml-2 font-mono text-xs text-gray-600">
                  {key}
                </span>
              </label>
              <ConfigValue path={fullPath} value={value} onChange={onChange} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ConfigEditorPage({
  params,
}: {
  params: Promise<{ id: string; pluginId: string }>;
}) {
  const { id, pluginId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetFile = searchParams.get("file");

  const [configs, setConfigs] = useState<ConfigFile[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, unknown>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");

  const selectConfig = useCallback((config: ConfigFile) => {
    setSelectedConfig(config);
    setEditedContent(config.content);
    setJsonText(JSON.stringify(config.content, null, 2));
    setJsonError("");
    setSaved(false);
  }, []);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/servers/${id}/plugins/${pluginId}/configs`
      );
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
        const target = targetFile
          ? data.find((c: ConfigFile) => c.fileName === targetFile)
          : data[0];
        if (target) selectConfig(target);
      }
      setLoading(false);
    }
    load();
  }, [id, pluginId, targetFile, selectConfig]);

  function handleChange(path: string, value: unknown) {
    setSaved(false);
    const keys = path.split(".");
    const newContent = structuredClone(editedContent);
    let current: Record<string, unknown> = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (Array.isArray(current[key])) {
        current = (current[key] as unknown[])[
          Number(keys[i + 1])
        ] as Record<string, unknown>;
        keys.splice(i + 1, 1);
      } else {
        current = current[key] as Record<string, unknown>;
      }
    }
    current[keys[keys.length - 1]] = value;
    setEditedContent(newContent);
    setJsonText(JSON.stringify(newContent, null, 2));
  }

  async function handleSave() {
    if (!selectedConfig) return;
    setSaving(true);

    let content = editedContent;
    if (jsonMode) {
      try {
        content = JSON.parse(jsonText);
        setJsonError("");
      } catch {
        setJsonError("Invalid JSON");
        setSaving(false);
        return;
      }
    }

    const res = await fetch(
      `/api/servers/${id}/plugins/${pluginId}/configs/${encodeURIComponent(selectedConfig.fileName)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      setSelectedConfig(updated);
      setEditedContent(updated.content);
      setJsonText(JSON.stringify(updated.content, null, 2));
      setSaved(true);
      setConfigs((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, pending: true } : c))
      );
    }
    setSaving(false);
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
      <button
        onClick={() => router.push(`/servers/${id}`)}
        className="mb-6 text-sm text-gray-400 transition hover:text-white"
      >
        &larr; Back to Server
      </button>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar: Config File List */}
        <div className="w-full lg:w-64">
          <h3 className="mb-3 text-sm font-semibold text-gray-300">
            Config Files
          </h3>
          <div className="space-y-1">
            {configs.map((config) => (
              <button
                key={config.id}
                onClick={() => selectConfig(config)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedConfig?.id === config.id
                    ? "bg-accent/10 text-accent"
                    : "text-gray-400 hover:bg-dark-700 hover:text-white"
                }`}
              >
                <span>{config.name}</span>
                {config.pending && (
                  <span className="h-2 w-2 rounded-full bg-warning" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main: Config Editor */}
        <div className="flex-1">
          {selectedConfig ? (
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {selectedConfig.name}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedConfig.fileName} &middot; Last updated:{" "}
                    {new Date(selectedConfig.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setJsonMode(!jsonMode);
                      if (!jsonMode) {
                        setJsonText(
                          JSON.stringify(editedContent, null, 2)
                        );
                      } else {
                        try {
                          setEditedContent(JSON.parse(jsonText));
                          setJsonError("");
                        } catch {
                          setJsonError("Invalid JSON");
                        }
                      }
                    }}
                    className="rounded-lg border border-dark-500 px-3 py-1.5 text-xs text-gray-400 transition hover:border-accent hover:text-accent"
                  >
                    {jsonMode ? "Visual Editor" : "JSON Editor"}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
                  >
                    {saving ? "Saving..." : saved ? "Saved!" : "Save & Push"}
                  </button>
                </div>
              </div>

              {saved && (
                <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
                  Changes saved. They will be applied when the plugin next
                  syncs.
                </div>
              )}

              {jsonMode ? (
                <div>
                  {jsonError && (
                    <div className="mb-3 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger">
                      {jsonError}
                    </div>
                  )}
                  <textarea
                    value={jsonText}
                    onChange={(e) => {
                      setJsonText(e.target.value);
                      setJsonError("");
                      setSaved(false);
                    }}
                    rows={30}
                    className="w-full rounded-lg border border-dark-500 bg-dark-900 p-4 font-mono text-sm text-white focus:border-accent focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              ) : (
                <ConfigSection
                  data={editedContent}
                  parentPath=""
                  onChange={handleChange}
                />
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              Select a config file to edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
