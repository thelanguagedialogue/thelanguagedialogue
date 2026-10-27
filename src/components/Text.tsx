import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { parse, paragraphs, type Mark } from "@/lib/content";
import { IS_LIVE } from "@/lib/site";

/**
 * Text from content/. The editor can use two small marks inside any text:
 *   *words*            italic accent (the olive italics of the design)
 *   [words](/page/)    a link
 * and a line break in a headline is a line break on wide screens only (as in the concept).
 * Strings starting with [EXAMPLE] or [CONFIRM] get a small tag on previews (see lib/content.ts).
 */

const TOKEN = /\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)|\n/g;

/** "15-minute" and similar never break across lines. */
function nb(text: string, key: string): ReactNode[] {
  return text.split(/(\b\d+-[a-z]+\b)/).map((part, i) =>
    /^\d+-[a-z]+$/.test(part) ? <span className="nb" key={`${key}n${i}`}>{part}</span> : part,
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
  if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noopener">{children}</a>;
  return <a href={href}>{children}</a>;
}

export function inline(text: string, breaks = false): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(...nb(text.slice(last, m.index), `t${k++}`));
    if (m[1] !== undefined) out.push(<em key={`e${k++}`}>{nb(m[1], `e${k}`)}</em>);
    else if (m[2] !== undefined) out.push(<A key={`a${k++}`} href={m[3]}>{m[2]}</A>);
    else out.push(breaks ? <br className="dbr" key={`b${k++}`} /> : " ");
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(...nb(text.slice(last), `t${k++}`));
  return out;
}

/** The small tag after example or to-confirm text, previews only. */
export function Tag({ mark }: { mark: Mark }) {
  if (!mark || IS_LIVE) return null;
  return mark === "confirm"
    ? <span className="exq cf"> · to confirm</span>
    : <span className="exq"> · example</span>;
}

/** One line of text, with its marks. */
export function T({ v, breaks = false }: { v: string | undefined | null; breaks?: boolean }) {
  const { text, mark } = parse(v);
  if (!text) return null;
  if (mark && !IS_LIVE) return <><span className="ex">{inline(text, breaks)}</span><Tag mark={mark} /></>;
  return <>{inline(text, breaks)}</>;
}

/** Paragraphs: a blank line in the editor starts a new one. */
export function Paras({ v, className, style, reveal = true }: { v: string | undefined | null; className?: string; style?: CSSProperties; reveal?: boolean }) {
  const ps = paragraphs(v);
  return (
    <>
      {ps.map((p, i) => (
        <p key={i} className={className} style={style} data-reveal={reveal ? "" : undefined}>
          {p.mark && !IS_LIVE ? <><span className="ex">{inline(p.text)}</span><Tag mark={p.mark} /></> : inline(p.text)}
        </p>
      ))}
    </>
  );
}

/** A headline whose words rise in one by one (the concept's split headline). Rendered on the
 *  server, so the text is complete without JavaScript and for search engines. */
export function Split({ v, as: Tagname = "h1", className = "" }: { v: string; as?: "h1" | "h2"; className?: string }) {
  const text = parse(v).text;
  const nodes: ReactNode[] = [];
  let i = 0;
  // segments: plain or *accent*; newlines become wide-screen line breaks
  const parts = text.split(/(\*[^*]+\*)/);
  parts.forEach((part, pi) => {
    if (!part) return;
    const em = part.startsWith("*") && part.endsWith("*") && part.length > 2;
    const body = em ? part.slice(1, -1) : part;
    body.split(/(\n| +)/).forEach((w, wi) => {
      if (!w) return;
      if (w === "\n") { nodes.push(<br className="dbr" key={`b${pi}-${wi}`} />); nodes.push(" "); return; }
      if (/^ +$/.test(w)) { nodes.push(" "); return; }
      const style = { "--i": i++ } as CSSProperties;
      nodes.push(
        <span className="w" key={`w${pi}-${wi}`}><span className="wi" style={style}>{em ? <em>{w}</em> : w}</span></span>,
      );
    });
  });
  return <Tagname className={`split ${className}`.trim()}>{nodes}</Tagname>;
}

/** The statement paragraph whose words ink in as you scroll. */
export function Words({ v }: { v: string }) {
  const text = parse(v).text;
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean);
  const words = (s: string, key: string) =>
    s.split(/( +)/).map((w, i) => (/^ +$/.test(w) || !w ? (w ? " " : null) : <span className="sw" key={`${key}${i}`}>{w}</span>));
  return (
    <p className="big" data-words="">
      {parts.map((p, i) => (p.startsWith("*") && p.endsWith("*") ? <em key={i}>{words(p.slice(1, -1), `e${i}-`)}</em> : <span key={i}>{words(p, `p${i}-`)}</span>))}
    </p>
  );
}
