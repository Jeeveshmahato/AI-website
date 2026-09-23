import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ToolLogo from "./ToolLogo";
import { resolveKeys } from "../lib/personal";
import { cn, toolKey } from "../lib/utils";

const CollectionCard = ({ collection, tools }) => {
  const items = resolveKeys(collection.tools, tools);
  return (
    <Link
      to={`/stacks/${collection.slug}`}
      className="group card flex h-full flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-white/15"
    >
      <span className={cn("flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white shadow-lg", collection.color)}>
        <collection.icon aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-white">{collection.title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-400">{collection.tagline}</p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center -space-x-2">
          {items.slice(0, 4).map((t) => (
            <ToolLogo key={toolKey(t)} tool={t} size="sm" className="size-8 rounded-lg ring-2 ring-ink-850" />
          ))}
          {items.length > 4 && (
            <span className="flex size-8 items-center justify-center rounded-lg bg-ink-700 text-xs font-semibold text-slate-300 ring-2 ring-ink-850">
              +{items.length - 4}
            </span>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm text-slate-500 group-hover:text-indigo-300">
          {items.length} tools <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
