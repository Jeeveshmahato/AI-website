import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { cn } from "../lib/utils";
import { useSaved, resolveKeys } from "../lib/personal";
import { useTools } from "../lib/toolsStore";
import { useCommandPalette, shortcutLabel } from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const NAV_ITEMS = [
  { label: "Explore", path: "/aitools" },
  { label: "Finder", path: "/finder" },
  { label: "Categories", path: "/categories" },
  { label: "Stacks", path: "/stacks" },
  { label: "Compare", path: "/compare" },
  { label: "Saved", path: "/saved" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const openPalette = useCommandPalette();
  const { savedKeys } = useSaved();
  const { tools } = useTools();
  // Count only saved tools that can actually be shown (a saved tool may have been removed).
  const savedCount = useMemo(() => resolveKeys(savedKeys, tools).length, [savedKeys, tools]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const label = (item) => (
    <>
      {item.label}
      {item.path === "/saved" && savedCount > 0 && (
        <span className="font-mono text-[11px] tabular-nums text-fg-subtle" aria-label={`${savedCount} saved`}>
          {savedCount}
        </span>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/75">
      <nav className="container-page flex h-14 items-center gap-6" aria-label="Main">
        <Link to="/" className="shrink-0 rounded-md" aria-label="AI Tools Hub home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors",
                    isActive ? "bg-surface-2 font-medium text-fg" : "text-fg-muted hover:text-fg"
                  )
                }
              >
                {label(item)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-fg-subtle transition-colors hover:border-line-strong md:flex"
            aria-label="Search tools (opens command palette)"
          >
            <FiSearch aria-hidden="true" />
            <span className="flex-1 text-left">Search tools…</span>
            <kbd className="kbd">{shortcutLabel}</kbd>
          </button>
          <button type="button" onClick={openPalette} className="icon-btn size-9 md:hidden" aria-label="Search tools">
            <FiSearch aria-hidden="true" />
          </button>
          <ThemeToggle />
          <Link to="/submit" className="btn-secondary hidden h-9 min-h-0 px-3.5 lg:inline-flex">
            Submit a tool
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="icon-btn size-9 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="animate-fade-in border-t border-line bg-canvas lg:hidden">
          <ul className="container-page flex flex-col py-2">
            {[...NAV_ITEMS, { label: "About", path: "/about" }, { label: "Contact", path: "/contact" }].map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-11 items-center gap-2 border-b border-line text-[15px] last:border-0",
                      isActive ? "font-medium text-fg" : "text-fg-muted"
                    )
                  }
                >
                  {label(item)}
                </NavLink>
              </li>
            ))}
            <li className="py-3">
              <Link to="/submit" className="btn-primary w-full">
                Submit a tool
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
