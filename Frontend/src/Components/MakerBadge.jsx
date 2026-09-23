import { useState } from "react";
import { FiAward, FiCopy } from "react-icons/fi";
import { useToast } from "./Toast";
import { cn, toolKey } from "../lib/utils";

// Embeddable "Listed on AI Tools Hub" badge for tool makers. Each embed links back to the
// tool's page here (referral traffic + backlinks). Width/height are set to avoid layout shift.
const MakerBadge = ({ tool }) => {
  const toast = useToast();
  const [variant, setVariant] = useState("light");
  const origin = window.location.origin;
  const src = `${origin}/${variant === "dark" ? "badge-dark.svg" : "badge.svg"}`;
  const snippet = `<a href="${origin}/tools/${toolKey(tool)}" target="_blank" rel="noopener"><img src="${src}" alt="${tool.name} is listed on AI Tools Hub" width="200" height="44" /></a>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast("Badge code copied");
    } catch {
      toast("Couldn't copy the code", "error");
    }
  };

  return (
    <details className="group card overflow-hidden [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm text-fg-muted hover:text-fg">
        <FiAward aria-hidden="true" /> Made {tool.name}? Get a badge
      </summary>
      <div className="border-t border-line p-4">
        <div className="flex gap-1 rounded-lg border border-line bg-surface-2 p-0.5" role="group" aria-label="Badge style">
          {["light", "dark"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              aria-pressed={variant === v}
              className={cn(
                "h-7 flex-1 rounded-md text-xs capitalize transition-colors",
                variant === v ? "bg-surface font-medium text-fg shadow-[0_1px_2px_rgb(0_0_0/0.06)]" : "text-fg-muted hover:text-fg"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <div className={cn("mt-3 flex justify-center rounded-lg border border-line p-4", variant === "dark" ? "bg-[#0b0b0a]" : "bg-white")}>
          <img src={variant === "dark" ? "/badge-dark.svg" : "/badge.svg"} alt="Badge preview" width="200" height="44" />
        </div>
        <label htmlFor="badge-code" className="sr-only">
          Badge embed code
        </label>
        <textarea
          id="badge-code"
          readOnly
          rows={4}
          value={snippet}
          onFocus={(e) => e.target.select()}
          className="input mt-3 resize-none font-mono text-[11px] leading-relaxed"
        />
        <button type="button" onClick={copy} className="btn-secondary mt-2 min-h-9 w-full">
          <FiCopy aria-hidden="true" /> Copy code
        </button>
      </div>
    </details>
  );
};

export default MakerBadge;
