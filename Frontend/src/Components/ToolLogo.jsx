import { useState } from "react";
import { faviconUrl, safeUrl, cn } from "../lib/utils";
import { getCategory } from "../lib/constants";

const SIZES = {
  sm: "size-10 rounded-xl text-base",
  md: "size-12 rounded-xl text-lg",
  lg: "size-20 rounded-2xl text-3xl",
};

// Tries the submitted logo, then the site's favicon, then a lettered gradient tile.
const ToolLogo = ({ tool, size = "md", className }) => {
  const sources = [tool.image && safeUrl(tool.image) !== "#" ? tool.image : null, faviconUrl(tool.link)].filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = sources[index];

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center bg-gradient-to-br font-bold text-white",
          getCategory(tool.category).color,
          SIZES[size],
          className
        )}
      >
        {(tool.name || "?").charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden bg-white p-1.5 shadow-inner", SIZES[size], className)}>
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
