let nextID = 1;

/** Makes a JSON-RPC call using fetch(). Returns a successful result or throws. */
export async function req(
  host: string,
  method: string,
  params?: unknown[]
): Promise<any> {
  if (!params) params = [];
  const id = nextID++;
  const req = { jsonrpc: "2.0", id, method, params };
  const res = await fetch(host, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(1000),
  });
  if (!res.ok) {
    throw new Error(`${method} failed: ${res.status} ${res.statusText}`);
  }
  const obj = await res.json();
  if (obj.jsonrpc !== "2.0" || obj.id !== id) throw new Error("bad RPC resp");
  if (obj.error) throw new Error(JSON.stringify(obj.error));
  return obj.result;
}

export async function fetchWithTimeout(url: string) {
  return fetch(url, {
    signal: AbortSignal.timeout(1000),
  });
}
