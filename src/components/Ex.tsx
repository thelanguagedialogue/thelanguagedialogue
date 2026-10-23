import { parse, paragraphs } from "@/lib/content";
import { IS_LIVE } from "@/lib/site";

/**
 * Text from content/. Strings that start with "[EXAMPLE]" are placeholders: on a preview
 * they render with a dashed outline and an EXAMPLE tag so nobody mistakes them for final
 * copy; on the live site the marker is simply removed (the build gate guarantees there
 * are none left anyway).
 */
export function Txt({ v, className = "" }: { v: string | undefined | null; className?: string }) {
  const { text, example } = parse(v);
  if (!text) return null;
  if (example && !IS_LIVE) return <span className={`ex ${className}`.trim()}>{text}</span>;
  return className ? <span className={className}>{text}</span> : <>{text}</>;
}

/** Multi-paragraph text. Blank lines in the content become paragraphs. */
export function Paras({ v, className = "" }: { v: string; className?: string }) {
  const ps = paragraphs(v);
  if (ps.length === 0) return null;
  return (
    <div className={`prose ${className}`.trim()}>
      {ps.map((p, i) => (
        <p key={i}>{p.example && !IS_LIVE ? <span className="ex">{p.text}</span> : p.text}</p>
      ))}
    </div>
  );
}
