import { useTools } from "../lib/toolsStore";

// Unobtrusive data-freshness indicator. Content is always usable (cached or bundled
// catalog), so this informs rather than alarms, and disappears once live data arrives.
const SyncStatus = () => {
  const { isLive, pending, source, reload } = useTools();
  if (isLive) return null;

  if (pending) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-fg-subtle" role="status">
        <span className="relative flex size-1.5" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-fg-subtle opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-fg-subtle" />
        </span>
        Syncing latest data
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs text-fg-subtle" role="status">
      <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
      {source === "cache" ? "Showing saved results" : "Showing offline catalog"}
      <button type="button" onClick={reload} className="link text-xs">
        Retry
      </button>
    </span>
  );
};

export default SyncStatus;
