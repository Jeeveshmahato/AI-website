import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiEye, FiShield, FiUsers, FiZap } from "react-icons/fi";
import Seo from "../Components/Seo";
import ToolCard from "../Components/ToolCard";
import { api } from "../lib/api";
import { CATEGORY_NAMES, PRICING, PRICING_DOT } from "../lib/constants";
import { cn, isHttpUrl } from "../lib/utils";

const EMPTY = {
  name: "",
  link: "",
  tagline: "",
  category: "",
  price: "Freemium",
  description: "",
  tags: "",
  image: "",
  submitterEmail: "",
  website: "", // honeypot
};

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Tool name must be at least 2 characters.";
  if (!isHttpUrl(v.link)) e.link = "Enter the full website URL, including https://";
  if (!v.category) e.category = "Choose the category that fits best.";
  if (v.description.trim().length < 20) e.description = "Describe the tool in at least 20 characters.";
  if (v.image && !isHttpUrl(v.image)) e.image = "Logo must be an https:// image URL, or leave it blank.";
  if (v.submitterEmail && !/^\S+@\S+\.\S+$/.test(v.submitterEmail)) e.submitterEmail = "Enter a valid email or leave it blank.";
  return e;
}

const Field = ({ id, label, error, hint, optional, children }) => (
  <div>
    <label htmlFor={id} className="label">
      {label} {optional && <span className="font-normal text-fg-subtle">(optional)</span>}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-xs text-fg-subtle">{hint}</p>
    )}
  </div>
);

const PERKS = [
  { icon: FiUsers, text: "Reach people actively searching for AI tools" },
  { icon: FiZap, text: "Free listing, no account required" },
  { icon: FiShield, text: "Every submission is reviewed by a human" },
];

const Submit = () => {
  const id = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [formError, setFormError] = useState("");

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const inputProps = (name) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    className: cn("input", errors[name] && "input-error"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await api.submitTool({
        ...values,
        name: values.name.trim(),
        link: values.link.trim(),
        tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("idle");
      const fieldErrors = err.fieldErrors || {};
      setErrors(fieldErrors);
      setFormError(Object.keys(fieldErrors).length ? "Please fix the highlighted fields." : err.message);
    }
  };

  const preview = {
    name: values.name.trim() || "Your tool name",
    tagline: values.tagline.trim() || values.description.trim() || "A short, punchy description of what your tool does.",
    category: values.category || "Category",
    price: values.price,
    link: isHttpUrl(values.link) ? values.link : "",
    image: isHttpUrl(values.image) ? values.image : "",
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };

  if (status === "done") {
    return (
      <div className="container-page flex max-w-xl flex-col items-start pt-20">
        <Seo title="Submission received" noindex />
        <FiCheckCircle className="text-2xl text-success" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg">Submission received</h1>
        <p className="mt-2 text-fg-muted">
          <span className="text-fg">{values.name}</span> is in our review queue. Once approved, it will appear in the directory.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setValues(EMPTY);
              setStatus("idle");
            }}
            className="btn-secondary"
          >
            Submit another
          </button>
          <Link to="/aitools" className="btn-primary">
            Explore tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pt-10">
      <Seo title="Submit an AI tool" description="List your AI tool on AI Tools Hub for free and reach people actively looking for AI tools." />
      <header className="border-b border-line pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Submit a tool</h1>
        <p className="mt-1 text-fg-muted">Built something great, or found a gem we're missing? Tell us about it.</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
          {PERKS.map((p) => (
            <li key={p.text} className="flex items-center gap-2">
              <p.icon className="text-fg-subtle" aria-hidden="true" /> {p.text}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-5">
        <form onSubmit={onSubmit} noValidate className="space-y-6 lg:col-span-3">
          {formError && (
            <div role="alert" className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              {formError}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id={`${id}-name`} label="Tool name" error={errors.name}>
              <input {...inputProps("name")} maxLength={100} placeholder="e.g. Acme Writer" autoComplete="off" />
            </Field>
            <Field id={`${id}-link`} label="Website" error={errors.link}>
              <input {...inputProps("link")} type="url" inputMode="url" placeholder="https://acme.ai" />
            </Field>
          </div>

          <Field id={`${id}-tagline`} label="Tagline" optional error={errors.tagline} hint={`${values.tagline.length}/140 · One line that sells it`}>
            <input {...inputProps("tagline")} maxLength={140} placeholder="Write blog posts 10x faster" />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id={`${id}-category`} label="Category" error={errors.category}>
              <select {...inputProps("category")}>
                <option value="" disabled>
                  Select a category
                </option>
                {CATEGORY_NAMES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <fieldset>
              <legend className="label">Pricing</legend>
              <div className="grid grid-cols-3 gap-2">
                {PRICING.map((p) => (
                  <label
                    key={p}
                    className={cn(
                      "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                      values.price === p ? "border-fg bg-surface font-medium text-fg" : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
                    )}
                  >
                    <input type="radio" name="price" value={p} checked={values.price === p} onChange={set("price")} className="sr-only" />
                    <span className={cn("size-1.5 rounded-full", PRICING_DOT[p])} aria-hidden="true" />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <Field id={`${id}-description`} label="Description" error={errors.description} hint={`${values.description.length}/2000 · What does it do, who is it for, what makes it different?`}>
            <textarea {...inputProps("description")} rows={5} maxLength={2000} className={cn("input resize-y", errors.description && "input-error")} />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id={`${id}-tags`} label="Tags" optional hint="Comma-separated, up to 8">
              <input {...inputProps("tags")} placeholder="writing, seo, blog" />
            </Field>
            <Field id={`${id}-image`} label="Logo URL" optional error={errors.image} hint="Leave blank to use the site's icon">
              <input {...inputProps("image")} type="url" inputMode="url" placeholder="https://acme.ai/logo.png" />
            </Field>
          </div>

          <Field id={`${id}-submitterEmail`} label="Your email" optional error={errors.submitterEmail} hint="Only used to contact you about this listing. Never shown publicly.">
            <input {...inputProps("submitterEmail")} type="email" autoComplete="email" placeholder="you@example.com" />
          </Field>

          {/* Honeypot: hidden from people, irresistible to bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${id}-website`}>Leave this empty</label>
            <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
          </div>

          <button type="submit" className="btn-primary h-11 w-full" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting…" : "Submit for review"}
          </button>
          <p className="text-center text-xs text-fg-subtle">
            By submitting you confirm the information is accurate and you're allowed to share it.
          </p>
        </form>

        <aside className="lg:col-span-2">
          <div className="rounded-xl border border-line bg-surface-2 p-5 lg:sticky lg:top-20">
            <p className="flex items-center gap-2 text-xs font-medium text-fg-subtle">
              <FiEye aria-hidden="true" /> Live preview
            </p>
            <div className="mt-3" inert>
              <ToolCard key={`${preview.link}|${preview.image}`} tool={preview} />
            </div>
            <p className="mt-4 text-sm text-fg-subtle">This is how your tool will appear in the directory once approved.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Submit;
