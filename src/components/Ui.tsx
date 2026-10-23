import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Act } from "@/lib/links";

/** A button or link from an Act (lib/links.ts). Placeholder links carry data-soon, which the
 *  preview turns into a short note instead of following the link. */
export function Btn({ act, className, children, label, style }: {
  act: Act | null;
  className?: string;
  children: ReactNode;
  label?: string;
  style?: CSSProperties;
}) {
  if (!act) return null;
  const props = { className, style, "data-soon": act.soon, "aria-label": label };
  if (act.external) return <a href={act.href} target="_blank" rel="noopener" {...props}>{children}</a>;
  if (act.href.startsWith("/") && !act.soon) return <Link href={act.href} {...props}>{children}</Link>;
  return <a href={act.href} {...props}>{children}</a>;
}

export const Arr = () => <span className="arr" aria-hidden="true">→</span>;

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z" /></svg>;
}

/** Inline JSON-LD. */
export function JsonLd({ data }: { data: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;
}

/** Delay for staggered reveals, as the concept does it. */
export const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
