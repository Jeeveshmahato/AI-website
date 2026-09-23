import { useState } from "react";
import { faviconUrl, safeUrl, cn } from "../lib/utils";

const SIZES = {
  xs: "size-7 rounded-md text-xs",
  sm: "size-9 rounded-lg text-sm",
  md: "size-11 rounded-lg text-base",
  lg: "size-16 rounded-xl text-2xl",
};

// Fixed padding per size (percentage padding would resolve against the parent's width).
const PADDING = { xs: "p-1", sm: "p-1.5", md: "p-2", lg: "p-2.5" };

// Tries the submitted logo, then the site's favicon, then a neutral monogram.
// Logos sit on white in both themes, since most brand marks are designed for light backgrounds.
const ToolLogo = ({ tool, size = "md", className }) => {
  const sources = [tool.image && safeUrl(tool.image) !== "#" ? tool.image : null, faviconUrl(tool.link)].filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = sources[index];

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center border border-line bg-surface-2 font-semibold text-fg-muted",
          SIZES[size],
          className
        )}
      >
        {(tool.name || "?").charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden border border-line bg-white", SIZES[size], PADDING[size], className)}>
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="size-full object-contain"
        onError={() => setIndex((i) => i + 1)}
      />
    </div>
  );
};

export default ToolLogo;
