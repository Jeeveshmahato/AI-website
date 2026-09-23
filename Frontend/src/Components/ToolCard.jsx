import { memo } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBookmark, FiChevronUp, FiStar } from "react-icons/fi";
import ToolLogo from "./ToolLogo";
import { PRICING_STYLES } from "../lib/constants";
import { api } from "../lib/api";
import { useSaved, useUpvotes } from "../lib/personal";
import { useToast } from "./Toast";
import { cn, formatCount, isNew, safeUrl, toolPath } from "../lib/utils";

export const UpvoteButton = ({ tool, className }) => {
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
      aria-label={`${voted ? "Remove upvote from" : "Upvote"} ${tool.name}`}
      title={disabled ? "Voting is unavailable offline" : voted ? "Remove upvote" : "Upvote"}
      className={cn(
        "flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl border px-2 text-xs font-semibold transition-colors disabled:opacity-50",
        voted
          ? "border-indigo-400/50 bg-indigo-500/15 text-indigo-200"
          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-indigo-400/40 hover:text-white",
        className
      )}
    >
      <FiChevronUp className="text-base" aria-hidden="true" />
      {formatCount(tool.upvotes)}
    </button>
  );
};

export const SaveButton = ({ tool, className, withLabel = false }) => {
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
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border transition-colors",
        saved
          ? "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300"
          : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white",
        withLabel && "px-4 text-sm font-semibold",
        className
      )}
    >
      <FiBookmark className={cn(saved && "fill-current")} aria-hidden="true" />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
};

export const VisitLink = ({ tool, className, children = "Visit" }) => (
  <a
    href={safeUrl(tool.link)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => {
      e.stopPropagation();
      api.trackVisit(tool._id);
    }}
    className={className}
  >
    {children}
    <FiArrowUpRight aria-hidden="true" />
  </a>
);

const ToolCard = ({ tool }) => {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-ink-850/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-ink-800/80 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="flex items-start gap-4">
        <ToolLogo tool={tool} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            {/* Stretched link: the whole card opens the detail page */}
            <Link to={toolPath(tool)} className="truncate after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {tool.name}
            </Link>
            {tool.featured && <FiStar className="shrink-0 fill-amber-300 text-amber-300" aria-label="Featured" />}
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate-400">{tool.category}</p>
        </div>
        <UpvoteButton tool={tool} className="relative z-10" />
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-300">
        {tool.tagline || tool.description}
      </p>

      <div className="mt-5 flex items-center gap-2">
        <span className={cn("badge", PRICING_STYLES[tool.price] || "bg-slate-500/10 text-slate-300 ring-slate-500/30")}>
          {tool.price}
        </span>
        {isNew(tool) && <span className="badge bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/30">New</span>}
        <div className="relative z-10 ml-auto flex items-center gap-2">
          <SaveButton tool={tool} className="min-h-9 min-w-9 rounded-lg" />
          <VisitLink
            tool={tool}
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-slate-200 transition-colors hover:border-indigo-400/40 hover:text-white"
          />
        </div>
      </div>
    </article>
  );
};

export const ToolCardSkeleton = () => (
  <div className="rounded-2xl border border-white/[0.07] bg-ink-850/70 p-5" aria-hidden="true">
    <div className="flex items-start gap-4">
      <div className="skeleton size-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
    <div className="mt-5 space-y-2">
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-4/5" />
    </div>
    <div className="skeleton mt-6 h-6 w-20 rounded-full" />
  </div>
);

export default memo(ToolCard);
