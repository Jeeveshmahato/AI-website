import { memo } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBookmark, FiColumns, FiStar } from "react-icons/fi";
import ToolLogo from "./ToolLogo";
import PriceTag from "./PriceTag";
import { api } from "../lib/api";
import { useCompare, useSaved, useUpvotes, MAX_COMPARE } from "../lib/personal";
import { useToast } from "./Toast";
import { cn, formatCount, safeUrl, toolPath } from "../lib/utils";

const Triangle = ({ className }) => (
  <svg viewBox="0 0 10 8" className={cn("size-2.5", className)} aria-hidden="true">
    <path d="M5 0l5 8H0z" fill="currentColor" />
  </svg>
);

// Product Hunt-style vote box: the count is the primary social signal on a directory.
// size: "md" (stacked box), "sm" (small stacked box) or "inline" (horizontal pill for card footers)
export const UpvoteButton = ({ tool, className, size = "md" }) => {
  const { hasUpvoted, toggleUpvote } = useUpvotes();
  const voted = hasUpvoted(tool);
  const disabled = !tool._id;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleUpvote(tool);
      }}
      disabled={disabled}
      aria-pressed={voted}
      aria-label={`${voted ? "Remove upvote from" : "Upvote"} ${tool.name} (${tool.upvotes || 0} upvotes)`}
      title={disabled ? "Voting is available once connected" : voted ? "Remove upvote" : "Upvote"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-medium tabular-nums transition-colors disabled:cursor-default",
        size === "inline" ? "h-8 gap-1.5 px-2.5" : "flex-col gap-1",
        size === "md" && "h-12 w-11",
        size === "sm" && "h-10 w-10",
        voted
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface text-fg-muted enabled:hover:border-fg-subtle enabled:hover:text-fg",
        className
      )}
    >
      <Triangle />
      {formatCount(tool.upvotes)}
    </button>
  );
};

export const SaveButton = ({ tool, className, withLabel = false, compact = false }) => {
  const { isSaved, toggleSaved } = useSaved();
  const toast = useToast();
  const saved = isSaved(tool);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const nowSaved = toggleSaved(tool);
        toast(nowSaved ? `Saved ${tool.name}` : `Removed ${tool.name} from saved`);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${tool.name} from saved` : `Save ${tool.name}`}
      title={saved ? "Saved" : "Save"}
      className={cn(withLabel ? "btn-secondary" : compact ? "icon-btn size-8" : "icon-btn size-9", saved && "text-accent hover:text-accent", className)}
    >
      <FiBookmark className={cn(saved && "fill-current")} aria-hidden="true" />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
};

export const CompareButton = ({ tool, className, withLabel = false, compact = false }) => {
  const { inCompare, toggleCompare } = useCompare();
  const toast = useToast();
  const active = inCompare(tool);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const result = toggleCompare(tool);
        if (result === "full") toast(`You can compare up to ${MAX_COMPARE} tools at once`, "error");
        else if (withLabel) toast(result === "added" ? `Added ${tool.name} to compare` : `Removed ${tool.name} from compare`);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${tool.name} from compare` : `Add ${tool.name} to compare`}
      title={active ? "In compare" : "Compare"}
      className={cn(withLabel ? "btn-secondary" : compact ? "icon-btn size-8" : "icon-btn size-9", active && "border-accent text-accent hover:text-accent", className)}
    >
      <FiColumns aria-hidden="true" />
      {withLabel && (active ? "Comparing" : "Compare")}
    </button>
  );
};

export const VisitLink = ({ tool, className, children, icon = true }) => (
  <a
    href={safeUrl(tool.link)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => {
      e.stopPropagation();
      api.trackVisit(tool._id);
    }}
    className={className}
    aria-label={children ? undefined : `Visit ${tool.name} website (opens in a new tab)`}
    title={children ? undefined : "Visit website"}
  >
    {children}
    {icon && <FiArrowUpRight aria-hidden="true" />}
  </a>
);

const Title = ({ tool }) => (
  <span className="flex min-w-0 items-center gap-1.5">
    {/* Stretched link: the whole card/row opens the detail page */}
    <Link to={toolPath(tool)} className="truncate font-semibold text-fg after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
      {tool.name}
    </Link>
    {tool.featured && <FiStar className="size-3.5 shrink-0 fill-accent text-accent" aria-label="Featured" />}
  </span>
);

const ToolCard = ({ tool }) => (
  <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-150 focus-within:border-line-strong hover:border-line-strong hover:shadow-card">
    <div className="flex items-start gap-3">
      <ToolLogo tool={tool} />
      <div className="min-w-0 flex-1 pt-0.5">
        <Title tool={tool} />
        <p className="mt-0.5 truncate text-[13px] text-fg-subtle">{tool.category}</p>
      </div>
    </div>
    <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-fg-muted">{tool.tagline || tool.description}</p>
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
      <PriceTag price={tool.price} />
      <div className="relative z-10 flex items-center gap-1.5">
        <SaveButton tool={tool} compact />
        <CompareButton tool={tool} compact />
        <VisitLink tool={tool} className="icon-btn size-8" />
        <UpvoteButton tool={tool} size="inline" />
      </div>
    </div>
  </article>
);

// Dense list row for ranked lists and the directory's list view.
export const ToolRow = memo(function ToolRow({ tool, rank }) {
  return (
    <article className="group relative flex items-center gap-3 rounded-xl px-2 py-3 transition-colors focus-within:bg-surface-2 hover:bg-surface-2 sm:gap-4 sm:px-3">
      {rank !== undefined && (
        <span className="hidden w-5 shrink-0 text-right font-mono text-xs tabular-nums text-fg-subtle sm:block">{rank}</span>
      )}
      <ToolLogo tool={tool} />
      <div className="min-w-0 flex-1">
        <Title tool={tool} />
        <p className="mt-0.5 truncate text-sm text-fg-muted">{tool.tagline || tool.description}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-fg-subtle">
          <PriceTag price={tool.price} className="text-fg-subtle" />
          <span className="truncate">{tool.category}</span>
        </div>
      </div>
      <div className="relative z-10 hidden items-center gap-1.5 opacity-100 transition-opacity sm:flex [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
        <SaveButton tool={tool} compact />
        <CompareButton tool={tool} compact />
        <VisitLink tool={tool} className="icon-btn size-8" />
      </div>
      <UpvoteButton tool={tool} className="relative z-10" />
    </article>
  );
});

export default memo(ToolCard);
