import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiArrowRight, FiTarget, FiEye, FiUsers } from "react-icons/fi";
import Seo from "../Components/Seo";

const PRINCIPLES = [
  { icon: FiTarget, title: "Useful over hyped", text: "We list tools that solve real problems today, not vaporware or thin wrappers." },
  { icon: FiEye, title: "Transparent", text: "Clear pricing labels, no hidden paid placements, and links straight to the source." },
  { icon: FiUsers, title: "Community-powered", text: "Anyone can suggest a tool, and upvotes help the best ones rise to the top." },
];

const CRITERIA = [
  "The product is live and publicly accessible",
  "It uses AI in a meaningful way, not just a label",
  "Pricing is clear and accurately represented",
  "The website is secure (https) and trustworthy",
  "It isn't a duplicate of an existing listing",
];

const About = () => (
  <div className="container-page pt-10 sm:pt-14">
    <Seo title="About" description="Why we built AI Tools Hub and how we curate the tools in our directory." />

    <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">About us</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Helping everyone find <span className="text-gradient">AI that works</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-slate-400">
        New AI tools launch every day, and most lists are either outdated or pay-to-play. AI Tools Hub is a clean, honest,
        hand-curated directory that helps you find the right tool fast.
      </p>
    </motion.header>

    <section className="mt-20 grid gap-4 md:grid-cols-3" aria-label="Our principles">
      {PRINCIPLES.map((p, i) => (
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="card p-7"
        >
          <p.icon className="text-2xl text-violet-300" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-white">{p.title}</h2>
          <p className="mt-2 leading-relaxed text-slate-400">{p.text}</p>
        </motion.div>
      ))}
    </section>

    <section className="mt-24 grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="eyebrow">Our curation process</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Every listing is reviewed by a person</h2>
        <p className="mt-4 leading-relaxed text-slate-400">
          Submissions go into a moderation queue. Before a tool appears in the directory, we check it against a short list of
          standards so that what you find here is worth clicking.
        </p>
      </div>
      <ul className="card space-y-4 p-7">
        {CRITERIA.map((c) => (
          <li key={c} className="flex gap-3 text-slate-300">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-300">
              <FiCheck aria-hidden="true" />
            </span>
            {c}
          </li>
        ))}
      </ul>
    </section>

    <section className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/25 via-violet-600/15 to-fuchsia-600/20 px-6 py-14 text-center sm:px-12">
      <h2 className="text-3xl font-bold tracking-tight text-white">Know a tool we should list?</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-300">Help the community discover it. Submitting takes about two minutes.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/submit" className="btn-primary">
          Submit a tool <FiArrowRight aria-hidden="true" />
        </Link>
        <Link to="/aitools" className="btn-secondary">
          Explore the directory
        </Link>
      </div>
    </section>
  </div>
);

export default About;
