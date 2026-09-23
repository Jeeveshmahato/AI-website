import { useCallback, useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./storage";
import { api } from "./api";
import { updateTool } from "./toolsStore";
import { toolKey } from "./utils";

export const MAX_COMPARE = 3;
const MAX_RECENT = 8;

// A small localStorage-backed ordered list of keys that stays in sync across
// components and browser tabs.
function createList(storageKey) {
  let items = readJSON(storageKey, []);
  if (!Array.isArray(items)) items = [];
  const listeners = new Set();
  const emit = () => listeners.forEach((l) => l());

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === storageKey) {
        items = readJSON(storageKey, []);
        emit();
      }
    });
  }

  return {
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    get: () => items,
    set(next) {
      items = next;
      writeJSON(storageKey, next);
      emit();
    },
  };
}

const saved = createList("saved_tools");
const upvoted = createList("upvoted_tools");
const compare = createList("compare_tools");
const recent = createList("recent_tools");

// Earlier versions stored _id; accept either so nobody loses saved tools.
const matches = (list, tool) => list.includes(toolKey(tool)) || (tool._id && list.includes(tool._id));
const without = (list, tool) => list.filter((k) => k !== toolKey(tool) && k !== tool._id);

const useList = (list) => useSyncExternalStore(list.subscribe, list.get);

export function useSaved() {
  const items = useList(saved);
  const isSaved = useCallback((tool) => matches(items, tool), [items]);
  const toggleSaved = useCallback((tool) => {
    const current = saved.get();
    if (matches(current, tool)) {
      saved.set(without(current, tool));
      return false;
    }
    saved.set([toolKey(tool), ...current]);
    return true;
  }, []);
  return { savedCount: items.length, isSaved, toggleSaved };
}

export function useCompare() {
  const items = useList(compare);
  const inCompare = useCallback((tool) => matches(items, tool), [items]);
  /** @returns "added" | "removed" | "full" */
  const toggleCompare = useCallback((tool) => {
    const current = compare.get();
    if (matches(current, tool)) {
      compare.set(without(current, tool));
      return "removed";
    }
    if (current.length >= MAX_COMPARE) return "full";
    compare.set([...current, toolKey(tool)]);
    return "added";
  }, []);
  const clearCompare = useCallback(() => compare.set([]), []);
  const setCompare = useCallback((keys) => {
    const next = [...new Set(keys.filter(Boolean))].slice(0, MAX_COMPARE);
    const current = compare.get();
    if (next.length !== current.length || next.some((k, i) => k !== current[i])) compare.set(next);
  }, []);
  return { compareKeys: items, inCompare, toggleCompare, clearCompare, setCompare };
}

export function useRecent() {
  return useList(recent);
}

export function recordView(tool) {
  const key = toolKey(tool);
  const current = recent.get();
  if (current[0] === key) return;
  recent.set([key, ...current.filter((k) => k !== key)].slice(0, MAX_RECENT));
}

export function useUpvotes() {
  const items = useList(upvoted);

  const toggleUpvote = useCallback(async (tool) => {
    if (!tool._id) return; // offline catalog entries can't be voted on
    const current = upvoted.get();
    const nowVoted = !current.includes(tool._id);
    upvoted.set(nowVoted ? [...current, tool._id] : current.filter((k) => k !== tool._id));
    const before = tool.upvotes || 0;
    updateTool(tool._id, { upvotes: Math.max(0, before + (nowVoted ? 1 : -1)) });
    try {
      const res = await (nowVoted ? api.upvote(tool._id) : api.unvote(tool._id));
      updateTool(tool._id, { upvotes: res.upvotes });
    } catch {
      // Roll back the optimistic update.
      upvoted.set(current);
      updateTool(tool._id, { upvotes: before });
    }
  }, []);

  return {
    hasUpvoted: useCallback((tool) => Boolean(tool._id) && items.includes(tool._id), [items]),
    toggleUpvote,
  };
}

// Resolves stored keys to tool objects in the given order, skipping unknown keys.
export function resolveKeys(keys, tools) {
  const index = new Map();
  tools.forEach((t) => {
    index.set(toolKey(t), t);
    if (t._id) index.set(t._id, t);
  });
  return keys.map((k) => index.get(k)).filter(Boolean);
}
