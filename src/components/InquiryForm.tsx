"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";

// The inquiry form, with the fields Valentina asked for on the call: name, email, phone, language,
// level, one-on-one or group, online or in person, preferred days and times, why they want to learn.
//
// Netlify Forms takes the POST. The site is a static export, so Netlify learns the form from the
// plain file public/__forms.html at deploy time, and every field name here must match that file.
// Submissions are posted to that same file path, which works with or without Netlify's Next.js
// runtime. Netlify then emails each inquiry to the address set under Forms > Notifications.

const FORM_NAME = "inquiry";

const LANGUAGES = ["Italian", "Spanish", "French (beginners)", "Not sure yet"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Business", "Not sure yet"];
const FORMATS = ["One-on-one", "Small group", "Not sure yet"];
const MODES = ["In person, Atlanta metro area", "Online", "Either is fine"];

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

export default function InquiryForm({ email, gaId, button = "Send my message", note }: { email: string; gaId: string; button?: string; note?: string }) {
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
    const trap = (e.currentTarget.elements.namedItem("bot-field") as HTMLInputElement | null)?.value ?? "";
    const body = new URLSearchParams({ "form-name": FORM_NAME, "bot-field": trap, ...values }).toString();
    try {
      const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (!res.ok) throw new Error(String(res.status));
      track(gaId, "generate_lead", { lead_source: FORM_NAME, language: values.language });
      router.push("/thanks/");
    } catch {
      setStatus("error");
    }
  }

  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent("Lessons inquiry")}&body=${encodeURIComponent(
      Object.entries(values).filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`).join("\n"))}`
    : "";

  const Err = ({ k }: { k: string }) => (errors[k] ? <span className="err" id={`${k}-err`} role="alert">{errors[k]}</span> : null);
  const a11y = (k: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-err` : undefined });
  // a plain function, not a component, so the select keeps focus while the form re-renders
  const select = (k: string, label: string, options: string[], required = false) => (
    <div className="field">
      <label htmlFor={k}>{label}{!required && <span className="opt"> (optional)</span>}</label>
      <select id={k} name={k} value={values[k]} onChange={set(k)} ref={(el) => { refs.current[k] = el; }} {...a11y(k)}>
        <option value="">Choose one</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <Err k={k} />
    </div>
  );

  return (
    <form name={FORM_NAME} method="POST" action="/thanks/" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit} noValidate className="form">
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="trap" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

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
        <label htmlFor="phone">Phone <span className="opt">(optional)</span></label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} />
        <span className="hint">If you prefer a call or a WhatsApp message.</span>
      </div>
      {select("language", "Language", LANGUAGES, true)}
      {select("level", "Your level", LEVELS)}
      {select("format", "One-on-one or group", FORMATS)}
      {select("mode", "In person or online", MODES)}
      <div className="field">
        <label htmlFor="availability">Preferred days and times <span className="opt">(optional)</span></label>
        <input id="availability" name="availability" placeholder="For example: weekday evenings" value={values.availability} onChange={set("availability")} />
      </div>
      <div className="field full">
        <label htmlFor="message">Why do you want to learn?</label>
        <textarea id="message" name="message" value={values.message} onChange={set("message")} ref={(el) => { refs.current.message = el; }} {...a11y("message")}
          placeholder="A trip, family, work, a test, or just because. Booking for your child? Tell me their age." />
        <Err k="message" />
      </div>
      <div className="send">
        <button type="submit" className="btn solid" disabled={status === "sending"}>{status === "sending" ? "Sending" : button} <span className="arr" aria-hidden="true">→</span></button>
        {note && <span className="note">{note}</span>}
      </div>
      {status === "error" && (
        <p className="fail" role="alert">
          Something went wrong on the way.{" "}
          {mailto ? <><a href={mailto}>Send it as an email instead</a>, everything you typed is already in it.</> : "Please try again in a minute."}
        </p>
      )}
    </form>
  );
}
