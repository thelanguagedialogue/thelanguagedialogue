"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";

// The inquiry form. Static export, so Netlify's form handler takes the POST: it accepts a
// urlencoded body on any path as long as it carries form-name and a plain HTML file in the
// deploy declares the form. That file is public/__forms.html; every name here matches it.

const FORM_NAME = "inquiry";

const LANGUAGES = ["Italian", "Spanish", "French (beginners)", "Not sure yet"];
const LEVELS = ["Complete beginner", "I know some basics", "Intermediate", "Advanced"];
const FORMATS = ["One to one", "Small group", "Either"];
const MODES = ["In person in Atlanta", "Online", "Either"];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

type Values = Record<string, string>;
const EMPTY: Values = { name: "", email: "", phone: "", language: "", level: "", format: "", mode: "", availability: "", message: "" };

function validate(v: Values) {
  const e: Record<string, string> = {};
  if (!v.name.trim()) e.name = "Please add your name.";
  if (!v.email.trim()) e.email = "Please add an email so I can reply.";
  else if (!isEmail(v.email.trim())) e.email = "That email address does not look right.";
  if (!v.language) e.language = "Which language?";
  if (!v.message.trim()) e.message = "A sentence is enough.";
  return e;
}

export default function InquiryForm({ email, gaId }: { email: string; gaId: string }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const set = (name: string) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    setValues((p) => ({ ...p, [name]: v }));
    setErrors((p) => { if (!p[name]) return p; const n = { ...p }; delete n[name]; return n; });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) { refs.current[first]?.focus(); return; }
    setStatus("sending");
    const body = new URLSearchParams({ "form-name": FORM_NAME, ...values }).toString();
    try {
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (!res.ok) throw new Error(String(res.status));
      track(gaId, "generate_lead", { lead_source: FORM_NAME });
      router.push("/thanks/");
    } catch {
      setStatus("error");
    }
  }

  const mailto = `mailto:${email}?subject=${encodeURIComponent("Lessons inquiry")}&body=${encodeURIComponent(
    Object.entries(values).filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`).join("\n"))}`;

  const Err = ({ k }: { k: string }) => errors[k] ? <span className="err" id={`${k}-err`} role="alert">{errors[k]}</span> : null;
  const a11y = (k: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form name={FORM_NAME} method="POST" action="/thanks/" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" autoComplete="name" value={values.name} onChange={set("name")} ref={(el) => { refs.current.name = el; }} {...a11y("name")} />
        <Err k="name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={set("email")} ref={(el) => { refs.current.email = el; }} {...a11y("email")} />
        <Err k="email" />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone <span className="font-normal text-muted">(optional)</span></label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} />
        <span className="hint">If you prefer a quick call or a text.</span>
      </div>
      <div className="field">
        <label htmlFor="language">Language</label>
        <select id="language" name="language" value={values.language} onChange={set("language")} ref={(el) => { refs.current.language = el; }} {...a11y("language")}>
          <option value="">Choose one</option>
          {LANGUAGES.map((o) => <option key={o}>{o}</option>)}
        </select>
        <Err k="language" />
      </div>
      <div className="field">
        <label htmlFor="level">Your level</label>
        <select id="level" name="level" value={values.level} onChange={set("level")}>
          <option value="">Choose one</option>
          {LEVELS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="format">Lessons</label>
        <select id="format" name="format" value={values.format} onChange={set("format")}>
          <option value="">Choose one</option>
          {FORMATS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="mode">Where</label>
        <select id="mode" name="mode" value={values.mode} onChange={set("mode")}>
          <option value="">Choose one</option>
          {MODES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="availability">When are you usually free?</label>
        <input id="availability" name="availability" placeholder="e.g. weekday evenings" value={values.availability} onChange={set("availability")} />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="message">Why do you want to learn?</label>
        <textarea id="message" name="message" value={values.message} onChange={set("message")} ref={(el) => { refs.current.message = el; }} {...a11y("message")} placeholder="A trip, family, work, or just because. One or two sentences is plenty." />
        <Err k="message" />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send my inquiry"}</button>
        <span className="text-sm text-muted">Valentina reads every message herself.</span>
      </div>
      {status === "error" && (
        <p className="sm:col-span-2 text-red" role="alert">
          Something went wrong on the way. <a className="underline" href={mailto}>Send it as an email instead</a>, everything you typed is already in it.
        </p>
      )}
    </form>
  );
}
