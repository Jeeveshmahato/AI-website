// Brand mark: a 2x2 "directory grid" on a solid tile. Fixed colours (identical in
// light and dark themes, no gradients). Keep in sync with public/favicon.svg.
const BRAND = "#C2410C";

const Logo = ({ className = "" }) => (
  <span className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={BRAND} />
      <rect x="8" y="8" width="7" height="7" rx="1.5" fill="#FFFFFF" />
      <rect x="17" y="8" width="7" height="7" rx="1.5" fill="#FDD5BF" />
      <rect x="8" y="17" width="7" height="7" rx="1.5" fill="#FDD5BF" />
      <rect x="17" y="17" width="7" height="7" rx="3.5" fill="#FFFFFF" />
    </svg>
    <span className="text-[15px] font-semibold tracking-tight text-fg">AI Tools Hub</span>
  </span>
);

export default Logo;
