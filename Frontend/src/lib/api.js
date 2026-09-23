const configured = import.meta.env.VITE_BASEURL || (import.meta.env.DEV ? "http://localhost:5000" : "");
export const API_BASE = configured.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  // Maps express-validator details to { field: message } for inline form errors.
  get fieldErrors() {
    if (!Array.isArray(this.details)) return {};
    return Object.fromEntries(
      this.details.filter((d) => d && d.field).map((d) => [d.field, d.message])
    );
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * fetch wrapper with timeout, JSON handling and retries.
 * Retries (GET only by default) cover free-tier hosts that cold-start in ~30s.
 */
export async function request(path, { method = "GET", body, headers, signal, timeout = 15000, retries } = {}) {
  if (!API_BASE) throw new ApiError("API URL is not configured (set VITE_BASEURL).");
  const attempts = (retries ?? (method === "GET" ? 2 : 0)) + 1;

  for (let attempt = 1; ; attempt++) {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
          Accept: "application/json",
          ...(body !== undefined && { "Content-Type": "application/json" }),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const err = new ApiError(data?.error || `Request failed (${res.status})`, {
          status: res.status,
          details: data?.details,
        });
        if (res.status >= 500 && attempt < attempts) throw err;
        err.final = true;
        throw err;
      }
      return data;
    } catch (err) {
      if (signal?.aborted) throw err;
      if (err.final || attempt >= attempts) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(
          err.name === "AbortError" ? "The server took too long to respond." : "Network error: could not reach the server."
        );
      }
      await sleep(1500 * attempt);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  }
}

export const api = {
  listTools: (opts) => request("/api/aitools", { timeout: 20000, ...opts }),
  getTool: (slug, opts) => request(`/api/aitools/${encodeURIComponent(slug)}`, opts),
  upvote: (id) => request(`/api/aitools/${id}/upvote`, { method: "POST" }),
  unvote: (id) => request(`/api/aitools/${id}/upvote`, { method: "DELETE" }),
  submitTool: (tool) => request("/api/submissions", { method: "POST", body: tool, timeout: 30000, retries: 1 }),
  contact: (msg) => request("/api/contact", { method: "POST", body: msg, timeout: 30000, retries: 1 }),
  subscribe: (email) => request("/api/newsletter", { method: "POST", body: { email }, timeout: 30000, retries: 1 }),

  // Fire-and-forget; keepalive lets it finish while the browser opens the tool's site.
  trackVisit: (id) => {
    if (!API_BASE || !id) return;
    fetch(`${API_BASE}/api/aitools/${id}/visit`, { method: "POST", keepalive: true }).catch(() => {});
  },

  admin: (key) => {
    const auth = { headers: { "X-API-Key": key }, retries: 0 };
    return {
      summary: () => request("/api/admin/summary", auth),
      tools: (status) => request(`/api/admin/tools?status=${status}`, auth),
      messages: () => request("/api/admin/messages", auth),
      markRead: (id) => request(`/api/admin/messages/${id}/read`, { ...auth, method: "PATCH" }),
      updateTool: (id, patch) => request(`/api/aitools/${id}`, { ...auth, method: "PATCH", body: patch }),
      deleteTool: (id) => request(`/api/aitools/${id}`, { ...auth, method: "DELETE" }),
    };
  },
};
