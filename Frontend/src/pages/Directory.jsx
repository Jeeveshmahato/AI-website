import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiX, FiBookmark, FiGrid, FiList } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolCard, { ToolRow } from "../Components/ToolCard";
import SyncStatus from "../Components/SyncStatus";
import { useTools } from "../lib/toolsStore";
import { useSaved } from "../lib/personal";
import { filterTools } from "../lib/filters";
import { readJSON, writeJSON } from "../lib/storage";
import { CATEGORIES, PRICING, PRICING_DOT, SORT_OPTIONS } from "../lib/constants";
import { cn, toolKey } from "../lib/utils";

const PAGE_SIZE = 24;

const FilterLink = ({ active, onClick, children, count }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm transition-colors",
      active ? "bg-surface-2 font-medium text-fg" : "text-fg-muted hover:bg-surface-2/60 hover:text-fg"
    )}
  >
    {children}
    {count !== undefined && <span className="ml-auto font-mono text-xs tabular-nums text-fg-subtle">{count}</span>}
  </button>
);

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
      active ? "border-fg bg-fg text-canvas" : "border-line bg-surface text-fg-muted hover:text-fg"
    )}
  >
    {children}
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
  const [view, setView] = useState(() => (readJSON("directory_view", "grid") === "list" ? "list" : "grid"));

  const changeView = (next) => {
    setView(next);
    writeJSON("directory_view", next);
  };

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

  // Facet counts: each facet is counted with the *other* active filters applied.
  const categoryCounts = useMemo(() => {
    const counts = {};
    filterTools(base, { q, price }).forEach((t) => (counts[t.category] = (counts[t.category] || 0) + 1));
    return counts;
  }, [base, q, price]);
  const priceCounts = useMemo(() => {
    const counts = {};
    filterTools(base, { q, category }).forEach((t) => (counts[t.price] = (counts[t.price] || 0) + 1));
    return counts;
  }, [base, q, category]);
  const categoryTotal = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const priceTotal = Object.values(priceCounts).reduce((a, b) => a + b, 0);

  const hasFilters = Boolean(q) || category !== "All" || price !== "All";

  const clearAll = () => {
    setQuery("");
    setParams(sort !== "featured" ? { sort } : {}, { replace: true });
  };

  const title = savedOnly ? "Saved tools" : category !== "All" ? `${category} tools` : "All AI tools";

  return (
    <div className="container-page pt-10">
      <Seo
        title={savedOnly ? "Saved tools" : category !== "All" ? `Best ${category} AI tools` : "Explore all AI tools"}
        description={
          savedOnly
            ? "Your saved AI tools."
            : `Browse and compare ${category !== "All" ? category.toLowerCase() + " " : ""}AI tools by pricing and popularity.`
        }
        noindex={savedOnly}
      />

      <header className="flex flex-col gap-1 border-b border-line pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">{title}</h1>
        <p className="text-fg-muted">
          {savedOnly
            ? "Your shortlist, stored privately in this browser."
            : "Search by task, then narrow down by category and pricing."}
        </p>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Desktop facets */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-20 space-y-6">
            <div>
              <h2 className="px-2 text-xs font-medium text-fg-subtle">Category</h2>
              <div className="mt-2 space-y-0.5">
                <FilterLink active={category === "All"} onClick={() => setParam("category", "All", "All")} count={categoryTotal}>
                  All categories
                </FilterLink>
                {CATEGORIES.map((c) => (
                  <FilterLink
                    key={c.name}
                    active={category === c.name}
                    count={categoryCounts[c.name] || 0}
                    onClick={() => setParam("category", category === c.name ? "All" : c.name, "All")}
                  >
                    <c.icon className="shrink-0 text-fg-subtle" aria-hidden="true" />
                    {c.short}
                  </FilterLink>
                ))}
              </div>
            </div>
            <div>
              <h2 className="px-2 text-xs font-medium text-fg-subtle">Pricing</h2>
              <div className="mt-2 space-y-0.5">
                <FilterLink active={price === "All"} onClick={() => setParam("price", "All", "All")} count={priceTotal}>
                  Any price
                </FilterLink>
                {PRICING.map((p) => (
                  <FilterLink key={p} active={price === p} count={priceCounts[p] || 0} onClick={() => setParam("price", price === p ? "All" : p, "All")}>
                    <span className={cn("size-1.5 rounded-full", PRICING_DOT[p])} aria-hidden="true" />
                    {p}
                  </FilterLink>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {/* Search + sort + view */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" aria-hidden="true" />
              <label htmlFor="tool-search" className="sr-only">
                Search tools
              </label>
              <input
                ref={searchRef}
                id="tool-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, task or feature"
                className="input h-10 py-0 pl-10 pr-10"
              />
              <kbd className="kbd pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</kbd>
            </div>
            <div className="flex gap-2">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select id="sort" value={sort} onChange={(e) => setParam("sort", e.target.value, "featured")} className="input h-10 flex-1 py-0 sm:w-44">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="flex rounded-lg border border-line bg-surface-2 p-0.5" role="group" aria-label="View">
                {[
                  { key: "grid", icon: FiGrid, label: "Grid view" },
                  { key: "list", icon: FiList, label: "List view" },
                ].map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => changeView(v.key)}
                    aria-pressed={view === v.key}
                    aria-label={v.label}
                    title={v.label}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md transition-colors",
                      view === v.key ? "bg-surface text-fg shadow-[0_1px_2px_rgb(0_0_0/0.06)]" : "text-fg-subtle hover:text-fg"
                    )}
                  >
                    <v.icon aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile facets */}
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:hidden">
            {PRICING.map((p) => (
              <Chip key={p} active={price === p} onClick={() => setParam("price", price === p ? "All" : p, "All")}>
                {p}
              </Chip>
            ))}
            <span className="mx-1 w-px shrink-0 bg-line" aria-hidden="true" />
            {CATEGORIES.filter((c) => categoryCounts[c.name] || c.name === category).map((c) => (
              <Chip key={c.name} active={category === c.name} onClick={() => setParam("category", category === c.name ? "All" : c.name, "All")}>
                {c.short}
              </Chip>
            ))}
          </div>

          <div className="mt-4 flex min-h-8 flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-fg-muted" aria-live="polite">
                <span className="font-medium text-fg">{results.length}</span> {results.length === 1 ? "result" : "results"}
                {q && (
                  <>
                    {" "}
                    for <span className="text-fg">“{q}”</span>
                  </>
                )}
              </p>
              <SyncStatus />
            </div>
            {hasFilters && (
              <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg">
                <FiX aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>

          {results.length > 0 &&
            (view === "grid" ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, visible).map((tool) => (
                  <ToolCard key={toolKey(tool)} tool={tool} />
                ))}
              </div>
            ) : (
              <ul className="mt-2 -mx-2 divide-y divide-line sm:-mx-3">
                {results.slice(0, visible).map((tool) => (
                  <li key={toolKey(tool)}>
                    <ToolRow tool={tool} />
                  </li>
                ))}
              </ul>
            ))}

          {results.length === 0 && (
            <div className="mt-3 flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
              {savedOnly && base.length === 0 ? (
                <>
                  <FiBookmark className="text-2xl text-fg-subtle" aria-hidden="true" />
                  <h2 className="mt-3 font-semibold text-fg">No saved tools yet</h2>
                  <p className="mt-1 max-w-sm text-sm text-fg-muted">Use the bookmark on any tool to build a shortlist you can come back to.</p>
                  <Link to="/aitools" className="btn-primary mt-5">
                    Browse tools
                  </Link>
                </>
              ) : (
                <>
                  <FiSearch className="text-2xl text-fg-subtle" aria-hidden="true" />
                  <h2 className="mt-3 font-semibold text-fg">No tools match</h2>
                  <p className="mt-1 max-w-sm text-sm text-fg-muted">Try a broader search, or suggest the tool you had in mind.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
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
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-secondary">
                Show more <span className="text-fg-subtle">({results.length - visible})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;
