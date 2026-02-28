import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "AI Tools", path: "/aitools" },
  { label: "Contact", path: "/contact" },
  { label: "Submit", path: "/submit" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold" onClick={closeMenu}>
          AI Project
        </Link>

        {/* Hamburger Button — touch-friendly 44px min target */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-xl p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-transform transform hover:scale-110"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex md:flex-row md:space-x-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-gray-700 text-white"
                    : "hover:text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-gray-900 md:hidden shadow-lg"
            >
              <ul className="flex flex-col p-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`block px-4 py-3 rounded-lg min-h-[44px] flex items-center transition-colors ${
                        location.pathname === item.path
                          ? "bg-gray-700 text-white"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
