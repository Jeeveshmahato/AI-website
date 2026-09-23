import { PRICING_DOT } from "../lib/constants";
import { cn } from "../lib/utils";

const PriceTag = ({ price, className }) => (
  <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted", className)}>
    <span className={cn("size-1.5 rounded-full", PRICING_DOT[price] || "bg-fg-subtle")} aria-hidden="true" />
    {price}
  </span>
);

export default PriceTag;
