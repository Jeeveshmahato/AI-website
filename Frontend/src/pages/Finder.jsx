import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiBookmark, FiColumns, FiRotateCcw, FiShare2, FiCheck } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolLogo from "../Components/ToolLogo";
import PriceTag from "../Components/PriceTag";
import { ToolRow, VisitLink } from "../Components/ToolCard";
import { useToast } from "../Components/Toast";
import { useTools } from "../lib/toolsStore";
import { useSaved } from "../lib/personal";
import { sortTools } from "../lib/filters";
import { getCategory } from "../lib/constants";
import { cn, formatCount, toolKey, toolPath } from "../lib/utils";

const TASKS = [
  { value: "Chatbot", label: "Chat and ask questions" },
  { value: "Writing Assistant", label: "Write or edit text" },
  { value: "Image Generation", label: "Create images" },
  { value: "Video Generation", label: "Make or edit videos" },
  { value: "Audio & Voice", label: "Voice, music or audio" },
  { value: "Code Assistance", label: "Write code or build apps" },
  { value: "Research", label: "Research a topic" },
  { value: "Productivity", label: "Save time at work" },
  { value: "Design", label: "Design graphics or UI" },
  { value: "Marketing", label: "Market a product" },
  { value: "Translation", label: "Translate text" },
];

const BUDGETS = [
  { value: "free", label: "Free only", hint: "No payment, ever", prices: ["Free"] },
  { value: "start-free", label: "Free to start", hint: "Free plan, upgrade later", prices: ["Free", "Freemium"] },
  { value: "any", label: "Happy to pay", hint: "Best tool, any price", prices: ["Free", "Freemium", "Paid"] },
];

const PRIORITIES = [
  { value: "popular", label: "What people love", hint: "Most upvoted by the community" },
  { value: "featured", label: "Editor's picks", hint: "Our curated favourites" },
  { value: "newest", label: "Something new", hint: "Recently added tools" },
];

const STEPS = ["task", "budget", "priority"];

// Plain-language reasons shown with each recommendation.
function reasons(tool, budget) {
  const list = [];
  if (tool.price === "Free") list.push("Completely free");
  else if (tool.price === "Freemium") list.push("Free plan available");
  else if (budget !== "any") list.push("Paid, but the closest match");
  if (tool.featured) list.push("Editor's pick");
  if (tool.upvotes > 0) list.push(`${formatCount(tool.upvotes)} upvotes`);
  if (tool.tags?.length) list.push(`Good for ${tool.tags.slice(0, 2).join(" and ")}`);
  return list;
}

