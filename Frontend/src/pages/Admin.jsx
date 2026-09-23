import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCheck, FiX, FiStar, FiTrash2, FiLogOut, FiExternalLink, FiMail, FiRefreshCw } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import { useToast } from "../Components/Toast";
import { api } from "../lib/api";
import { loadTools } from "../lib/toolsStore";
import { cn, formatDate, getDomain, safeUrl } from "../lib/utils";

const KEY_STORAGE = "admin_api_key";

// The key is typed in by the admin and kept in sessionStorage (cleared when the tab closes).
// It is never bundled into the frontend build.
const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Live" },
  { key: "rejected", label: "Rejected" },
  { key: "messages", label: "Messages" },
];

const Login = ({ onLogin }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.admin(value.trim()).summary();
      onLogin(value.trim());
    } catch (err) {
      setError(err.status === 401 || err.status === 403 ? "Invalid API key." : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card mx-auto mt-16 max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Admin</h1>
      <p className="text-sm text-fg-muted">Enter the backend API_KEY to moderate submissions.</p>
      <label htmlFor="admin-key" className="sr-only">
        API key
      </label>
      <input
        id="admin-key"
        type="password"
        autoComplete="current-password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("input", error && "input-error")}
        placeholder="API key"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={busy || !value.trim()}>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
};

const Admin = () => {
  const [key, setKey] = useState(readKey);
  const [tab, setTab] = useState("pending");
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const client = useMemo(() => api.admin(key), [key]);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      // ignore
    }
    setKey("");
  }, []);

  const refresh = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    try {
      const [s, list] = await Promise.all([
        client.summary(),
        tab === "messages" ? client.messages() : client.tools(tab),
      ]);
      setSummary(s);
      setItems(list);
    } catch (err) {
      if (err.status === 401 || err.status === 403) logout();
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [client, key, tab, toast, logout]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = (k) => {
    try {
      sessionStorage.setItem(KEY_STORAGE, k);
    } catch {
      // ignore
    }
    setKey(k);
  };

  const act = async (fn, message) => {
    try {
      await fn();
      toast(message);
      await refresh();
      loadTools({ force: true }); // keep the public directory in sync
    } catch (err) {
      toast(err.message, "error");
    }
  };

  if (!key) {
    return (
      <div className="container-page">
        <Seo title="Admin" noindex />
        <Login onLogin={login} />
      </div>
    );
  }

  const counts = summary && {
    pending: summary.pending,
    approved: summary.approved,
    rejected: summary.rejected,
    messages: summary.unreadMessages,
  };

  return (
    <div className="container-page pt-10">
      <Seo title="Admin" noindex />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Moderation</h1>
        <div className="flex gap-2">
          <button type="button" onClick={refresh} className="btn-secondary" disabled={loading}>
            <FiRefreshCw className={cn(loading && "animate-spin")} aria-hidden="true" /> Refresh
          </button>
          <button type="button" onClick={logout} className="btn-ghost">
            <FiLogOut aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>

      {summary && (
        <p className="mt-2 text-sm text-fg-muted">
          {summary.subscribers} newsletter subscribers · {summary.messages} messages total
        </p>
      )}

      <div role="tablist" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "min-h-10 shrink-0 rounded-lg px-4 text-sm font-medium",
              tab === t.key ? "bg-surface-2 text-fg" : "text-fg-muted hover:text-fg"
            )}
          >
            {t.label}
            {counts && counts[t.key] > 0 && (
              <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3" role="tabpanel">
        {!loading && items.length === 0 && <p className="card p-8 text-center text-fg-muted">Nothing here.</p>}

        {tab === "messages"
          ? items.map((m) => (
              <article key={m._id} className={cn("card p-5", !m.read && "border-accent/40")}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-fg">{m.subject || "(no subject)"}</h2>
                    <p className="text-sm text-fg-muted">
                      {m.name} ·{" "}
                      <a href={`mailto:${m.email}`} className="text-accent hover:underline">
                        {m.email}
                      </a>{" "}
                      · {formatDate(m.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message"))}`} className="btn-secondary min-h-9">
                      <FiMail aria-hidden="true" /> Reply
                    </a>
                    {!m.read && (
                      <button type="button" className="btn-ghost min-h-9" onClick={() => act(() => client.markRead(m._id), "Marked as read")}>
                        <FiCheck aria-hidden="true" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-fg-muted">{m.message}</p>
              </article>
            ))
          : items.map((t) => (
              <article key={t._id} className="card flex flex-col gap-4 p-5 md:flex-row md:items-start">
                <ToolLogo tool={t} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-fg">{t.name}</h2>
                    {t.featured && <FiStar className="fill-amber-300 text-warning" aria-label="Featured" />}
                    <span className="text-sm text-fg-subtle">
                      {t.category} · {t.price} · {formatDate(t.createdAt)}
                    </span>
                  </div>
                  <a href={safeUrl(t.link)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                    {getDomain(t.link)} <FiExternalLink aria-hidden="true" />
                  </a>
                  {t.tagline && <p className="mt-2 text-sm text-fg">{t.tagline}</p>}
                  <p className="mt-1 line-clamp-3 text-sm text-fg-muted">{t.description}</p>
                  {t.submitterEmail && <p className="mt-2 text-xs text-fg-subtle">Submitted by {t.submitterEmail}</p>}
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {t.status !== "approved" && (
                    <button type="button" className="btn-primary min-h-9" onClick={() => act(() => client.updateTool(t._id, { status: "approved" }), `${t.name} approved`)}>
                      <FiCheck aria-hidden="true" /> Approve
                    </button>
                  )}
                  {t.status !== "rejected" && (
                    <button type="button" className="btn-secondary min-h-9" onClick={() => act(() => client.updateTool(t._id, { status: "rejected" }), `${t.name} rejected`)}>
                      <FiX aria-hidden="true" /> Reject
                    </button>
                  )}
                  {tab === "approved" && (
                    <button type="button" className="btn-secondary min-h-9" onClick={() => act(() => client.updateTool(t._id, { featured: !t.featured }), t.featured ? "Unfeatured" : "Featured")}>
                      <FiStar aria-hidden="true" /> {t.featured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-ghost min-h-9 text-danger hover:text-danger"
                    onClick={() => window.confirm(`Delete ${t.name} permanently?`) && act(() => client.deleteTool(t._id), `${t.name} deleted`)}
                  >
                    <FiTrash2 aria-hidden="true" /> Delete
                  </button>
                </div>
              </article>
            ))}
      </div>
    </div>
  );
};

export default Admin;
