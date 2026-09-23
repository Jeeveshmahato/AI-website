import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiClock, FiLayers, FiCornerDownLeft, FiColumns, FiPlus, FiBookmark, FiGrid } from "react-icons/fi";
import ToolLogo from "./ToolLogo";
import { useTools } from "../lib/toolsStore";
import { useRecent, resolveKeys } from "../lib/personal";
import { filterTools } from "../lib/filters";
import { CATEGORIES } from "../lib/constants";
import collections from "../data/collections";
import { cn, toolKey, toolPath } from "../lib/utils";

const PaletteContext = createContext(() => {});
export const useCommandPalette = () => useContext(PaletteContext);

const PAGES = [
  { label: "Explore all tools", to: "/aitools", icon: FiGrid },
  { label: "Compare tools", to: "/compare", icon: FiColumns },
  { label: "Saved tools", to: "/saved", icon: FiBookmark },
  { label: "Submit a tool", to: "/submit", icon: FiPlus },
];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

const Palette = ({ dialogRef, onClose }) => {
  const { tools } = useTools();
  const recentKeys = useRecent();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  const items = useMemo(() => {
    const q = query.trim();
    if (!q) {
      const recent = resolveKeys(recentKeys, tools).slice(0, 5);
      return [
        ...recent.map((t) => ({ group: "Recently viewed", id: `r-${toolKey(t)}`, label: t.name, hint: t.category, to: toolPath(t), tool: t })),
        ...PAGES.map((p) => ({ group: "Quick links", id: p.to, label: p.label, to: p.to, icon: p.icon })),
        ...collections.slice(0, 4).map((c) => ({ group: "Stacks", id: `s-${c.slug}`, label: c.title, hint: c.tagline, to: `/stacks/${c.slug}`, icon: c.icon })),
      ];
    }
    const lower = q.toLowerCase();
    const toolHits = filterTools(tools, { q }).slice(0, 7);
    const catHits = CATEGORIES.filter((c) => c.name.toLowerCase().includes(lower)).slice(0, 3);
    const stackHits = collections.filter((c) => `${c.title} ${c.tagline}`.toLowerCase().includes(lower)).slice(0, 3);
    return [
      ...toolHits.map((t) => ({ group: "Tools", id: `t-${toolKey(t)}`, label: t.name, hint: t.tagline || t.category, to: toolPath(t), tool: t })),
      ...catHits.map((c) => ({ group: "Categories", id: `c-${c.name}`, label: c.name, hint: c.blurb, to: `/aitools?category=${encodeURIComponent(c.name)}`, icon: c.icon })),
      ...stackHits.map((c) => ({ group: "Stacks", id: `s-${c.slug}`, label: c.title, hint: c.tagline, to: `/stacks/${c.slug}`, icon: c.icon })),
      { group: "Search", id: "search-all", label: `Search all tools for “${q}”`, to: `/aitools?q=${encodeURIComponent(q)}`, icon: FiSearch },
    ];
  }, [query, tools, recentKeys]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item) => {
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter" && items[active]) {
      e.preventDefault();
      go(items[active]);
    }
  };

  let lastGroup = null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-label="Search AI Tools Hub"
      className="m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-0 text-slate-200 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
        <FiSearch className="shrink-0 text-lg text-slate-500" aria-hidden="true" />
        <input
          autoFocus
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={items[active] ? `palette-${active}` : undefined}
          aria-label="Search tools, categories and stacks"
          placeholder="Search tools, categories, stacks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-14 min-w-0 flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] text-slate-500">Esc</kbd>
      </div>

      <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
        {items.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-500">No results</li>}
        {items.map((item, index) => {
          const header = item.group !== lastGroup ? item.group : null;
          lastGroup = item.group;
          return (
            <li key={item.id} role="presentation">
              {header && <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{header}</p>}
              <div
                id={`palette-${index}`}
                data-index={index}
                role="option"
                aria-selected={index === active}
                onMouseMove={() => setActive(index)}
                onClick={() => go(item)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                  index === active ? "bg-white/[0.07] text-white" : "text-slate-300"
                )}
              >
                {item.tool ? (
                  <ToolLogo tool={item.tool} size="sm" className="size-8 rounded-lg" />
                ) : (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400">
                    {item.icon ? <item.icon aria-hidden="true" /> : item.group === "Recently viewed" ? <FiClock /> : <FiLayers />}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.label}</span>
                  {item.hint && <span className="block truncate text-xs text-slate-500">{item.hint}</span>}
                </span>
                {index === active ? (
                  <FiCornerDownLeft className="shrink-0 text-slate-500" aria-hidden="true" />
                ) : (
                  <FiArrowRight className="shrink-0 text-slate-600" aria-hidden="true" />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden items-center gap-4 border-t border-white/[0.07] px-4 py-2.5 text-xs text-slate-500 sm:flex">
        <span>
          <kbd className="font-sans">↑↓</kbd> to navigate
        </span>
        <span>
          <kbd className="font-sans">↵</kbd> to open
        </span>
        <span className="ml-auto">{shortcutLabel} to toggle</span>
      </div>
    </dialog>
  );
};

export const CommandPaletteProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  const openPalette = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // showModal() gives us the top layer, focus containment, Esc handling and inert background.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PaletteContext.Provider value={openPalette}>
      {children}
      {/* Mounted only while open so each opening starts with a fresh query. */}
      {open && <Palette dialogRef={dialogRef} onClose={close} />}
    </PaletteContext.Provider>
  );
};
