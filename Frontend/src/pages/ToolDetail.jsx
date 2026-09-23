import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiChevronRight, FiShare2, FiGlobe, FiTag, FiCalendar, FiStar, FiArrowRight, FiColumns, FiFlag } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import ToolCard, { SaveButton, UpvoteButton, VisitLink } from "../Components/ToolCard";
import { useToast } from "../Components/Toast";
import NotFound from "./NotFound";
import { useTools } from "../lib/toolsStore";
import { api } from "../lib/api";
import { getCategory, PRICING_STYLES } from "../lib/constants";
import { recordView, useCompare, MAX_COMPARE } from "../lib/personal";
import { cn, formatDate, getDomain, safeUrl, toolKey } from "../lib/utils";

const PRICING_NOTES = {
  Free: "Completely free to use.",
  Freemium: "Free plan available, with paid upgrades for more usage or features.",
  Paid: "Requires a paid plan. Check the website for trials.",
};

const DetailSkeleton = () => (
  <div className="container-page pt-12" aria-busy="true">
    <div className="flex gap-6">
      <div className="skeleton size-20 rounded-2xl" />
      <div className="flex-1 space-y-3">
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
    <div className="skeleton mt-12 h-40 w-full rounded-2xl" />
  </div>
);

const ToolDetail = () => {
  const { slug } = useParams();
  const { tools, isLive, pending } = useTools();
  const toast = useToast();
  const { inCompare, toggleCompare } = useCompare();
  const [remote, setRemote] = useState({ slug: null, tool: null, done: false });

  const fromList = useMemo(() => tools.find((t) => toolKey(t) === slug || t._id === slug), [tools, slug]);
  const tool = fromList || (remote.slug === slug ? remote.tool : null);
  const key = tool ? toolKey(tool) : null;

  // Not in the live list (e.g. beyond the list limit): ask the API directly.
  useEffect(() => {
    if (fromList || !isLive || remote.slug === slug) return;
    let cancelled = false;
    api
      .getTool(slug, { retries: 0 })
      .then((t) => !cancelled && setRemote({ slug, tool: t, done: true }))
      .catch(() => !cancelled && setRemote({ slug, tool: null, done: true }));
    return () => {
      cancelled = true;
    };
  }, [fromList, isLive, slug, remote.slug]);

  useEffect(() => {
    if (tool) recordView(tool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const similar = useMemo(() => {
    if (!tool) return [];
    return tools
      .filter((t) => t.category === tool.category && toolKey(t) !== key)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 3);
  }, [tools, tool, key]);

  if (!tool) {
    // Only 404 once we're sure: live data (and a direct lookup) came back without it,
    // or background syncing has given up. Until then, it may simply not be loaded yet.
    const settled = isLive ? remote.slug === slug && remote.done : !pending;
    return settled ? <NotFound /> : <DetailSkeleton />;
  }

  const comparing = inCompare(tool);
  const onCompare = () => {
    const result = toggleCompare(tool);
    if (result === "full") toast(`You can compare up to ${MAX_COMPARE} tools at once`, "error");
    else toast(result === "added" ? `Added ${tool.name} to compare` : `Removed ${tool.name} from compare`);
  };

  const { icon: CategoryIcon } = getCategory(tool.category);
  const domain = getDomain(tool.link);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: tool.name, text: tool.tagline || tool.description, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      }
    } catch (err) {
      if (err?.name !== "AbortError") toast("Couldn't share this link", "error");
    }
  };

  // Escape "<" so tool text can never close the script tag.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    url: safeUrl(tool.link),
    offers: { "@type": "Offer", price: tool.price === "Free" ? "0" : undefined, priceCurrency: "USD", description: tool.price },
  }).replace(/</g, "\\u003c");

  return (
    <div className="container-page pt-8 sm:pt-12">
      <Seo title={`${tool.name}: ${tool.tagline || tool.category}`} description={tool.description.slice(0, 160)} path={`/tools/${key}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/aitools" className="hover:text-white">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">
            <FiChevronRight />
          </li>
          <li>
            <Link to={`/aitools?category=${encodeURIComponent(tool.category)}`} className="hover:text-white">
              {tool.category}
            </Link>
          </li>
          <li aria-hidden="true">
            <FiChevronRight />
          </li>
          <li className="text-slate-300" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      <header className="mt-8 flex flex-col gap-6 md:flex-row md:items-start">
        <ToolLogo tool={tool} size="lg" className="ring-1 ring-white/10" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{tool.name}</h1>
            {tool.featured && (
              <span className="badge bg-amber-500/10 text-amber-300 ring-amber-500/30">
                <FiStar className="fill-current" aria-hidden="true" /> Featured
              </span>
            )}
          </div>
          {tool.tagline && <p className="mt-2 text-lg text-slate-300">{tool.tagline}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={cn("badge", PRICING_STYLES[tool.price])}>{tool.price}</span>
            <Link
              to={`/aitools?category=${encodeURIComponent(tool.category)}`}
              className="badge bg-white/5 text-slate-300 ring-white/10 hover:text-white"
            >
              <CategoryIcon aria-hidden="true" /> {tool.category}
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <UpvoteButton tool={tool} className="min-h-12 min-w-12" />
          <SaveButton tool={tool} withLabel className="min-h-12" />
          <button
            type="button"
            onClick={onCompare}
            aria-pressed={comparing}
            className={cn("btn-secondary min-h-12", comparing && "border-indigo-400/50 bg-indigo-500/15 text-indigo-100")}
          >
            <FiColumns aria-hidden="true" /> {comparing ? "Comparing" : "Compare"}
          </button>
          <button type="button" onClick={share} className="btn-secondary min-h-12" aria-label={`Share ${tool.name}`}>
            <FiShare2 aria-hidden="true" /> Share
          </button>
          <VisitLink tool={tool} className="btn-primary min-h-12">
            Visit website
          </VisitLink>
        </div>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <section className="card p-6 sm:p-8 lg:col-span-2" aria-labelledby="about-tool">
          <h2 id="about-tool" className="text-lg font-semibold text-white">
            About {tool.name}
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-300">{tool.description}</p>
          {tool.tags?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-400">Tags</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      to={`/aitools?q=${encodeURIComponent(tag)}`}
                      className="inline-flex min-h-8 items-center gap-1 rounded-full border border-white/10 px-3 text-sm text-slate-300 hover:border-indigo-400/40 hover:text-white"
                    >
                      <FiTag className="text-xs" aria-hidden="true" /> {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="card h-fit p-6 sm:p-8" aria-label="Tool details">
          <h2 className="text-lg font-semibold text-white">Details</h2>
          <dl className="mt-5 space-y-5 text-sm">
            <div>
              <dt className="text-slate-500">Pricing</dt>
              <dd className="mt-1 text-slate-200">
                <span className="font-medium">{tool.price}</span>
                {PRICING_NOTES[tool.price] && <span className="block text-slate-400">{PRICING_NOTES[tool.price]}</span>}
              </dd>
            </div>
            {domain && (
              <div>
                <dt className="text-slate-500">Website</dt>
                <dd className="mt-1">
                  <VisitLink tool={tool} className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200">
                    <FiGlobe aria-hidden="true" /> {domain}
                  </VisitLink>
                </dd>
              </div>
            )}
            {tool.createdAt && (
              <div>
                <dt className="text-slate-500">Listed</dt>
                <dd className="mt-1 flex items-center gap-1 text-slate-200">
                  <FiCalendar aria-hidden="true" /> {formatDate(tool.createdAt)}
                </dd>
              </div>
            )}
          </dl>
          <Link
            to={`/contact?subject=${encodeURIComponent(`Issue with ${tool.name}`)}`}
            className="mt-6 inline-flex items-center gap-2 border-t border-white/[0.07] pt-5 text-sm text-slate-400 hover:text-white"
          >
            <FiFlag aria-hidden="true" /> Report outdated info or a broken link
          </Link>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-20" aria-labelledby="similar">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="similar" className="text-2xl font-bold tracking-tight text-white">
              Alternatives to {tool.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/compare?tools=${[key, ...similar.slice(0, MAX_COMPARE - 1).map(toolKey)].join(",")}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200"
              >
                <FiColumns aria-hidden="true" /> Compare side by side
              </Link>
              <Link
                to={`/aitools?category=${encodeURIComponent(tool.category)}`}
                className="hidden items-center gap-1 text-sm text-slate-400 hover:text-white sm:inline-flex"
              >
                All {tool.category} tools <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((t) => (
              <ToolCard key={toolKey(t)} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ToolDetail;
