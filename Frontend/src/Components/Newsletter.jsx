import { useId, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

const Newsletter = () => {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await api.subscribe(email.trim());
      setStatus("done");
      setMessage(res?.message || "You're subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.fieldErrors?.email || err.message);
    }
  };

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-sm text-success" role="status">
        <FiCheck aria-hidden="true" /> {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className={cn("input min-w-0 flex-1 py-2", status === "error" && "input-error")}
          aria-invalid={status === "error"}
          aria-describedby={`${id}-msg`}
        />
        <button type="submit" className="btn-primary shrink-0" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p id={`${id}-msg`} className={cn("mt-2 text-xs", status === "error" ? "text-danger" : "text-fg-subtle")}>
        {status === "error" ? message : "No spam. We only email when there's something worth trying."}
      </p>
    </form>
  );
};

export default Newsletter;
