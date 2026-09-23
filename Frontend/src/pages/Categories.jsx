import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import { useTools } from "../lib/toolsStore";
import { CATEGORIES } from "../lib/constants";
import { sortTools } from "../lib/filters";
import { cn } from "../lib/utils";

const Categories = () => {
  const { tools } = useTools();

  const byCategory = useMemo(() => {
    const map = {};
    sortTools(tools, "featured").forEach((t) => (map[t.category] ??= []).push(t));
    return map;
  }, [tools]);

  return (
    <div className="container-page pt-10 sm:pt-14">
      <Seo title="AI tool categories" description="Browse AI tools by category: chatbots, image and video generation, coding, writing, research, productivity and more." />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Browse by category</h1>
        <p className="mt-3 text-slate-400">Every tool in the directory, organized by what it helps you do.</p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const list = byCategory[cat.name] || [];
          return (
            <Link
              key={cat.name}
              to={`/aitools?category=${encodeURIComponent(cat.name)}`}
              className="group card flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-white/15"
            >
              <div className="flex items-center gap-4">
                <span className={cn("flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white shadow-lg", cat.color)}>
                  <cat.icon aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold text-white">{cat.name}</h2>
                  <p className="text-sm text-slate-400">
                    {list.length} {list.length === 1 ? "tool" : "tools"}
                  </p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm text-slate-400">{cat.blurb}</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {list.slice(0, 5).map((t) => (
                    <ToolLogo key={t._id || t.slug} tool={t} size="sm" className="size-8 rounded-lg ring-2 ring-ink-850" />
                  ))}
                </div>
                <FiArrowRight className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
