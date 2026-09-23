import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import Logo from "./Logo";

const NAV_ITEMS = [
  { label: "Explore", path: "/aitools" },
  { label: "Categories", path: "/categories" },
  { label: "Saved", path: "/saved" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-white"
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || menuOpen ? "border-white/[0.07] bg-ink-950/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="rounded-lg" aria-label="AI Tools Hub home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={linkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link to="/submit" className="btn-primary min-h-10 px-4">
            <FiPlus aria-hidden="true" /> Submit a tool
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="-mr-2 flex size-11 items-center justify-center rounded-lg text-xl text-slate-200 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.07] md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={({ isActive }) => cn(linkClass({ isActive }), "flex min-h-11 items-center text-base")}>
                    {item.label}
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
