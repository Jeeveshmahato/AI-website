import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import { useTools } from "../lib/toolsStore";
import { CATEGORIES } from "../lib/constants";
import { sortTools } from "../lib/filters";
import { toolKey, toolPath } from "../lib/utils";

const Categories = () => {
  const { tools } = useTools();

  const byCategory = useMemo(() => {
    const map = {};
    sortTools(tools, "featured").forEach((t) => (map[t.category] ??= []).push(t));
    return map;
  }, [tools]);

  return (
    <div className="container-page pt-10">
      <Seo title="AI tool categories" description="Browse AI tools by category: chatbots, image and video generation, coding, writing, research, productivity and more." />
      <header className="border-b border-line pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Categories</h1>
        <p className="mt-1 text-fg-muted">Every tool in the directory, organized by what it helps you do.</p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const list = byCategory[cat.name] || [];
          return (
            <section key={cat.name} className="card flex flex-col" aria-labelledby={`cat-${cat.short}`}>
              <div className="flex items-center gap-3 border-b border-line p-4">
                <span className="flex size-8 items-center justify-center rounded-md border border-line bg-surface-2 text-fg-muted">
                  <cat.icon aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id={`cat-${cat.short}`} className="font-medium text-fg">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-fg-subtle">{cat.blurb}</p>
                </div>
                <span className="font-mono text-xs text-fg-subtle">{list.length}</span>
              </div>
              <ul className="flex-1 p-2">
                {list.slice(0, 4).map((t) => (
                  <li key={toolKey(t)}>
                    <Link to={toolPath(t)} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                      <ToolLogo tool={t} size="xs" />
                      <span className="truncate">{t.name}</span>
                    </Link>
                  </li>
                ))}
                {list.length === 0 && <li className="px-2 py-1.5 text-sm text-fg-subtle">No tools yet</li>}
              </ul>
              <Link
                to={`/aitools?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between border-t border-line px-4 py-2.5 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                View all {cat.short.toLowerCase()} tools <FiArrowRight aria-hidden="true" />
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