const Option = ({ selected, onClick, title, hint, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={cn(
      "flex w-full items-center gap-3 rounded-xl border bg-surface p-4 text-left transition-colors",
      selected ? "border-fg" : "border-line hover:border-line-strong"
    )}
  >
    {Icon && (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-fg-muted">
        <Icon aria-hidden="true" />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block font-medium text-fg">{title}</span>
      {hint && <span className="mt-0.5 block text-sm text-fg-subtle">{hint}</span>}
    </span>
    {selected && <FiCheck className="shrink-0 text-fg" aria-hidden="true" />}
  </button>
);

const Finder = () => {
  const { tools } = useTools();
  const { saveMany } = useSaved();
  const toast = useToast();
  const [params, setParams] = useSearchParams();

  const answers = {
    task: TASKS.some((t) => t.value === params.get("task")) ? params.get("task") : null,
    budget: BUDGETS.some((b) => b.value === params.get("budget")) ? params.get("budget") : null,
    priority: PRIORITIES.some((p) => p.value === params.get("priority")) ? params.get("priority") : null,
  };
  const step = STEPS.findIndex((s) => !answers[s]); // -1 = all answered
  const done = step === -1;

  // Each answer is a history entry, so the browser back button steps back through the quiz.
  const answer = (key, value) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    STEPS.slice(STEPS.indexOf(key) + 1).forEach((k) => next.delete(k));
    setParams(next);
  };
  const back = () => {
    const next = new URLSearchParams(params);
    const current = done ? STEPS.length - 1 : step - 1;
    STEPS.slice(Math.max(current, 0)).forEach((k) => next.delete(k));
    setParams(next);
  };

  const { picks, relaxed } = useMemo(() => {
    if (!done) return { picks: [], relaxed: false };
    const allowed = BUDGETS.find((b) => b.value === answers.budget).prices;
    const inCategory = tools.filter((t) => t.category === answers.task);
    const ranked = sortTools(inCategory.filter((t) => allowed.includes(t.price)), answers.priority);
    if (ranked.length >= 3 || answers.budget === "any") return { picks: ranked.slice(0, 3), relaxed: false };
    // Too few within budget: top up with the best of the rest, and say so.
    const rest = sortTools(inCategory.filter((t) => !allowed.includes(t.price)), answers.priority);
    return { picks: [...ranked, ...rest].slice(0, 3), relaxed: rest.length > 0 && ranked.length < 3 };
  }, [done, tools, answers.task, answers.budget, answers.priority]);

  const [best, ...others] = picks;
  const taskLabel = TASKS.find((t) => t.value === answers.task)?.label;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link to these results copied");
    } catch {
      toast("Couldn't copy the link", "error");
    }
  };

  return (
    <div className="container-page max-w-3xl pt-10">
      <Seo title="Tool Finder" description="Answer three quick questions and get the best AI tools for your task and budget." />

      <header className="border-b border-line pb-6">
        <p className="font-mono text-xs text-fg-subtle">{done ? "Your results" : `Question ${step + 1} of ${STEPS.length}`}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">
          {done ? `Best tools to ${taskLabel.toLowerCase()}` : "Find the right tool"}
        </h1>
        {!done && <p className="mt-1 text-fg-muted">Three quick questions. No sign-up.</p>}
        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={cn("h-1 flex-1 rounded-full", done || i < step ? "bg-fg" : i === step ? "bg-fg-subtle" : "bg-line")} />
          ))}
        </div>
      </header>

      {step > 0 || done ? (
        <button type="button" onClick={back} className="btn-ghost mt-4 -ml-3 min-h-9 px-3">
          <FiArrowLeft aria-hidden="true" /> Back
        </button>
      ) : null}

      {step === 0 && (
        <section className="mt-6" aria-labelledby="q-task">
          <h2 id="q-task" className="text-lg font-medium text-fg">
            What do you want to do?
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {TASKS.map((t) => (
              <Option key={t.value} icon={getCategory(t.value).icon} title={t.label} selected={answers.task === t.value} onClick={() => answer("task", t.value)} />
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-4" aria-labelledby="q-budget">
          <h2 id="q-budget" className="text-lg font-medium text-fg">
            What's your budget?
          </h2>
          <div className="mt-4 grid gap-2">
            {BUDGETS.map((b) => (
              <Option key={b.value} title={b.label} hint={b.hint} selected={answers.budget === b.value} onClick={() => answer("budget", b.value)} />
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-4" aria-labelledby="q-priority">
          <h2 id="q-priority" className="text-lg font-medium text-fg">
            What matters most?
          </h2>
          <div className="mt-4 grid gap-2">
            {PRIORITIES.map((p) => (
              <Option key={p.value} title={p.label} hint={p.hint} selected={answers.priority === p.value} onClick={() => answer("priority", p.value)} />
            ))}
          </div>
        </section>
      )}

      {done && (
        <section className="mt-4" aria-label="Recommendations">
          {!best ? (
            <div className="rounded-xl border border-dashed border-line-strong px-6 py-12 text-center">
              <h2 className="font-semibold text-fg">No tools in this category yet</h2>
              <p className="mt-1 text-sm text-fg-muted">Try another task, or suggest a tool we should list.</p>
              <div className="mt-5 flex justify-center gap-2">
                <button type="button" onClick={() => setParams({})} className="btn-secondary">
                  Start over
                </button>
                <Link to="/submit" className="btn-primary">
                  Suggest a tool
                </Link>
              </div>
            </div>
          ) : (
            <>
              {relaxed && (
                <p className="mb-4 rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-fg-muted">
                  There aren't enough options in your budget yet, so we've included the closest matches.
                </p>
              )}

              <article className="card relative p-5 shadow-card sm:p-6">
                <p className="text-xs font-medium text-accent">Best match</p>
                <div className="mt-3 flex items-start gap-4">
                  <ToolLogo tool={best} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-fg">
                      <Link to={toolPath(best)} className="hover:underline">
                        {best.name}
                      </Link>
                    </h2>
                    {best.tagline && <p className="mt-0.5 text-fg-muted">{best.tagline}</p>}
                    <PriceTag price={best.price} className="mt-2" />
                  </div>
                </div>
                <ul className="mt-5 space-y-1.5">
                  {reasons(best, answers.budget).map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-fg">
                      <FiCheck className="shrink-0 text-success" aria-hidden="true" /> {r}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  <VisitLink tool={best} className="btn-primary">
                    Try {best.name}
                  </VisitLink>
                  <Link to={toolPath(best)} className="btn-secondary">
                    Details
                  </Link>
                </div>
              </article>

              {others.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-sm font-medium text-fg-subtle">Also worth a look</h2>
                  <ul className="mt-2 -mx-2 divide-y divide-line sm:-mx-3">
                    {others.map((t) => (
                      <li key={toolKey(t)}>
                        <ToolRow tool={t} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
                {picks.length > 1 && (
                  <Link to={`/compare?tools=${picks.map(toolKey).join(",")}`} className="btn-secondary">
                    <FiColumns aria-hidden="true" /> Compare these
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const added = saveMany(picks);
                    toast(added ? `Saved ${added} ${added === 1 ? "tool" : "tools"}` : "Already saved");
                  }}
                  className="btn-secondary"
                >
                  <FiBookmark aria-hidden="true" /> Save all
                </button>
                <button type="button" onClick={copyLink} className="btn-secondary">
                  <FiShare2 aria-hidden="true" /> Share results
                </button>
                <button type="button" onClick={() => setParams({})} className="btn-ghost">
                  <FiRotateCcw aria-hidden="true" /> Start over
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Finder;
