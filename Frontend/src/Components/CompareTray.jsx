import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiColumns, FiX } from "react-icons/fi";
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
  const show = selected.length > 0 && pathname !== "/compare" && !pathname.startsWith("/admin");

  return (
    <>
      {/* Spacer so the page (footer) can scroll clear of the fixed tray. */}
      {show && <div className="h-24" aria-hidden="true" />}
      <AnimatePresence>
      {show && (
        <motion.aside
          aria-label="Compare tools"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
          className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
        >
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <ul className="flex flex-1 items-center gap-2">
              {selected.map((tool) => (
                <li key={toolKey(tool)} className="relative">
                  <ToolLogo tool={tool} size="sm" />
                  <button
                    type="button"
                    onClick={() => toggleCompare(tool)}
                    className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-ink-600 text-xs text-white ring-2 ring-ink-800 hover:bg-rose-500"
                    aria-label={`Remove ${tool.name} from compare`}
                  >
                    <FiX aria-hidden="true" />
                  </button>
                </li>
              ))}
              {Array.from({ length: MAX_COMPARE - selected.length }, (_, i) => (
                <li key={i} className="size-10 rounded-xl border border-dashed border-white/15" aria-hidden="true" />
              ))}
            </ul>
            <button type="button" onClick={clearCompare} className="btn-ghost hidden min-h-10 px-3 sm:inline-flex">
              Clear
            </button>
            {selected.length >= 2 ? (
              <Link to={`/compare?tools=${selected.map(toolKey).join(",")}`} className="btn-primary min-h-10 px-4">
                <FiColumns aria-hidden="true" /> Compare {selected.length}
              </Link>
            ) : (
              <span className="px-2 text-sm text-slate-400">Pick 1 more to compare</span>
            )}
          </div>
        </motion.aside>
      )}
      </AnimatePresence>
    </>
  );
};

export default CompareTray;
