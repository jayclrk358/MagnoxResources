"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.trim() }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Invalid token");
    }
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-800 p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">
          Magnox<span className="text-accent">Resources</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Enter your server token to manage plugin configurations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Server Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-lg border border-dark-500 bg-dark-700 px-4 py-2.5 font-mono text-sm text-white placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Paste your token from the plugin config"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Access Panel"}
        </button>
      </form>

      <div className="mt-6 rounded-lg bg-dark-700 p-4 text-xs text-gray-400">
        <p className="font-medium text-gray-300">Where do I find my token?</p>
        <p className="mt-1">
          Your token is automatically generated when your plugin first starts
          with the panel enabled. Find it in:
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            <span className="text-accent">MagnoxLobby:</span>{" "}
            <code className="text-gray-300">plugins/MagnoxLobby/settings.yml</code>{" "}
            &rarr; <code className="text-gray-300">panel.token</code>
          </li>
          <li>
            <span className="text-accent">MagnoxPunish:</span>{" "}
            <code className="text-gray-300">plugins/magnoxpunish/config.toml</code>{" "}
            &rarr; <code className="text-gray-300">[panel] token</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
