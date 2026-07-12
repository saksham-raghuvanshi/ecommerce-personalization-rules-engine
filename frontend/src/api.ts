const BASE = "http://localhost:4000/api";

export async function fetchSessions() {
  const res = await fetch(`${BASE}/sessions`);
  if (!res.ok) throw new Error("Failed to load sessions");
  const data = await res.json();
  return data.sessions;
}


export async function classify(session: any): Promise<any> {
  const res = await fetch(`${BASE}/classify`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({session}),
  })
  if (!res.ok) throw new Error("Classification failed");
  return res.json();
}
