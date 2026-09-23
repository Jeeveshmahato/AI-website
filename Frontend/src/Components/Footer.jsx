import { Link } from "react-router-dom";
import { FiGithub } from "react-icons/fi";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { CATEGORIES } from "../lib/constants";

const COLUMNS = [
  {
    title: "Directory",
    links: [
      { label: "All tools", to: "/aitools" },
      { label: "Trending", to: "/aitools?sort=trending" },
      { label: "Free tools", to: "/aitools?price=Free" },
      { label: "Curated stacks", to: "/stacks" },
      { label: "Compare tools", to: "/compare" },
      { label: "Saved tools", to: "/saved" },
    ],
  },
  {
    title: "Categories",
    links: CATEGORIES.slice(0, 5).map((c) => ({ label: c.name, to: `/aitools?category=${encodeURIComponent(c.name)}` })),
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
  <footer className="mt-24 border-t border-white/[0.07] bg-ink-900/60">
    <div className="container-page grid gap-12 py-14 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Logo />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
          A hand-curated directory of the AI tools worth your time. Compare features and pricing, then find the right
          tool for every job.
        </p>
        <div className="mt-6 max-w-sm">
          <p className="mb-2 text-sm font-semibold text-white">Get the AI tools roundup</p>
          <Newsletter />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-white/[0.07]">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} AI Tools Hub. All rights reserved.</p>
        <a
          href="https://github.com/Jeeveshmahato/AI-website"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <FiGithub aria-hidden="true" /> Source on GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
