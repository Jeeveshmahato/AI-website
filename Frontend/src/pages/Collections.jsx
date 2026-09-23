import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiColumns } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolCard from "../Components/ToolCard";
import CollectionCard from "../Components/CollectionCard";
import NotFound from "./NotFound";
import collections, { getCollection } from "../data/collections";
import { useTools } from "../lib/toolsStore";
import { resolveKeys, MAX_COMPARE } from "../lib/personal";
import { cn, toolKey } from "../lib/utils";

export const CollectionsIndex = () => {
  const { tools } = useTools();
  return (
    <div className="container-page pt-10 sm:pt-14">
      <Seo title="Curated AI tool stacks" description="Hand-picked AI toolkits for creators, developers, students, marketers and founders." />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Curated stacks</h1>
        <p className="mt-3 text-slate-400">
          Not sure where to start? These hand-picked toolkits cover the essentials for common roles.
        </p>
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="container-page pt-8 sm:pt-12">
      <Seo title={collection.title} description={collection.description} />
      <Link to="/stacks" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
        <FiArrowLeft aria-hidden="true" /> All stacks
      </Link>

      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <span className={cn("flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-lg", collection.color)}>
          <collection.icon aria-hidden="true" />
        </span>
        <div className="max-w-3xl flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{collection.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-slate-400">{collection.description}</p>
        </div>
        {items.length > 1 && (
          <Link
            to={`/compare?tools=${items.slice(0, MAX_COMPARE).map(toolKey).join(",")}`}
            className="btn-secondary shrink-0 self-start"
          >
            <FiColumns aria-hidden="true" /> Compare top {Math.min(MAX_COMPARE, items.length)}
          </Link>
        )}
      </header>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tool) => (
          <li key={toolKey(tool)}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ol>

      <section className="mt-24" aria-labelledby="more-stacks">
        <h2 id="more-stacks" className="text-2xl font-bold tracking-tight text-white">
          More stacks
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <CollectionCard key={c.slug} collection={c} tools={tools} />
          ))}
        </div>
      </section>
    </div>
  );
};
