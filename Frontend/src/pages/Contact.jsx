import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiMessageCircle, FiPlusCircle, FiFlag } from "react-icons/fi";
import Seo from "../Components/Seo";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

const TOPICS = [
  { icon: FiPlusCircle, title: "List your tool", text: "Use the submission form for the fastest review.", to: "/submit", cta: "Submit a tool" },
  { icon: FiFlag, title: "Report an issue", text: "Broken link or outdated pricing? Let us know below.", to: null },
  { icon: FiMessageCircle, title: "Partnerships", text: "Sponsorships, collaborations and press enquiries.", to: null },
];

const Contact = () => {
  const id = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      await api.contact(values);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setErrors(err.fieldErrors || {});
      setFormError(err.message);
    }
  };

  const field = (name, props = {}) => (
    <>
      <input
        id={`${id}-${name}`}
        name={name}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${id}-${name}-err` : undefined}
        className={cn("input", errors[name] && "input-error")}
        {...props}
      />
      {errors[name] && (
        <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-rose-300">
          {errors[name]}
        </p>
      )}
    </>
  );

  return (
    <div className="container-page pt-10 sm:pt-14">
      <Seo title="Contact us" description="Get in touch with the AI Tools Hub team about listings, corrections or partnerships." />
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Get in touch</h1>
          <p className="mt-4 leading-relaxed text-slate-400">
            Questions, feedback or corrections? We read every message and usually reply within a couple of business days.
          </p>
          <ul className="mt-10 space-y-4">
            {TOPICS.map((t) => (
              <li key={t.title} className="card flex gap-4 p-5">
                <t.icon className="mt-0.5 shrink-0 text-xl text-indigo-300" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-white">{t.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{t.text}</p>
                  {t.to && (
                    <Link to={t.to} className="mt-2 inline-block text-sm font-medium text-indigo-300 hover:text-indigo-200">
                      {t.cta} →
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          {status === "done" ? (
            <div className="card flex flex-col items-center px-6 py-16 text-center" role="status">
              <FiCheckCircle className="text-5xl text-emerald-300" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold text-white">Message sent</h2>
              <p className="mt-2 text-slate-400">Thanks, {values.name.split(" ")[0]}! We'll reply to {values.email} soon.</p>
              <button
                type="button"
                className="btn-secondary mt-8"
                onClick={() => {
                  setValues(EMPTY);
                  setStatus("idle");
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
              {formError && (
                <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                  {formError}
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-name`} className="label">
                    Name
                  </label>
                  {field("name", { autoComplete: "name", maxLength: 100 })}
                </div>
                <div>
                  <label htmlFor={`${id}-email`} className="label">
                    Email
                  </label>
                  {field("email", { type: "email", autoComplete: "email" })}
                </div>
              </div>
              <div>
                <label htmlFor={`${id}-subject`} className="label">
                  Subject <span className="font-normal text-slate-500">(optional)</span>
                </label>
                {field("subject", { maxLength: 150 })}
              </div>
              <div>
                <label htmlFor={`${id}-message`} className="label">
                  Message
                </label>
                <textarea
                  id={`${id}-message`}
                  rows={6}
                  maxLength={5000}
                  value={values.message}
                  onChange={set("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? `${id}-message-err` : undefined}
                  className={cn("input resize-y", errors.message && "input-error")}
                />
                {errors.message && (
                  <p id={`${id}-message-err`} className="mt-1.5 text-sm text-rose-300">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor={`${id}-website`}>Leave this empty</label>
                <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
              </div>
              <button type="submit" className="btn-primary min-h-12 w-full" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
