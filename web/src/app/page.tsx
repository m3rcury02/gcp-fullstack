"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt?: string | number;
};

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  }

  async function addTask() {
    if (title.trim().length < 2) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error ?? "Failed");
      }
      setTitle("");
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("API:", process.env.NEXT_PUBLIC_API_URL);
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui", padding: 16 }}>
      <h1>Gunal's GCP Cloud Run Full Stack (TS)</h1>
      <p>Next.js + Express API (Cloud Run) + Firestore</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={addTask} disabled={loading} style={{ padding: "10px 14px" }}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <ul style={{ marginTop: 20 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            {t.title}
          </li>
        ))}
      </ul>
    </main>
  );
}