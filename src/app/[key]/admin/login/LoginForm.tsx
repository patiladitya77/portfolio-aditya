"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ adminKey }: { adminKey: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(`/${adminKey}/admin`);
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-neutral-700 text-white placeholder-neutral-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="bg-neutral-700 text-white placeholder-neutral-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
