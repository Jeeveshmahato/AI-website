import { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiColumns, FiPlus, FiShare2, FiX } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import PriceTag from "../Components/PriceTag";
import { VisitLink } from "../Components/ToolCard";
import { useToast } from "../Components/Toast";
import { useTools } from "../lib/toolsStore";
import { useCompare, resolveKeys, MAX_COMPARE } from "../lib/personal";
import { PRICING_NOTES } from "../lib/constants";
import { formatCount, getDomain, toolKey, toolPath } from "../lib/utils";

const ROWS = [
  { label: "Category", render: (t) => t.category },
  {
    label: "Pricing",
    render: (t) => (
      <div>
        <PriceTag price={t.price} className="text-sm text-fg" />
        <p className="mt-1 text-xs leading-relaxed text-fg-subtle">{PRICING_NOTES[t.price]}</p>
      </div>
    ),
  },
  { label: "Upvotes", render: (t) => <span className="font-mono tabular-nums">{formatCount(t.upvotes)}</span> },
  {
    label: "Good for",
    render: (t) =>
      t.tags?.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {t.tags.map((tag) => (
            <li key={tag} className="rounded-md border border-line px-2 py-0.5 text-xs text-fg-muted">
              {tag}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-fg-subtle">—</span>
      ),
  },
  { label: "Overview", render: (t) => <p className="text-sm leading-relaxed text-fg-muted">{t.description}</p> },
  { label: "Website", render: (t) => <span className="text-fg-muted">{getDomain(t.link)}</span> },
];

const AddToolSlot = ({ tools, exclude, onAdd }) => {
  const options = useMemo(
    () => [...tools].filter((t) => !exclude.has(toolKey(t))).sort((a, b) => a.name.localeCompare(b.name)),
    [tools, exclude]
  );
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong p-5 text-center">
      <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-fg-muted">
        <FiPlus aria-hidden="true" />
      </span>
      <label className="w-full">
        <span className="sr-only">Add a tool to compare</span>
        <select className="input py-2 text-sm" value="" onChange={(e) => e.target.value && onAdd(e.target.value)}>
          <option value="">Add a tool…</option>
          {options.map((t) => (
            <option key={toolKey(t)} value={toolKey(t)}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

const Compare = () => {
  const { tools } = useTools();
  const toast = useToast();
  const { compareKeys, setCompare } = useCompare();
  const [params, setParams] = useSearchParams();
  const hydrated = useRef(false);

  // A shared link (?tools=a,b,c) wins on first load; afterwards the URL mirrors the selection.
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const fromUrl = (params.get("tools") || "").split(",").map((s) => s.trim()).filter(Boolean);
      if (fromUrl.length) {
        setCompare(fromUrl);
        return;
      }
    }
    const next = compareKeys.join(",");
    if ((params.get("tools") || "") !== next) {
      setParams(next ? { tools: next } : {}, { replace: true });
    }
  }, [compareKeys, params, setParams, setCompare]);

  const selected = resolveKeys(compareKeys, tools);
  const keys = new Set(selected.map(toolKey));
  const emptySlots = MAX_COMPARE - selected.length;

  // Rebuild from resolved tools so keys that no longer match anything get pruned.
  const remove = (tool) => setCompare(selected.filter((t) => t !== tool).map(toolKey));
  const add = (key) => setCompare([...selected.map(toolKey), key]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Comparison link copied");
    } catch {
      toast("Couldn't copy the link", "error");
    }
  };

  const title = selected.length ? selected.map((t) => t.name).join(" vs ") : "Compare AI tools";

  return (
    <div className="container-page pt-10">
      <Seo title={title} description={`Side-by-side comparison of pricing, features and community ratings: ${title}.`} />

      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-fg">Compare</h1>
          <p className="mt-1 text-fg-muted">Put up to {MAX_COMPARE} tools side by side.</p>
        </div>
        {selected.length > 1 && (
          <button type="button" onClick={share} className="btn-secondary self-start sm:self-auto">
            <FiShare2 aria-hidden="true" /> Copy link
          </button>
        )}
      </header>

      {selected.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-14 text-center">
          <FiColumns className="text-2xl text-fg-subtle" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-fg">Nothing to compare yet</h2>
          <p className="mt-1 max-w-md text-sm text-fg-muted">
            Tap the compare icon on any tool card, or pick tools below to start.
          </p>
          <div className="mt-6 w-full max-w-xs">
            <AddToolSlot tools={tools} exclude={keys} onAdd={add} />
          </div>
        </div>
      ) : (
        <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[720px] table-fixed border-separate border-spacing-x-3 border-spacing-y-0">
            <caption className="sr-only">Comparison of {title}</caption>
            <colgroup>
              <col className="w-32 sm:w-40" />
              {Array.from({ length: MAX_COMPARE }, (_, i) => (
                <col key={i} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <td />
                {selected.map((tool) => (
                  // h-px lets the card's h-full resolve inside a table cell, so all cards match in height.
                  <th key={toolKey(tool)} scope="col" className="h-px align-top font-normal">
                    <div className="card relative flex h-full flex-col items-start gap-3 p-4 text-left">
                      <button
                        type="button"
                        onClick={() => remove(tool)}
                        className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg"
                        aria-label={`Remove ${tool.name}`}
                      >
                        <FiX aria-hidden="true" />
                      </button>
                      <ToolLogo tool={tool} />
                      <div>
                        <Link to={toolPath(tool)} className="font-semibold text-fg hover:underline">
                          {tool.name}
                        </Link>
                        {tool.tagline && <p className="mt-1 text-sm text-fg-muted">{tool.tagline}</p>}
                      </div>
                      <VisitLink tool={tool} className="btn-primary mt-auto min-h-9 w-full">
                        Visit
                      </VisitLink>
                    </div>
                  </th>
                ))}
                {Array.from({ length: emptySlots }, (_, i) => (
                  <td key={`empty-${i}`} className="align-top">
                    <AddToolSlot tools={tools} exclude={keys} onAdd={add} />
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="sticky left-0 z-10 border-b border-line bg-canvas py-4 pr-2 text-left align-top text-sm font-normal text-fg-subtle">
                    {row.label}
                  </th>
                  {selected.map((tool) => (
                    <td key={toolKey(tool)} className="border-b border-line px-1 py-4 align-top text-sm text-fg">
                      {row.render(tool)}
                    </td>
                  ))}
                  {Array.from({ length: emptySlots }, (_, i) => (
                    <td key={`empty-${i}`} className="border-b border-line" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
