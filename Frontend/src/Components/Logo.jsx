const Logo = ({ className = "" }) => (
  <span className={`flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#818cf8" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-g)" />
      <path d="M16 6.5l2.3 6.2 6.2 2.3-6.2 2.3-2.3 6.2-2.3-6.2-6.2-2.3 6.2-2.3z" fill="#fff" />
      <circle cx="23.5" cy="8.5" r="1.6" fill="#fff" opacity=".85" />
    </svg>
    <span className="text-lg font-bold tracking-tight text-white">
      AI Tools <span className="text-gradient">Hub</span>
    </span>
  </span>
);

export default Logo;
