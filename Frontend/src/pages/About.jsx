import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import Seo from "../Components/Seo";
import { useTools } from "../lib/toolsStore";

const PRINCIPLES = [
  { title: "Useful over hyped", text: "We list tools that solve real problems today, not waitlists or thin wrappers." },
  { title: "Honest labels", text: "Every tool is marked Free, Freemium or Paid, and links go straight to the source." },
  { title: "Community signal", text: "Anyone can suggest a tool. Upvotes help the genuinely useful ones rise." },
];

const CRITERIA = [
  "The product is live and publicly accessible",
  "It uses AI in a meaningful way, not just as a label",
  "Pricing is clear and accurately represented",
  "The website is secure (https) and trustworthy",
  "It isn't a duplicate of an existing listing",
];

const About = () => {
  const { tools } = useTools();
  return (
    <div className="container-page max-w-3xl pt-14">
      <Seo title="About" description="Why AI Tools Hub exists and how tools are reviewed before they're listed." />

      <h1 className="text-4xl font-semibold tracking-tight text-fg">About AI Tools Hub</h1>
      <p className="mt-5 text-lg leading-relaxed text-fg-muted">
        New AI tools launch every day, and most lists are either outdated or pay-to-play. AI Tools Hub is a small, independent
        directory with one goal: help you find a tool that actually fits the job, quickly.
      </p>

      <dl className="mt-10 grid grid-cols-3 divide-x divide-line rounded-xl border border-line">
        {[
          { label: "Tools listed", value: tools.length },
          { label: "Categories", value: new Set(tools.map((t) => t.category)).size },
          { label: "Account needed", value: "None" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-5">
            <dt className="text-xs text-fg-subtle">{s.label}</dt>
            <dd className="mt-1 font-mono text-2xl font-medium tabular-nums text-fg">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-14" aria-labelledby="principles">
        <h2 id="principles" className="section-title">
          What we care about
        </h2>
        <dl className="mt-5 divide-y divide-line border-y border-line">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="font-medium text-fg">{p.title}</dt>
              <dd className="text-fg-muted sm:col-span-2">{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14" aria-labelledby="review">
        <h2 id="review" className="section-title">
          How tools are reviewed
        </h2>
        <p className="mt-3 leading-relaxed text-fg-muted">
          Submissions go into a moderation queue. Before a tool appears in the directory, a person checks it against these
          standards:
        </p>
        <ul className="mt-5 space-y-3">
          {CRITERIA.map((c) => (
            <li key={c} className="flex gap-3 text-fg">
              <FiCheck className="mt-1 shrink-0 text-success" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 flex flex-col items-start gap-4 rounded-xl border border-line bg-surface-2 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-fg">Know a tool we should list?</h2>
          <p className="mt-1 text-sm text-fg-muted">Submitting takes about two minutes.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/contact" className="btn-secondary">
            Contact
          </Link>
          <Link to="/submit" className="btn-primary">
            Submit a tool
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
