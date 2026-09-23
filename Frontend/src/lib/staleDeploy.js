// Recovery from a stale index.html after a deploy (see the matching inline script in
// index.html, which handles the entry files before the app can run).
const PARAM = "_v";
const KEY = "asset_reload_at";

// Reload once with a cache-busting param so the CDN serves the current index.html.
// Returns false (and does nothing) if we already tried in the last 30s, to avoid loops.
export function reloadFresh() {
  try {
    if (Date.now() - (Number(sessionStorage.getItem(KEY)) || 0) < 30_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false;
  }
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, Date.now().toString(36));
  window.location.replace(url.toString());
  return true;
}

// Remove the cache-busting param after a successful load so URLs stay clean and shareable.
export function stripReloadParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(PARAM)) return;
  url.searchParams.delete(PARAM);
  window.history.replaceState(window.history.state, "", url);
}

export const isChunkLoadError = (error) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
    error?.message || ""
  );
