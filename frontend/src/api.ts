import type { Session, ClassificationResult, Explanation } from "./types";

const BASE = "http://localhost:4000/api";

export async function fetchSessions(): Promise<Session[]> {
  const res = await fetch(`${BASE}/sessions`);
  if (!res.ok) throw new Error("Failed to load sessions");
  const data = await res.json();
  return data.sessions;
}

export async function classify(session: Session): Promise<ClassificationResult> {
  const res = await fetch(`${BASE}/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });
  if (!res.ok) throw new Error("Classification failed");
  return res.json();
}

export async function explain(result: ClassificationResult): Promise<Explanation> {
  const { state, confidence, features, evidence } = result;
  const res = await fetch(`${BASE}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, confidence, features, evidence }),
  });
  if (!res.ok) throw new Error("Explanation failed");
  return res.json();
}