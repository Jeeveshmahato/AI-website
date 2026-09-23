import { useCallback, useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./storage";
import { api } from "./api";
import { updateTool } from "./toolsStore";

// Small localStorage-backed id sets (saved tools, upvoted tools) that stay in
// sync across components and browser tabs.
function createIdSet(key) {
  let ids = new Set(readJSON(key, []));
  const listeners = new Set();
  const emit = () => listeners.forEach((l) => l());

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === key) {
        ids = new Set(readJSON(key, []));
        emit();
      }
    });
  }

  return {
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getSnapshot: () => ids,
    toggle(id) {
      ids = new Set(ids);
      if (ids.has(id)) ids.delete(id);
      else ids.add(id);
      writeJSON(key, [...ids]);
      emit();
      return ids.has(id);
    },
  };
}

const saved = createIdSet("saved_tools");
const upvoted = createIdSet("upvoted_tools");

const toolKey = (tool) => tool._id || tool.slug;

export function useSaved() {
  const ids = useSyncExternalStore(saved.subscribe, saved.getSnapshot);
  return {
    savedIds: ids,
    isSaved: useCallback((tool) => ids.has(toolKey(tool)), [ids]),
    toggleSaved: useCallback((tool) => saved.toggle(toolKey(tool)), []),
  };
}

export function useUpvotes() {
  const ids = useSyncExternalStore(upvoted.subscribe, upvoted.getSnapshot);

  const toggleUpvote = useCallback(async (tool) => {
    if (!tool._id) return; // offline catalog entries can't be voted on
    const nowVoted = upvoted.toggle(tool._id);
    const optimistic = Math.max(0, (tool.upvotes || 0) + (nowVoted ? 1 : -1));
    updateTool(tool._id, { upvotes: optimistic });
    try {
      const res = await (nowVoted ? api.upvote(tool._id) : api.unvote(tool._id));
      updateTool(tool._id, { upvotes: res.upvotes });
      return res.upvotes;
    } catch {
      upvoted.toggle(tool._id); // roll back
      updateTool(tool._id, { upvotes: tool.upvotes || 0 });
      return tool.upvotes || 0;
    }
  }, []);

  return {
    hasUpvoted: useCallback((tool) => ids.has(tool._id), [ids]),
    toggleUpvote,
  };
}
