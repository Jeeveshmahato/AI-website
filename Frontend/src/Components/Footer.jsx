import { Link } from "react-router-dom";
import { FiGithub } from "react-icons/fi";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import ThemeToggle from "./ThemeToggle";
import { CATEGORIES } from "../lib/constants";

const COLUMNS = [
  {
    title: "Directory",
    links: [
      { label: "All tools", to: "/aitools" },
      { label: "Trending", to: "/aitools?sort=trending" },
      { label: "Newest", to: "/aitools?sort=newest" },
      { label: "Free tools", to: "/aitools?price=Free" },
      { label: "Stacks", to: "/stacks" },
      { label: "Compare", to: "/compare" },
    ],
  },
  {
    title: "Categories",
    links: CATEGORIES.slice(0, 6).map((c) => ({ label: c.short, to: `/aitools?category=${encodeURIComponent(c.name)}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Submit a tool", to: "/submit" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const Footer = () => (
  <footer className="mt-24 border-t border-line">
    <div className="container-page grid gap-10 py-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Logo />
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
          An independent, hand-reviewed directory of AI tools, with clear pricing and no sign-up.
        </p>
        <div className="mt-6 max-w-sm">
          <p className="mb-2 text-sm font-medium text-fg">New tools, occasionally in your inbox</p>
          <Newsletter />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-medium text-fg">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-line">
      <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-sm text-fg-subtle sm:flex-row">
        <p>© {new Date().getFullYear()} AI Tools Hub</p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Jeeveshmahato/AI-website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            <FiGithub aria-hidden="true" /> GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
