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

type FieldType = "text" | "number" | "boolean" | "object" | "list";

function defaultValueForType(type: FieldType): unknown {
  switch (type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object":
      return {};
    case "list":
      return [];
    default:
      return "";
  }
}

function CollapsibleGroup({
  title,
  actions,
  defaultOpen = true,
  children,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-dark-600 bg-dark-900">
      <div className="flex items-center justify-between gap-2 p-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-center gap-2 text-left min-w-0"
        >
          <svg
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="truncate text-sm font-medium text-gray-300">{title}</span>
        </button>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {open && <div className="space-y-3 border-t border-dark-600 p-3">{children}</div>}
    </div>
  );
}

function ConfigValue({
  path,
  value,
  onChange,
  onRemove,
}: {
  path: string;
  value: unknown;
  onChange: (path: string, value: unknown) => void;
  onRemove: (path: string) => void;
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
      <div className="w-full space-y-2">
        {value.map((item, i) => {
          const isObjectItem = typeof item === "object" && item !== null;
          if (isObjectItem) {
            return (
              <CollapsibleGroup
                key={i}
                title={`[${i}]`}
                actions={
                  <button
                    onClick={() => {
                      const newArr = value.filter((_, idx) => idx !== i);
                      onChange(path, newArr);
                    }}
                    className="rounded px-2 py-1 text-xs text-gray-500 transition hover:bg-danger/10 hover:text-danger"
                  >
                    Remove
                  </button>
                }
              >
                <ConfigSection
                  data={item as Record<string, unknown>}
                  parentPath={`${path}.${i}`}
                  onChange={onChange}
                  onRemove={onRemove}
                />
              </CollapsibleGroup>
            );
          }
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-500">[{i}]</span>
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
          );
        })}
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
      <ConfigSection
        data={value as Record<string, unknown>}
        parentPath={path}
        onChange={onChange}
        onRemove={onRemove}
      />
    );
  }

  return <span className="text-sm text-gray-500">null</span>;
}

function AddFieldForm({
  existingKeys,
  onAdd,
}: {
  existingKeys: string[];
  onAdd: (key: string, type: FieldType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newType, setNewType] = useState<FieldType>("text");
  const [error, setError] = useState("");

  function handleAdd() {
    const key = newKey.trim();
    if (!key) {
      setError("Enter a field name");
      return;
    }
    if (key.includes(".")) {
      setError("Field name can't contain a dot");
      return;
    }
    if (existingKeys.includes(key)) {
      setError("A field with that name already exists");
      return;
    }
    onAdd(key, newType);
    setNewKey("");
    setNewType("text");
    setError("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-dark-500 px-3 py-1.5 text-xs text-gray-400 transition hover:border-accent hover:text-accent"
      >
        + Add Field
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-dark-500 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={newKey}
          onChange={(e) => {
            setNewKey(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Field name (e.g. my-gadget)"
          className="min-w-[160px] flex-1 rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
          autoFocus
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as FieldType)}
          className="rounded-lg border border-dark-500 bg-dark-700 px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="boolean">True / False</option>
          <option value="object">Group (nested fields)</option>
          <option value="list">List</option>
        </select>
        <button
          onClick={handleAdd}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-hover"
        >
          Add
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setNewKey("");
            setError("");
          }}
          className="rounded-lg border border-dark-500 px-3 py-1.5 text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function ConfigSection({
  data,
  parentPath,
  onChange,
  onRemove,
}: {
  data: Record<string, unknown>;
  parentPath: string;
  onChange: (path: string, value: unknown) => void;
  onRemove: (path: string) => void;
}) {
  const entries = Object.entries(data);

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => {
        const fullPath = parentPath ? `${parentPath}.${key}` : key;
        const isNested =
          typeof value === "object" && value !== null && !Array.isArray(value);
        const prettyKey = key
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        if (isNested) {
          return (
            <CollapsibleGroup
              key={key}
              title={
                <span>
                  {prettyKey}
                  <span className="ml-2 font-mono text-xs text-gray-600">
                    {key}
                  </span>
                </span>
              }
              actions={
                <button
                  onClick={() => onRemove(fullPath)}
                  className="rounded px-2 py-1 text-xs text-gray-500 transition hover:bg-danger/10 hover:text-danger"
                >
                  Remove
                </button>
              }
            >
              <ConfigValue
                path={fullPath}
                value={value}
                onChange={onChange}
                onRemove={onRemove}
              />
            </CollapsibleGroup>
          );
        }

        return (
          <div
            key={key}
            className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <label className="mb-1 block text-sm font-medium text-gray-300">
              {prettyKey}
              <span className="ml-2 font-mono text-xs text-gray-600">
                {key}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <ConfigValue
                path={fullPath}
                value={value}
                onChange={onChange}
                onRemove={onRemove}
              />
              <button
                onClick={() => onRemove(fullPath)}
                className="shrink-0 rounded px-2 py-1 text-xs text-gray-600 transition hover:bg-danger/10 hover:text-danger"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}

      <AddFieldForm
        existingKeys={entries.map(([key]) => key)}
        onAdd={(key, type) => {
          const fullPath = parentPath ? `${parentPath}.${key}` : key;
          onChange(fullPath, defaultValueForType(type));
        }}
      />
    </div>
  );
}

function navigateToParent(
  newContent: Record<string, unknown>,
  path: string
): { parent: Record<string, unknown>; lastKey: string } {
  const keys = path.split(".");
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
  return { parent: current, lastKey: keys[keys.length - 1] };
}

export default function ConfigEditorPage({
  params,
}: {
  params: Promise<{ pluginId: string }>;
}) {
  const { pluginId } = use(params);
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
      const res = await fetch(`/api/server/plugins/${pluginId}/configs`);
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
  }, [pluginId, targetFile, selectConfig]);

  function handleChange(path: string, value: unknown) {
    setSaved(false);
    const newContent = structuredClone(editedContent);
    const { parent, lastKey } = navigateToParent(newContent, path);
    parent[lastKey] = value;
    setEditedContent(newContent);
    setJsonText(JSON.stringify(newContent, null, 2));
  }

  function handleRemoveField(path: string) {
    setSaved(false);
    const newContent = structuredClone(editedContent);
    const { parent, lastKey } = navigateToParent(newContent, path);
    delete parent[lastKey];
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
      `/api/server/plugins/${pluginId}/configs/${encodeURIComponent(selectedConfig.fileName)}`,
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
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-sm text-gray-400 transition hover:text-white"
      >
        &larr; Back to Dashboard
      </button>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
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

        {/* Editor */}
        <div className="flex-1">
          {selectedConfig ? (
            <div className="rounded-xl border border-dark-600 bg-dark-800 p-4 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-white">
                    {selectedConfig.name}
                  </h2>
                  <p className="mt-1 break-all text-xs text-gray-500">
                    {selectedConfig.fileName} &middot; Last updated:{" "}
                    {new Date(selectedConfig.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setJsonMode(!jsonMode);
                      if (!jsonMode) {
                        setJsonText(JSON.stringify(editedContent, null, 2));
                      } else {
                        try {
                          setEditedContent(JSON.parse(jsonText));
                          setJsonError("");
                        } catch {
                          setJsonError("Invalid JSON");
                        }
                      }
                    }}
                    className="flex-1 rounded-lg border border-dark-500 px-3 py-1.5 text-xs text-gray-400 transition hover:border-accent hover:text-accent sm:flex-initial"
                  >
                    {jsonMode ? "Visual Editor" : "JSON Editor"}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50 sm:flex-initial"
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
                  onRemove={handleRemoveField}
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
