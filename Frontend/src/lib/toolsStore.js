import { useEffect, useSyncExternalStore } from "react";
import { api } from "./api";
import { readJSON, writeJSON } from "./storage";
import fallbackTools from "../data/fallbackTools";

const CACHE_KEY = "aitools_cache_v2";
const CACHE_TTL = 10 * 60 * 1000;

// One shared store so every page (home, directory, detail) reuses a single fetch.
// source: "live" (fresh from API) | "cache" (localStorage) | "fallback" (bundled catalog)
let state = { tools: [], status: "idle", error: null, source: null };
let inflight = null;
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function readCache() {
  const cached = readJSON(CACHE_KEY, null);
  return cached && Array.isArray(cached.data) ? cached : null;
}

export function loadTools({ force = false } = {}) {
  if (inflight) return inflight;
  const cached = readCache();

  if (!force && state.source === "live") return Promise.resolve();
  if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL) {
    setState({ tools: cached.data, status: "ready", source: "cache", error: null });
    return Promise.resolve();
  }

  // Show stale data instantly while revalidating in the background.
  if (state.tools.length === 0 && cached) {
    setState({ tools: cached.data, status: "ready", source: "cache" });
  } else if (state.tools.length === 0) {
    setState({ status: "loading", error: null });
  }

  inflight = api
    .listTools()
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Invalid response from server");
      writeJSON(CACHE_KEY, { data, timestamp: Date.now() });
      setState({ tools: data, status: "ready", source: "live", error: null });
    })
    .catch((err) => {
      if (state.tools.length > 0 && state.source !== "fallback") {
        setState({ status: "ready", error: err.message });
      } else {
        // Never show an empty site: fall back to the bundled curated catalog.
        setState({ tools: fallbackTools, status: "ready", source: "fallback", error: err.message });
      }
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
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
  useEffect(() => {
    loadTools();
  }, []);
  return { ...snapshot, reload: () => loadTools({ force: true }) };
}
