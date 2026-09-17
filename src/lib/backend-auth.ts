// Server-side auth calls can use a private URL without exposing it in the browser.
export async function backendAuthRequest(path: string, body: unknown) {
  const configuredUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!configuredUrl) throw new Error("Backend authentication URL is not configured");
  const base = new URL(configuredUrl);
  if (!["http:", "https:"].includes(base.protocol)) {
    throw new Error("Backend authentication URL must use HTTP or HTTPS");
  }
  const prefix = base.pathname.replace(/\/+$/, "") || "/api/v1";
  base.pathname = prefix + path;
  base.search = "";
  base.hash = "";
  const response = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => {
    throw new Error(`Backend authentication returned a non-JSON response (${response.status})`);
  });
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || `Backend authentication failed (${response.status})`);
  }
  if (!data.data?.user?._id || !data.data?.accessToken) {
    throw new Error("Backend authentication returned an incomplete session");
  }
  return data;
}
