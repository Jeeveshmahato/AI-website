import { useSyncExternalStore } from "react";

// "light" | "dark" | "system". The initial class is applied by the inline script in
// index.html before first paint (no flash); this module keeps it in sync afterwards.
const KEY = "theme";
const media = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
const listeners = new Set();

function read() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

let preference = typeof window !== "undefined" ? read() : "system";

function apply() {
  const dark = preference === "dark" || (preference === "system" && media?.matches);
  document.documentElement.classList.toggle("dark", Boolean(dark));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b0b0a" : "#ffffff");
}

media?.addEventListener("change", () => {
  if (preference === "system") {
    apply();
    listeners.forEach((l) => l());
  }
});

export function setTheme(next) {
  preference = next;
  try {
    if (next === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {
    // ignore
  }
  apply();
  listeners.forEach((l) => l());
}

export function useTheme() {
  const pref = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => preference
  );
  const resolved = pref === "system" ? (media?.matches ? "dark" : "light") : pref;
  return { preference: pref, resolved, setTheme };
}
