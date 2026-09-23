import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ToolLogo from "./ToolLogo";
import { resolveKeys } from "../lib/personal";
import { toolKey } from "../lib/utils";

const CollectionCard = ({ collection, tools, compact = false }) => {
  const items = resolveKeys(collection.tools, tools);
  if (compact) {
    return (
      <Link to={`/stacks/${collection.slug}`} className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-fg-muted">
          <collection.icon aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-fg">{collection.title}</span>
          <span className="block truncate text-xs text-fg-subtle">{items.length} tools</span>
        </span>
        <FiArrowRight className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link
      to={`/stacks/${collection.slug}`}
      className="group card flex h-full flex-col p-5 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-card"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-fg-muted">
          <collection.icon aria-hidden="true" />
        </span>
        <span className="font-mono text-xs text-fg-subtle">{items.length} tools</span>
      </div>
      <h3 className="mt-4 font-semibold text-fg">{collection.title}</h3>
      <p className="mt-1 flex-1 text-sm text-fg-muted">{collection.tagline}</p>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center -space-x-1.5">
          {items.slice(0, 5).map((t) => (
            <ToolLogo key={toolKey(t)} tool={t} size="xs" className="ring-2 ring-surface" />
          ))}
          {items.length > 5 && (
            <span className="flex size-7 items-center justify-center rounded-md border border-line bg-surface-2 font-mono text-[10px] text-fg-muted ring-2 ring-surface">
              +{items.length - 5}
            </span>
          )}
        </div>
        <FiArrowRight className="text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden="true" />
      </div>
    </Link>
  );
};

export default CollectionCard;
