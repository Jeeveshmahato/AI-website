import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiSearch,
  FiCompass,
  FiLayers,
  FiExternalLink,
  FiShield,
  FiRefreshCw,
  FiDollarSign,
  FiHeart,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolCard, { ToolCardSkeleton } from "../Components/ToolCard";
import ToolLogo from "../Components/ToolLogo";
import Newsletter from "../Components/Newsletter";
import { useTools } from "../lib/toolsStore";
import { CATEGORIES } from "../lib/constants";
import { sortTools } from "../lib/filters";
import { cn } from "../lib/utils";

const POPULAR_SEARCHES = ["Chatbot", "Image", "Video", "Coding", "Voice", "Free"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

const SectionHeader = ({ eyebrow, title, subtitle, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Hero = ({ tools, total }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const floating = tools.filter((t) => t.featured).slice(0, 6);

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/aitools?q=${encodeURIComponent(q)}` : "/aitools");
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-[-10rem] -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/30 via-violet-600/20 to-fuchsia-600/25 blur-3xl"
        aria-hidden="true"
      />

      {/* Floating logos (decorative, large screens only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden xl:block" aria-hidden="true">
        {floating.map((tool, i) => (
          <div
            key={tool.slug || tool._id}
            className="absolute animate-float opacity-60"
            style={{
              top: `${[18, 48, 72, 20, 50, 74][i]}%`,
              left: i < 3 ? `${[8, 4, 10][i]}%` : undefined,
              right: i >= 3 ? `${[8, 4, 10][i - 3]}%` : undefined,
              animationDelay: `${i * 0.9}s`,
            }}
          >
            <ToolLogo tool={tool} size="md" className="shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10" />
          </div>
        ))}
      </div>

      <div className="container-page pb-20 pt-16 text-center sm:pb-28 sm:pt-24">
        {/* Hero is intentionally not animated: the headline is the LCP element and must paint immediately. */}
        <div>
          <Link
            to="/aitools?sort=newest"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-sm text-slate-300 transition-colors hover:border-white/20"
          >
            <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-xs font-semibold text-white">
              New
            </span>
            {total > 0 ? `${total}+ hand-picked AI tools and growing` : "Hand-picked AI tools and growing"}
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Find the perfect <span className="text-gradient">AI tool</span> for any task
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Stop scrolling through endless lists. Compare the best AI tools for writing, images, video, code and research, with honest
          pricing, in one place.
        </p>

        <form
          onSubmit={search}
          role="search"
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/80 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur focus-within:border-indigo-400/50">
            <FiSearch className="ml-3 shrink-0 text-xl text-slate-500" aria-hidden="true" />
            <label htmlFor="hero-search" className="sr-only">
              Search AI tools
            </label>
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “logo”, “video editing” or “coding”…"
              className="min-w-0 flex-1 bg-transparent py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button type="submit" className="btn-primary px-4 sm:px-6">
              <span className="hidden sm:inline">Search</span>
              <FiArrowRight className="sm:hidden" aria-label="Search" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                to={term === "Free" ? "/aitools?price=Free" : `/aitools?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-white/10 px-3 py-1 text-slate-300 transition-colors hover:border-indigo-400/40 hover:text-white"
              >
                {term}
              </Link>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
};

const Stats = ({ tools }) => {
  const stats = useMemo(() => {
    const categories = new Set(tools.map((t) => t.category)).size;
    const free = tools.filter((t) => t.price === "Free" || t.price === "Freemium").length;
    return [
      { value: tools.length, label: "AI tools listed" },
      { value: categories, label: "Categories" },
      { value: free, label: "Free or freemium" },
      { value: "100%", label: "Free to use, no sign-up" },
    ];
  }, [tools]);

  return (
    <section aria-label="Directory statistics" className="container-page">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-ink-900 px-6 py-8 text-center">
            <dt className="text-sm text-slate-400">{s.label}</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{tools.length ? s.value : "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

const Categories = ({ tools }) => {
  const counts = useMemo(() => {
    const map = {};
    tools.forEach((t) => (map[t.category] = (map[t.category] || 0) + 1));
    return map;
  }, [tools]);

  return (
    <section className="container-page mt-28">
      <motion.div {...fadeUp}>
        <SectionHeader
          eyebrow="Browse by category"
          title="Whatever you're building, there's an AI for that"
          action={
            <Link to="/categories" className="btn-secondary">
              All categories <FiArrowRight aria-hidden="true" />
            </Link>
          }
        />
      </motion.div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.slice(0, 8).map((cat, i) => (
          <motion.div key={cat.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.04 }}>
            <Link
              to={`/aitools?category=${encodeURIComponent(cat.name)}`}
              className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-ink-850/60 p-5 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-ink-800"
            >
              <span className={cn("flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white shadow-lg", cat.color)}>
                <cat.icon aria-hidden="true" />
              </span>
              <span className="mt-4 font-semibold text-white">{cat.name}</span>
              <span className="mt-1 hidden text-sm text-slate-400 sm:block">{cat.blurb}</span>
              <span className="mt-3 text-xs font-medium text-slate-500 group-hover:text-indigo-300">
                {counts[cat.name] || 0} tools →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const TABS = [
  { key: "featured", label: "Featured" },
  { key: "popular", label: "Most upvoted" },
  { key: "newest", label: "Just added" },
];

const Spotlight = ({ tools, loading }) => {
  const [tab, setTab] = useState("featured");
  const shown = useMemo(() => {
    const pool = tab === "featured" && tools.some((t) => t.featured) ? tools.filter((t) => t.featured) : tools;
    return sortTools(pool, tab).slice(0, 6);
  }, [tools, tab]);

  return (
    <section className="container-page mt-28">
      <motion.div {...fadeUp}>
        <SectionHeader
          eyebrow="Spotlight"
          title="Tools people love right now"
          subtitle="Our editors' picks plus what the community is upvoting this week."
          action={
            <div role="tablist" aria-label="Spotlight lists" className="flex rounded-xl border border-white/10 bg-ink-900 p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "min-h-10 rounded-lg px-3 text-sm font-medium transition-colors sm:px-4",
                    tab === t.key ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
        />
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <ToolCardSkeleton key={i} />)
          : shown.map((tool) => <ToolCard key={tool._id || tool.slug} tool={tool} />)}
      </div>

      <div className="mt-10 text-center">
        <Link to={`/aitools?sort=${tab}`} className="btn-secondary">
          Explore all tools <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

const STEPS = [
  { icon: FiCompass, title: "Discover", text: "Search by task or browse curated categories to find tools that fit what you're trying to do." },
  { icon: FiLayers, title: "Compare", text: "See pricing, features and community upvotes side by side. Save favorites to decide later." },
  { icon: FiExternalLink, title: "Launch", text: "Jump straight to the tool and start creating. No sign-up or paywall on our side." },
];

const HowItWorks = () => (
  <section className="container-page mt-28">
    <motion.div {...fadeUp} className="text-center">
      <p className="eyebrow">How it works</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">From idea to the right tool in minutes</h2>
    </motion.div>
    <div className="relative mt-12 grid gap-6 md:grid-cols-3">
      {STEPS.map((step, i) => (
        <motion.div key={step.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="card p-7">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/15 text-xl text-indigo-300">
              <step.icon aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-slate-500">Step {i + 1}</span>
          </div>
          <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-slate-400">{step.text}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const VALUES = [
  { icon: FiShield, title: "Hand-reviewed", text: "Every submission is checked by a person before it's listed. No spam, no dead links." },
  { icon: FiDollarSign, title: "Honest pricing", text: "Clear Free, Freemium and Paid labels, so you know what you're getting before you click." },
  { icon: FiRefreshCw, title: "Community-driven", text: "Upvotes surface what's actually useful, and anyone can suggest a new tool." },
  { icon: FiHeart, title: "Built for you", text: "No account needed. Save tools locally and share links to any search or tool." },
];

const Values = () => (
  <section className="container-page mt-28">
    <div className="grid gap-12 lg:grid-cols-5 lg:items-center">
      <motion.div {...fadeUp} className="lg:col-span-2">
        <p className="eyebrow">Why AI Tools Hub</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">A directory you can actually trust</h2>
        <p className="mt-4 leading-relaxed text-slate-400">
          The AI landscape changes every week. We do the digging so you can spend your time using great tools, not hunting for
          them.
        </p>
        <Link to="/about" className="btn-secondary mt-8">
          Our curation process <FiArrowRight aria-hidden="true" />
        </Link>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
        {VALUES.map((v, i) => (
          <motion.div key={v.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="card p-6">
            <v.icon className="text-2xl text-violet-300" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{v.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FAQS = [
  { q: "Is AI Tools Hub free to use?", a: "Yes. Browsing, searching, saving and upvoting are completely free and don't require an account." },
  {
    q: "How are tools selected?",
    a: "We list tools that are live, genuinely useful and clear about pricing. Every community submission is reviewed by a person before it appears in the directory.",
  },
  {
    q: "What do Free, Freemium and Paid mean?",
    a: "Free tools cost nothing to use. Freemium tools have a free tier with paid upgrades. Paid tools require a subscription or purchase, though many offer trials.",
  },
  {
    q: "Can I list my own AI tool?",
    a: "Absolutely. Use the Submit a tool page. Listing is free, and every submission is reviewed before it goes live.",
  },
  { q: "Where are my saved tools stored?", a: "Saved tools are stored privately in your browser, so we never see your list and no account is needed." },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="container-page mt-28 max-w-3xl">
      <motion.div {...fadeUp} className="text-center">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Questions, answered</h2>
      </motion.div>
      <div className="mt-10 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-ink-850/60">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-6 py-4 text-left font-medium text-white"
                >
                  {item.q}
                  <FiChevronDown className={cn("shrink-0 text-slate-400 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-${i}`} hidden={!isOpen} className="px-6 pb-5 leading-relaxed text-slate-400">
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="container-page mt-28">
    <motion.div
      {...fadeUp}
      className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-fuchsia-600/20 px-6 py-14 sm:px-12"
    >
      <div className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-fuchsia-500/30 blur-3xl" aria-hidden="true" />
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Stay ahead of the AI curve</h2>
          <p className="mt-3 max-w-lg text-slate-300">
            Get occasional emails featuring the most useful new AI tools, hand-picked by our team.
          </p>
          <div className="mt-6 max-w-lg">
            <Newsletter />
          </div>
        </div>
        <div className="card flex flex-col items-start gap-4 border-white/10 bg-ink-950/50 p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-xl text-white">
            <FiPlus aria-hidden="true" />
          </span>
          <h3 className="text-xl font-semibold text-white">Built an AI tool?</h3>
          <p className="text-slate-400">Put it in front of people actively looking for AI tools. Listing is free and takes two minutes.</p>
          <Link to="/submit" className="btn-primary">
            Submit your tool <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

const Home = () => {
  const { tools, status } = useTools();
  const loading = status === "loading" || status === "idle";

  return (
    <>
      <Seo description="Discover and compare the best AI tools for writing, images, video, coding, research and productivity. Hand-curated, with honest pricing." path="/" />
      <Hero tools={tools} total={tools.length} />
      <Stats tools={tools} />
      <Categories tools={tools} />
      <Spotlight tools={tools} loading={loading} />
      <HowItWorks />
      <Values />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
