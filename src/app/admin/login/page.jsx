"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/admin/events");
    } catch (e) {
      setError(e.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center pt-24 pb-12 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-stone-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center mb-3">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-heading">Admin Login</h1>
          <p className="text-stone-500 text-sm mt-1">Enter the admin password to continue.</p>
        </div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="w-full rounded-md border border-stone-300 px-3 py-2.5 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 px-4 py-3 font-heading text-black inline-flex items-center justify-center gap-2 transition"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
