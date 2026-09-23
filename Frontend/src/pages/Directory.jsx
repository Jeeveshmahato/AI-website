import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiX, FiBookmark } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolCard from "../Components/ToolCard";
import SyncStatus from "../Components/SyncStatus";
import { useTools } from "../lib/toolsStore";
import { useSaved } from "../lib/personal";
import { filterTools } from "../lib/filters";
import { CATEGORIES, PRICING, SORT_OPTIONS } from "../lib/constants";
import { cn, toolKey } from "../lib/utils";

const PAGE_SIZE = 24;

const Chip = ({ active, onClick, children, count }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
      active
        ? "border-indigo-400/50 bg-indigo-500/15 text-white"
        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
    )}
  >
    {children}
    {count !== undefined && <span className={cn("text-xs", active ? "text-indigo-200" : "text-slate-500")}>{count}</span>}
  </button>
);

const Directory = ({ savedOnly = false }) => {
  const { tools } = useTools();
  const { isSaved } = useSaved();
  const [params, setParams] = useSearchParams();
  const searchRef = useRef(null);

  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const price = params.get("price") || "All";
  const sort = params.get("sort") || "featured";

  const [query, setQuery] = useState(q);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const setParam = (key, value, defaultValue) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
    setVisible(PAGE_SIZE);
  };

  // Keep the input in sync when the URL changes (back/forward, footer links).
  // Compare trimmed so a pause after typing a space doesn't eat the space.
  useEffect(() => setQuery((current) => (current.trim() === q ? current : q)), [q]);

  // Debounce typing into the URL.
  useEffect(() => {
    if (query.trim() === q) return;
    const id = setTimeout(() => setParam("q", query.trim(), ""), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // "/" focuses the page search (Ctrl/Cmd+K opens the global command palette).
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
      if (e.key === "/" && !typing && !e.defaultPrevented) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const base = useMemo(() => (savedOnly ? tools.filter(isSaved) : tools), [tools, savedOnly, isSaved]);

  const results = useMemo(() => filterTools(base, { q, category, price, sort }), [base, q, category, price, sort]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    filterTools(base, { q, price }).forEach((t) => (counts[t.category] = (counts[t.category] || 0) + 1));
    return counts;
  }, [base, q, price]);

  const activeFilters = [q && "q", category !== "All" && "category", price !== "All" && "price"].filter(Boolean);

  const clearAll = () => {
    setQuery("");
    setParams({}, { replace: true });
  };

  const title = savedOnly ? "Saved tools" : category !== "All" ? `Best ${category} AI tools` : "Explore AI tools";

  return (
    <div className="container-page pt-10 sm:pt-14">
      <Seo
        title={savedOnly ? "Saved tools" : category !== "All" ? `${category} AI tools` : "Explore all AI tools"}
        description={
          savedOnly
            ? "Your saved AI tools."
            : `Browse and compare ${category !== "All" ? category.toLowerCase() + " " : ""}AI tools by pricing and popularity.`
        }
        noindex={savedOnly}
      />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 text-slate-400">
          {savedOnly
            ? "Tools you've bookmarked. Saved privately in this browser."
            : "Search by what you want to get done, then narrow down by category and pricing."}
        </p>
      </header>

      {/* Toolbar */}
      {/* Sticky from sm up only: on phones a sticky toolbar would cover a third of the screen. */}
      <div className="z-30 -mx-4 mt-8 border-b sm:sticky sm:top-16 border-white/[0.07] bg-ink-950/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <input
              ref={searchRef}
              id="tool-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, task or feature…"
              className="input py-2.5 pl-11 pr-12"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 px-2 py-0.5 text-xs text-slate-500 sm:block">
              /
            </kbd>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex rounded-xl border border-white/10 bg-ink-900 p-1" role="group" aria-label="Pricing">
              {["All", ...PRICING].map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={price === p}
                  onClick={() => setParam("price", p, "All")}
                  className={cn(
                    "min-h-9 flex-1 rounded-lg px-3 text-sm font-medium transition-colors sm:flex-none",
                    price === p ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value, "featured")}
              className="input py-2 pr-8 sm:w-auto"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={category === "All"} onClick={() => setParam("category", "All", "All")}>
            All
          </Chip>
          {CATEGORIES.filter((c) => categoryCounts[c.name] || c.name === category).map((c) => (
            <Chip
              key={c.name}
              active={category === c.name}
              count={categoryCounts[c.name] || 0}
              onClick={() => setParam("category", category === c.name ? "All" : c.name, "All")}
            >
              <c.icon aria-hidden="true" />
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* Result summary */}
      <div className="mt-6 flex min-h-8 flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-400" aria-live="polite">
            {`${results.length} ${results.length === 1 ? "tool" : "tools"}`}
            {q && (
              <>
                {" "}
                for <span className="text-white">“{q}”</span>
              </>
            )}
          </p>
          <SyncStatus />
        </div>
        {activeFilters.length > 0 && (
          <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-sm text-indigo-300 hover:text-indigo-200">
            <FiX aria-hidden="true" /> Clear filters
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.slice(0, visible).map((tool) => (
          <ToolCard key={toolKey(tool)} tool={tool} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="card mx-auto mt-4 flex max-w-lg flex-col items-center px-6 py-14 text-center">
          {savedOnly && base.length === 0 ? (
            <>
              <FiBookmark className="text-4xl text-slate-600" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-white">No saved tools yet</h2>
              <p className="mt-2 text-slate-400">Tap the bookmark on any tool to keep it here for later.</p>
              <Link to="/aitools" className="btn-primary mt-6">
                Browse tools
              </Link>
            </>
          ) : (
            <>
              <FiSearch className="text-4xl text-slate-600" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-white">No tools match your filters</h2>
              <p className="mt-2 text-slate-400">Try a broader search, or suggest the tool you had in mind.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearAll} className="btn-secondary">
                  Clear filters
                </button>
                <Link to="/submit" className="btn-primary">
                  Suggest a tool
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {results.length > visible && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-secondary">
            Show more ({results.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default Directory;
