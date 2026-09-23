import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiPlus, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useSaved } from "../lib/personal";
import { useCommandPalette, shortcutLabel } from "./CommandPalette";
import Logo from "./Logo";

const NAV_ITEMS = [
  { label: "Explore", path: "/aitools" },
  { label: "Categories", path: "/categories" },
  { label: "Stacks", path: "/stacks" },
  { label: "Compare", path: "/compare" },
  { label: "Saved", path: "/saved" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const openPalette = useCommandPalette();
  const { savedCount } = useSaved();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const linkClass = ({ isActive }) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-white"
    );

  const label = (item) => (
    <>
      {item.label}
      {item.path === "/saved" && savedCount > 0 && (
        <span className="rounded-full bg-fuchsia-500/20 px-1.5 text-[11px] font-semibold text-fuchsia-200" aria-label={`${savedCount} saved`}>
          {savedCount}
        </span>
      )}
    </>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || menuOpen ? "border-white/[0.07] bg-ink-950/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="shrink-0 rounded-lg" aria-label="AI Tools Hub home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={linkClass}>
                {label(item)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            aria-label="Search (opens command palette)"
          >
            <FiSearch aria-hidden="true" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden rounded-md border border-white/10 px-1.5 text-[11px] xl:inline">{shortcutLabel}</kbd>
          </button>
          <Link to="/submit" className="btn-primary hidden min-h-10 px-4 lg:inline-flex">
            <FiPlus aria-hidden="true" /> Submit a tool
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="-mr-2 flex size-11 items-center justify-center rounded-lg text-xl text-slate-200 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.07] lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {[...NAV_ITEMS, { label: "Contact", path: "/contact" }].map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={({ isActive }) => cn(linkClass({ isActive }), "flex min-h-11 text-base")}>
                    {label(item)}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/submit" className="btn-primary w-full">
                  <FiPlus aria-hidden="true" /> Submit a tool
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
