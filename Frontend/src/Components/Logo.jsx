// Wordmark: a 2x2 "directory grid" glyph with one accent cell. Uses currentColor so it follows the theme.
const Logo = ({ className = "" }) => (
  <span className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 32 32" className="size-7 text-fg" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <rect x="8" y="8" width="7" height="7" rx="1.5" className="fill-canvas" />
      <rect x="17" y="8" width="7" height="7" rx="1.5" className="fill-canvas" opacity=".55" />
      <rect x="8" y="17" width="7" height="7" rx="1.5" className="fill-canvas" opacity=".55" />
      <rect x="17" y="17" width="7" height="7" rx="3.5" className="fill-accent" />
    </svg>
    <span className="text-[15px] font-semibold tracking-tight text-fg">AI Tools Hub</span>
  </span>
);

export default Logo;
