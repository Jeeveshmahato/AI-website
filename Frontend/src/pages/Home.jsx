import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiSearch, FiPlus } from "react-icons/fi";
import Seo from "../Components/Seo";
import { ToolRow, VisitLink } from "../Components/ToolCard";
import ToolLogo from "../Components/ToolLogo";
import PriceTag from "../Components/PriceTag";
import CollectionCard from "../Components/CollectionCard";
import SyncStatus from "../Components/SyncStatus";
import collections from "../data/collections";
import { useTools } from "../lib/toolsStore";
import { useRecent, resolveKeys } from "../lib/personal";
import { CATEGORIES } from "../lib/constants";
import { sortTools } from "../lib/filters";
import { cn, formatCount, formatDate, toolKey, toolPath } from "../lib/utils";

const QUICK_LINKS = ["Chatbot", "Image Generation", "Code Assistance", "Video Generation", "Writing Assistant"];

const Hero = ({ tools }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const meta = useMemo(() => {
    const categories = new Set(tools.map((t) => t.category)).size;
    const latest = tools.reduce((max, t) => {
      const d = new Date(t.updatedAt || t.createdAt || 0).getTime();
      return d > max ? d : max;
    }, 0);
    return { categories, updated: latest ? formatDate(latest) : null };
  }, [tools]);

  const trending = useMemo(() => sortTools(tools, "trending").slice(0, 5), [tools]);

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/aitools?q=${encodeURIComponent(q)}` : "/aitools");
  };

  return (
    <section className="border-b border-line">
      <div className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-subtle">
            <span>{tools.length} tools</span>
            <span aria-hidden="true">·</span>
            <span>{meta.categories} categories</span>
            {meta.updated && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {meta.updated}</span>
              </>
            )}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            The curated directory of AI&nbsp;tools
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Every listing is reviewed by a person and labeled with honest pricing. Search by what you need to get done, compare
            side by side, and keep a shortlist. No account needed.
          </p>

          <form onSubmit={search} role="search" className="mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                Search AI tools
              </label>
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “edit a video” or “write code”"
                className="input h-11 pl-10"
              />
            </div>
            <button type="submit" className="btn-primary h-11">
              Search
            </button>
          </form>

          <p className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-fg-subtle">
            <span className="mr-1">Popular:</span>
            {QUICK_LINKS.map((name, i) => {
              const cat = CATEGORIES.find((c) => c.name === name);
              return (
                <span key={name}>
                  <Link to={`/aitools?category=${encodeURIComponent(name)}`} className="text-fg-muted underline-offset-4 hover:text-fg hover:underline">
                    {cat?.short || name}
                  </Link>
                  {i < QUICK_LINKS.length - 1 && <span aria-hidden="true">,</span>}
                </span>
              );
            })}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="card shadow-card">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="text-sm font-medium text-fg">Trending</h2>
              <Link to="/aitools?sort=trending" className="text-xs text-fg-muted hover:text-fg">
                View all
              </Link>
            </div>
            <ol className="divide-y divide-line">
              {trending.map((tool, i) => (
                <li key={toolKey(tool)} className="relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2">
                  <span className="w-4 font-mono text-xs tabular-nums text-fg-subtle">{i + 1}</span>
                  <ToolLogo tool={tool} size="xs" />
                  <div className="min-w-0 flex-1">
                    <Link to={toolPath(tool)} className="block truncate text-sm font-medium text-fg after:absolute after:inset-0">
                      {tool.name}
                    </Link>
                    <p className="truncate text-xs text-fg-subtle">{tool.category}</p>
                  </div>
                  <PriceTag price={tool.price} className="hidden sm:inline-flex" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

const RecentlyViewed = ({ tools }) => {
  const recent = resolveKeys(useRecent(), tools).slice(0, 6);
  if (recent.length === 0) return null;
  return (
    <section className="container-page mt-10" aria-labelledby="recent">
      <h2 id="recent" className="text-sm font-medium text-fg-muted">
        Recently viewed
      </h2>
      <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {recent.map((tool) => (
          <li key={toolKey(tool)} className="shrink-0">
            <Link
              to={toolPath(tool)}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface py-1.5 pl-1.5 pr-3 text-sm text-fg transition-colors hover:border-line-strong"
            >
              <ToolLogo tool={tool} size="xs" />
              {tool.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

const TABS = [
  { key: "featured", label: "Featured" },
  { key: "popular", label: "Most upvoted" },
  { key: "newest", label: "Newest" },
];

const TopTools = ({ tools }) => {
  const [tab, setTab] = useState("featured");
  const shown = useMemo(() => sortTools(tools, tab).slice(0, 10), [tools, tab]);

  return (
    <section aria-labelledby="top-tools">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 id="top-tools" className="section-title">
            Top tools
          </h2>
          <SyncStatus />
        </div>
        <div role="tablist" aria-label="Sort top tools" className="flex w-full rounded-lg border border-line bg-surface-2 p-0.5 sm:w-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-8 flex-1 whitespace-nowrap rounded-md px-3 text-sm transition-colors sm:flex-none",
                tab === t.key ? "bg-surface font-medium text-fg shadow-[0_1px_2px_rgb(0_0_0/0.06)]" : "text-fg-muted hover:text-fg"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ol role="tabpanel" className="mt-4 -mx-2 divide-y divide-line sm:-mx-3">
        {shown.map((tool, i) => (
          <li key={toolKey(tool)}>
            <ToolRow tool={tool} rank={i + 1} />
          </li>
        ))}
      </ol>

      <Link to={`/aitools?sort=${tab}`} className="btn-secondary mt-4 w-full">
        Browse all {tools.length} tools <FiArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
};

// Same pick for everyone all day (UTC), rotating daily.
const ToolOfTheDay = ({ tools }) => {
  const tool = useMemo(() => {
    if (!tools.length) return null;
    const sorted = [...tools].sort((a, b) => toolKey(a).localeCompare(toolKey(b)));
    const day = Math.floor(Date.now() / 86_400_000);
    return sorted[(day * 7919) % sorted.length];
  }, [tools]);
  if (!tool) return null;

  return (
    <section className="card p-5" aria-labelledby="totd">
      <h2 id="totd" className="text-xs font-medium text-fg-subtle">
        Tool of the day
      </h2>
      <div className="mt-3 flex items-center gap-3">
        <ToolLogo tool={tool} />
        <div className="min-w-0">
          <Link to={toolPath(tool)} className="font-semibold text-fg hover:underline">
            {tool.name}
          </Link>
          <p className="truncate text-sm text-fg-subtle">{tool.category}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-muted">{tool.description}</p>
      <div className="mt-4 flex gap-2">
        <Link to={toolPath(tool)} className="btn-secondary min-h-9 flex-1">
          Details
        </Link>
        <VisitLink tool={tool} className="btn-secondary min-h-9 flex-1">
          Visit
        </VisitLink>
      </div>
    </section>
  );
};

const Sidebar = ({ tools }) => (
  <aside className="space-y-6">
    <ToolOfTheDay tools={tools} />

    <section className="card p-3" aria-labelledby="stacks-side">
      <div className="flex items-center justify-between px-2 pb-1 pt-1">
        <h2 id="stacks-side" className="text-xs font-medium text-fg-subtle">
          Curated stacks
        </h2>
        <Link to="/stacks" className="text-xs text-fg-muted hover:text-fg">
          All
        </Link>
      </div>
      {collections.slice(0, 5).map((c) => (
        <CollectionCard key={c.slug} collection={c} tools={tools} compact />
      ))}
    </section>

    <section className="rounded-xl border border-dashed border-line-strong p-5">
      <h2 className="font-medium text-fg">Built an AI tool?</h2>
      <p className="mt-1 text-sm text-fg-muted">Listing is free. Every submission is reviewed before it goes live.</p>
      <Link to="/submit" className="btn-secondary mt-4 min-h-9">
        <FiPlus aria-hidden="true" /> Submit a tool
      </Link>
    </section>
  </aside>
);

const CategoryGrid = ({ tools }) => {
  const counts = useMemo(() => {
    const map = {};
    tools.forEach((t) => (map[t.category] = (map[t.category] || 0) + 1));
    return map;
  }, [tools]);

  return (
    <section className="container-page mt-20" aria-labelledby="categories">
      <div className="flex items-end justify-between gap-4">
        <h2 id="categories" className="section-title">
          Browse by category
        </h2>
        <Link to="/categories" className="text-sm text-fg-muted hover:text-fg">
          All categories
        </Link>
      </div>
      {/* gap-px over a line-coloured background draws crisp 1px grid lines */}
      <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="bg-surface">
            <Link
              to={`/aitools?category=${encodeURIComponent(cat.name)}`}
              className="group flex h-full items-start gap-3 p-4 transition-colors hover:bg-surface-2"
            >
              <cat.icon className="mt-0.5 shrink-0 text-fg-subtle group-hover:text-fg" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">{cat.short}</span>
                <span className="mt-0.5 block text-xs text-fg-subtle">
                  {counts[cat.name] || 0} tools · <span className="hidden sm:inline">{cat.blurb}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
        <li className="bg-surface">
          <Link to="/aitools" className="flex h-full items-center gap-2 p-4 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
            All {tools.length} tools <FiArrowRight aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </section>
  );
};

const FAQS = [
  { q: "Is AI Tools Hub free?", a: "Yes. Browsing, searching, saving, comparing and upvoting are free and don't need an account." },
  {
    q: "How are tools chosen?",
    a: "Tools must be live, genuinely useful and clear about pricing. Every community submission is reviewed by a person before it's listed.",
  },
  {
    q: "What do Free, Freemium and Paid mean?",
    a: "Free costs nothing. Freemium has a free tier with paid upgrades. Paid requires a subscription or purchase, though many offer trials.",
  },
  { q: "Can I list my own tool?", a: "Yes. Use Submit a tool. Listing is free, and each submission is reviewed before it goes live." },
  { q: "Where are my saved tools stored?", a: "In your browser only. We never see your list, and no account is needed." },
];

const FAQ = () => (
  <section className="container-page mt-20" aria-labelledby="faq">
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 id="faq" className="section-title">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Something else?{" "}
          <Link to="/contact" className="link">
            Get in touch
          </Link>
          .
        </p>
      </div>
      <div className="divide-y divide-line border-y border-line lg:col-span-8">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-fg">
              {item.q}
              <FiPlus className="shrink-0 text-fg-subtle transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="mt-2 pr-8 text-sm leading-relaxed text-fg-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  const { tools } = useTools();
  const totalUpvotes = useMemo(() => tools.reduce((s, t) => s + (t.upvotes || 0), 0), [tools]);

  return (
    <>
      <Seo
        description="Hand-reviewed AI tools for writing, images, video, coding and research, with clear pricing. Search by task, compare side by side, and save a shortlist."
        path="/"
      />
      <Hero tools={tools} />
      <RecentlyViewed tools={tools} />
      <div className="container-page mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TopTools tools={tools} />
          {totalUpvotes > 0 && (
            <p className="mt-3 text-center font-mono text-xs text-fg-subtle">{formatCount(totalUpvotes)} community upvotes so far</p>
          )}
        </div>
        <div className="lg:col-span-4">
          <Sidebar tools={tools} />
        </div>
      </div>
      <CategoryGrid tools={tools} />
      <FAQ />
    </>
  );
};

export default Home;
