import { Link, useLocation } from "react-router-dom";
import { FiX } from "react-icons/fi";
import ToolLogo from "./ToolLogo";
import { useTools } from "../lib/toolsStore";
import { useCompare, resolveKeys, MAX_COMPARE } from "../lib/personal";
import { toolKey } from "../lib/utils";

// Floating bar that appears once tools are picked for comparison, on every page but /compare.
const CompareTray = () => {
  const { pathname } = useLocation();
  const { tools } = useTools();
  const { compareKeys, toggleCompare, clearCompare } = useCompare();
  const selected = resolveKeys(compareKeys, tools);
  // Hidden on pages where it has no job or would cover a form's submit button.
  const hiddenOn = ["/compare", "/submit", "/contact", "/admin"];
  const show = selected.length > 0 && !hiddenOn.includes(pathname);
  if (!show) return null;

  return (
    <>
      {/* Spacer so the page (footer) can scroll clear of the fixed tray. */}
      <div className="h-20" aria-hidden="true" />
      <aside aria-label="Compare tools" className="fixed inset-x-0 bottom-4 z-40 flex animate-slide-up justify-center px-4">
        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-surface p-2 pl-3 shadow-card">
          <span className="hidden text-sm font-medium text-fg sm:block">Compare</span>
          <ul className="flex flex-1 items-center gap-2">
            {selected.map((tool) => (
              <li key={toolKey(tool)} className="relative">
                <ToolLogo tool={tool} size="sm" />
                <button
                  type="button"
                  onClick={() => toggleCompare(tool)}
                  className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-fg text-[10px] text-canvas"
                  aria-label={`Remove ${tool.name} from compare`}
                >
                  <FiX aria-hidden="true" />
                </button>
              </li>
            ))}
            {Array.from({ length: MAX_COMPARE - selected.length }, (_, i) => (
              <li key={i} className="size-9 rounded-lg border border-dashed border-line-strong" aria-hidden="true" />
            ))}
          </ul>
          <button type="button" onClick={clearCompare} className="btn-ghost min-h-9 px-2.5">
            Clear
          </button>
          {selected.length >= 2 ? (
            <Link to={`/compare?tools=${selected.map(toolKey).join(",")}`} className="btn-primary min-h-9 px-3.5">
              Compare {selected.length}
            </Link>
          ) : (
            <span className="pr-2 text-xs text-fg-subtle">Add 1 more</span>
          )}
        </div>
      </aside>
    </>
  );
};

export default CompareTray;
