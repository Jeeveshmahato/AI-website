import { FiRefreshCw, FiWifiOff } from "react-icons/fi";
import { useTools } from "../lib/toolsStore";

// Unobtrusive data-freshness indicator. Content is always usable (cached or bundled
// catalog), so this informs rather than alarms, and disappears once live data arrives.
const SyncStatus = () => {
  const { isLive, syncing, pending, source, reload } = useTools();
  if (isLive) return null;

  if (pending) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400" role="status">
        <FiRefreshCw className={syncing ? "animate-spin" : ""} aria-hidden="true" />
        {syncing ? "Fetching the latest tools…" : "Reconnecting to get the latest tools…"}
      </p>
    );
  }

  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200" role="status">
      <FiWifiOff aria-hidden="true" />
      {source === "cache" ? "Showing recently saved results." : "Showing our offline catalog."}
      <button type="button" onClick={reload} className="font-semibold underline underline-offset-2 hover:text-white">
        Retry
      </button>
    </p>
  );
};

export default SyncStatus;
