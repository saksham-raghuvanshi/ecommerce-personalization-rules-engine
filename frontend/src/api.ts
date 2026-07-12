const BASE = "http://localhost:4000/api";

export async function fetchSessions() {
  const res = await fetch(`${BASE}/sessions`);
  if (!res.ok) throw new Error("Failed to load sessions");
  const data = await res.json();
  return data.sessions;
}
