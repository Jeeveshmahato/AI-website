import { useEffect, useSyncExternalStore } from "react";
import { api, API_BASE } from "./api";
import { readJSON, writeJSON } from "./storage";
import fallbackTools from "../data/fallbackTools";
import { enrichTools } from "./enrich";

const CACHE_KEY = "aitools_cache_v2";
const RETRY_DELAYS = [5_000, 10_000, 20_000, 30_000, 60_000]; // then every 60s
const MAX_BACKGROUND_ATTEMPTS = 12; // ~10 minutes; focus/online events restart it

/*
 * Shared, stale-while-revalidate tools store.
 *
 * The page always has content immediately: last good API response from localStorage,
 * or the bundled catalog on a first visit. A background sync then swaps in live data,
 * retrying with backoff (free-tier hosts can take ~50s to wake), and again whenever
 * the tab regains focus or the network comes back.
 *
 * source:  "live" | "cache" | "fallback"
 * syncing: a request is in flight
 * error:   last sync error message (cleared on success)
 */
const cached = readJSON(CACHE_KEY, null);
const hasCache = cached && Array.isArray(cached.data) && cached.data.length > 0;

let state = {
  tools: hasCache ? enrichTools(cached.data) : fallbackTools,
  source: hasCache ? "cache" : "fallback",
  syncing: false,
  error: null,
  attempts: 0,
};
let inflight = null;
let retryTimer = null;
let started = false;
let warned = false;
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function scheduleRetry() {
  clearTimeout(retryTimer);
  if (state.attempts >= MAX_BACKGROUND_ATTEMPTS) return;
  const delay = RETRY_DELAYS[Math.min(state.attempts - 1, RETRY_DELAYS.length - 1)];
  retryTimer = setTimeout(() => syncTools(), delay);
}

export function syncTools({ manual = false } = {}) {
  if (inflight) return inflight;
  clearTimeout(retryTimer);
  if (manual) setState({ attempts: 0 });
  setState({ syncing: true });

  inflight = api
    .listTools({ retries: 1 })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Invalid response from server");
      writeJSON(CACHE_KEY, { data, timestamp: Date.now() });
      setState({ tools: enrichTools(data), source: "live", syncing: false, error: null, attempts: 0 });
    })
    .catch((err) => {
      if (!warned) {
        warned = true;
        // The browser reports CORS rejections as generic network errors, so spell out the likely cause.
        console.warn(
          `[api] Could not load tools from ${API_BASE || "(VITE_BASEURL not set)"}: ${err.message}\n` +
            `If ${API_BASE}/health opens fine in a browser tab, the backend's CLIENT_URL probably ` +
            `doesn't include ${window.location.origin} (CORS).`
        );
      }
      setState({ syncing: false, error: err.message, attempts: state.attempts + 1 });
      scheduleRetry();
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function start() {
  if (started) return;
  started = true;
  syncTools();

  const resumeIfStale = () => {
    if (state.source !== "live" && !inflight) {
      setState({ attempts: 0 });
      syncTools();
    }
  };
  window.addEventListener("online", resumeIfStale);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resumeIfStale();
  });
}

export function updateTool(id, patch) {
  setState({ tools: state.tools.map((t) => (t._id === id ? { ...t, ...patch } : t)) });
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export function useTools() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  useEffect(start, []);
  return {
    ...snapshot,
    isLive: snapshot.source === "live",
    // True while we are still hoping to replace non-live data soon.
    pending: snapshot.source !== "live" && (snapshot.syncing || snapshot.attempts < MAX_BACKGROUND_ATTEMPTS),
    reload: () => syncTools({ manual: true }),
  };
}

// Admin changes: refresh without waiting for the next focus event.
export const loadTools = ({ force } = {}) => (force ? syncTools({ manual: true }) : Promise.resolve());
