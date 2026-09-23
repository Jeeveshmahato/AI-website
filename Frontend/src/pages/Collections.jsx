import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiColumns } from "react-icons/fi";
import Seo from "../Components/Seo";
import { ToolRow } from "../Components/ToolCard";
import CollectionCard from "../Components/CollectionCard";
import NotFound from "./NotFound";
import collections, { getCollection } from "../data/collections";
import { useTools } from "../lib/toolsStore";
import { resolveKeys, MAX_COMPARE } from "../lib/personal";
import { toolKey } from "../lib/utils";

export const CollectionsIndex = () => {
  const { tools } = useTools();
  return (
    <div className="container-page pt-10">
      <Seo title="Curated AI tool stacks" description="Hand-picked AI toolkits for creators, developers, students, marketers and founders." />
      <header className="border-b border-line pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Stacks</h1>
        <p className="mt-1 max-w-2xl text-fg-muted">Hand-picked toolkits for common roles. A good place to start if you're new to AI tools.</p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <CollectionCard key={c.slug} collection={c} tools={tools} />
        ))}
      </div>
    </div>
  );
};

export const CollectionDetail = () => {
  const { slug } = useParams();
  const { tools } = useTools();
  const collection = getCollection(slug);
  if (!collection) return <NotFound />;

  const items = resolveKeys(collection.tools, tools);
  const others = collections.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <div className="container-page pt-8">
      <Seo title={collection.title} description={collection.description} />
      <Link to="/stacks" className="inline-flex items-center gap-1.5 text-sm text-fg-subtle hover:text-fg">
        <FiArrowLeft aria-hidden="true" /> Stacks
      </Link>

      <header className="mt-6 flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="flex size-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-lg text-fg-muted">
            <collection.icon aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg">{collection.title}</h1>
          <p className="mt-2 leading-relaxed text-fg-muted">{collection.description}</p>
        </div>
        {items.length > 1 && (
          <Link to={`/compare?tools=${items.slice(0, MAX_COMPARE).map(toolKey).join(",")}`} className="btn-secondary shrink-0">
            <FiColumns aria-hidden="true" /> Compare top {Math.min(MAX_COMPARE, items.length)}
          </Link>
        )}
      </header>

      <ol className="mt-4 -mx-2 max-w-3xl divide-y divide-line sm:-mx-3">
        {items.map((tool, i) => (
          <li key={toolKey(tool)}>
            <ToolRow tool={tool} rank={i + 1} />
          </li>
        ))}
      </ol>

      <section className="mt-16 border-t border-line pt-8" aria-labelledby="more-stacks">
        <h2 id="more-stacks" className="section-title">
          More stacks
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <CollectionCard key={c.slug} collection={c} tools={tools} />
          ))}
        </div>
      </section>
    </div>
  );
};
