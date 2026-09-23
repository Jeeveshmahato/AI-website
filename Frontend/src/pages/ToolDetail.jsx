import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiChevronRight, FiShare2, FiStar, FiArrowRight, FiColumns, FiFlag, FiArrowUpRight } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import PriceTag from "../Components/PriceTag";
import { ToolRow, SaveButton, CompareButton, UpvoteButton, VisitLink } from "../Components/ToolCard";
import { useToast } from "../Components/Toast";
import NotFound from "./NotFound";
import { useTools } from "../lib/toolsStore";
import { api } from "../lib/api";
import { PRICING_NOTES } from "../lib/constants";
import { recordView, MAX_COMPARE } from "../lib/personal";
import { formatCount, formatDate, getDomain, safeUrl, toolKey } from "../lib/utils";

const DetailSkeleton = () => (
  <div className="container-page pt-12" aria-busy="true" aria-label="Loading tool">
    <div className="flex gap-5">
      <div className="skeleton size-16 rounded-xl" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="skeleton h-7 w-1/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
    <div className="skeleton mt-10 h-40 w-full rounded-xl" />
  </div>
);

const DetailRow = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 py-3 text-sm">
    <dt className="text-fg-subtle">{label}</dt>
    <dd className="text-right text-fg">{children}</dd>
  </div>
);

const ToolDetail = () => {
  const { slug } = useParams();
  const { tools, isLive, pending } = useTools();
  const toast = useToast();
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
      .slice(0, 5);
  }, [tools, tool, key]);

  if (!tool) {
    // Only 404 once we're sure: live data (and a direct lookup) came back without it,
    // or background syncing has given up. Until then, it may simply not be loaded yet.
    const settled = isLive ? remote.slug === slug && remote.done : !pending;
    return settled ? <NotFound /> : <DetailSkeleton />;
  }

  const domain = getDomain(tool.link);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: tool.name, text: tool.tagline || tool.description, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Link copied");
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
    <div className="container-page pt-8">
      <Seo title={`${tool.name}: ${tool.tagline || tool.category}`} description={tool.description.slice(0, 160)} path={`/tools/${key}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <nav aria-label="Breadcrumb" className="text-sm text-fg-subtle">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/aitools" className="hover:text-fg">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">
            <FiChevronRight />
          </li>
          <li>
            <Link to={`/aitools?category=${encodeURIComponent(tool.category)}`} className="hover:text-fg">
              {tool.category}
            </Link>
          </li>
          <li aria-hidden="true">
            <FiChevronRight />
          </li>
          <li className="text-fg-muted" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <header className="flex items-start gap-5">
            <ToolLogo tool={tool} size="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="flex flex-wrap items-center gap-2 text-3xl font-semibold tracking-tight text-fg">
                {tool.name}
                {tool.featured && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-xs font-medium text-fg-muted">
                    <FiStar className="fill-accent text-accent" aria-hidden="true" /> Featured
                  </span>
                )}
              </h1>
              {tool.tagline && <p className="mt-1.5 text-lg text-fg-muted">{tool.tagline}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <PriceTag price={tool.price} className="text-sm" />
                <Link to={`/aitools?category=${encodeURIComponent(tool.category)}`} className="text-fg-muted hover:text-fg">
                  {tool.category}
                </Link>
                {domain && <span className="text-fg-subtle">{domain}</span>}
              </div>
            </div>
          </header>

          {/* Mobile actions (desktop uses the sidebar) */}
          <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
            <VisitLink tool={tool} className="btn-primary flex-1">
              Visit website
            </VisitLink>
            <UpvoteButton tool={tool} size="sm" />
            <SaveButton tool={tool} />
            <CompareButton tool={tool} withLabel={false} />
            <button type="button" onClick={share} className="icon-btn size-9" aria-label={`Share ${tool.name}`}>
              <FiShare2 aria-hidden="true" />
            </button>
          </div>

          <section className="mt-10" aria-labelledby="overview">
            <h2 id="overview" className="text-sm font-medium text-fg-subtle">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-line text-[17px] leading-relaxed text-fg">{tool.description}</p>
          </section>

          {tool.tags?.length > 0 && (
            <section className="mt-8" aria-labelledby="tags">
              <h2 id="tags" className="text-sm font-medium text-fg-subtle">
                Good for
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      to={`/aitools?q=${encodeURIComponent(tag)}`}
                      className="inline-flex h-7 items-center rounded-md border border-line bg-surface px-2.5 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link
            to={`/contact?subject=${encodeURIComponent(`Issue with ${tool.name}`)}`}
            className="mt-8 inline-flex items-center gap-2 text-xs text-fg-subtle hover:text-fg lg:hidden"
          >
            <FiFlag aria-hidden="true" /> Report outdated info or a broken link
          </Link>

          {similar.length > 0 && (
            <section className="mt-12 border-t border-line pt-8" aria-labelledby="similar">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="similar" className="section-title">
                  Alternatives to {tool.name}
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <Link
                    to={`/compare?tools=${[key, ...similar.slice(0, MAX_COMPARE - 1).map(toolKey)].join(",")}`}
                    className="inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
                  >
                    <FiColumns aria-hidden="true" /> Compare
                  </Link>
                  <Link to={`/aitools?category=${encodeURIComponent(tool.category)}`} className="inline-flex items-center gap-1 text-fg-muted hover:text-fg">
                    View all <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <ul className="mt-3 -mx-2 divide-y divide-line sm:-mx-3">
                {similar.map((t) => (
                  <li key={toolKey(t)}>
                    <ToolRow tool={t} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Desktop action sidebar */}
        <aside className="hidden lg:block" aria-label="Actions and details">
          <div className="sticky top-20 space-y-4">
            <div className="card p-4">
              <VisitLink tool={tool} className="btn-primary h-11 w-full" icon={false}>
                Visit {domain || "website"} <FiArrowUpRight aria-hidden="true" />
              </VisitLink>
              <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-2">
                <UpvoteButton tool={tool} size="sm" />
                <SaveButton tool={tool} withLabel className="min-h-10" />
                <CompareButton tool={tool} withLabel className="min-h-10" />
              </div>
              <button type="button" onClick={share} className="btn-ghost mt-2 w-full">
                <FiShare2 aria-hidden="true" /> Share
              </button>
            </div>

            <dl className="card divide-y divide-line px-4">
              <div className="py-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-fg-subtle">Pricing</dt>
                  <dd>
                    <PriceTag price={tool.price} className="text-sm text-fg" />
                  </dd>
                </div>
                {PRICING_NOTES[tool.price] && <dd className="mt-1.5 text-xs leading-relaxed text-fg-subtle">{PRICING_NOTES[tool.price]}</dd>}
              </div>
              <DetailRow label="Category">{tool.category}</DetailRow>
              <DetailRow label="Upvotes">
                <span className="font-mono tabular-nums">{formatCount(tool.upvotes)}</span>
              </DetailRow>
              {tool.createdAt && <DetailRow label="Listed">{formatDate(tool.createdAt)}</DetailRow>}
            </dl>

            <Link
              to={`/contact?subject=${encodeURIComponent(`Issue with ${tool.name}`)}`}
              className="flex items-center gap-2 px-1 text-xs text-fg-subtle hover:text-fg"
            >
              <FiFlag aria-hidden="true" /> Report outdated info or a broken link
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ToolDetail;
