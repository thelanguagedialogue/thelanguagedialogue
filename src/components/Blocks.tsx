import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { site, plain, type Faq, type Section as SectionT } from "@/lib/content";
import { Txt, Paras } from "./Ex";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`.trim()}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="display text-red text-lg">{children}</div>;
}

export function Hero({ eyebrow, title, intro, image, imageAlt, cta = "Get in touch", secondary }: {
  eyebrow?: string; title: string; intro: string; image?: string; imageAlt?: string; cta?: string;
  secondary?: { href: string; label: string };
}) {
  const img = plain(image);
  return (
    <section className="pt-12 sm:pt-20 pb-10">
      <Container className="grid gap-10 lg:grid-cols-[1.15fr_1fr] items-center">
        <div>
          {eyebrow && <Eyebrow><Txt v={eyebrow} /></Eyebrow>}
          <h1 className="mt-3"><Txt v={title} /></h1>
          <Paras v={intro} className="mt-6 text-lg sm:text-xl text-ink-2 max-w-xl" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact/" className="btn btn-primary"><Txt v={cta} /></Link>
            {secondary && <Link href={secondary.href} className="btn btn-outline">{secondary.label}</Link>}
          </div>
        </div>
        {img && (
          <div className={`relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden rounded-sm ${image?.startsWith("[") ? "ex ex-block" : ""}`}>
            <Image src={img} alt={plain(imageAlt) || ""} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" priority />
          </div>
        )}
      </Container>
    </section>
  );
}

export function Section({ s, flip = false }: { s: SectionT; flip?: boolean }) {
  const img = plain(s.image);
  if (!img) {
    return (
      <section className="py-12 sm:py-16 rule">
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2><Txt v={s.heading} /></h2>
            <div className="mt-4 h-1 w-14 bg-olive" />
          </div>
          <Paras v={s.body} className="text-lg text-ink-2" />
        </Container>
      </section>
    );
  }
  // With a photo: text in one column, photo in the other; `flip` swaps the two on desktop.
  return (
    <section className="py-12 sm:py-16 rule">
      <Container className="grid gap-8 lg:grid-cols-2 items-center">
        <div className={flip ? "lg:order-2" : ""}>
          <h2><Txt v={s.heading} /></h2>
          <Paras v={s.body} className="mt-5 text-lg text-ink-2" />
        </div>
        <div className={`relative aspect-[4/3] overflow-hidden rounded-sm ${flip ? "lg:order-1" : ""} ${s.image?.startsWith("[") ? "ex ex-block" : ""}`}>
          <Image src={img} alt={plain(s.imageAlt) || ""} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </Container>
    </section>
  );
}

export function Languages() {
  return (
    <section className="py-12 sm:py-16 rule">
      <Container>
        <Eyebrow>Languages</Eyebrow>
        <h2 className="mt-2">What you can learn</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {site.languages.map((l) => (
            <div key={l.name} className="bg-paper-2 border border-line p-6 rounded-sm">
              <h3><Txt v={l.name} /></h3>
              <p className="mt-3 text-ink-2"><Txt v={l.blurb} /></p>
              <p className="mt-4 text-sm text-muted"><Txt v={l.levels} /></p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 rule">
      <Container>
        <Eyebrow>How lessons work</Eyebrow>
        <h2 className="mt-2">One to one, small groups, in person or online</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {site.formats.map((f, i) => (
            <div key={f.title} className="border-t-4 border-ink pt-4">
              <div className="display text-muted">0{i + 1}</div>
              <h3 className="mt-1"><Txt v={f.title} /></h3>
              <p className="mt-2 text-ink-2"><Txt v={f.text} /></p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-lg text-ink-2 max-w-2xl"><Txt v={site.rhythm} /></p>
      </Container>
    </section>
  );
}

export function Pricing() {
  if (!site.showPrices || site.prices.length === 0) return null;
  return (
    <section className="py-12 sm:py-16 rule">
      <Container>
        <Eyebrow>Prices</Eyebrow>
        <h2 className="mt-2">Simple pricing</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {site.prices.map((p) => (
            <div key={p.label} className="bg-ink text-paper p-6 rounded-sm">
              <h3 className="text-paper"><Txt v={p.label} /></h3>
              <div className="display text-4xl mt-4"><Txt v={p.price} /></div>
              <p className="mt-3 text-paper/75 text-sm"><Txt v={p.note} /></p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Testimonials() {
  if (site.testimonials.length === 0) return null;
  return (
    <section className="py-12 sm:py-16 rule">
      <Container>
        <Eyebrow>Students</Eyebrow>
        <h2 className="mt-2">In their words</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {site.testimonials.map((t, i) => (
            <figure key={i} className="bg-paper-2 border border-line p-6 rounded-sm">
              <blockquote className="text-lg leading-relaxed">&ldquo;<Txt v={t.quote} />&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-muted"><Txt v={t.name} /></figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  if (items.length === 0) return null;
  return (
    <section className="py-12 sm:py-16 rule">
      <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-2">Good to know</h2>
        </div>
        <dl className="divide-y divide-line">
          {items.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-semibold text-lg"><Txt v={f.q} /></dt>
              <dd className="mt-2 text-ink-2"><Txt v={f.a} /></dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function CtaBand({ label = "Get in touch" }: { label?: string }) {
  return (
    <section className="py-14 sm:py-20 bg-olive text-paper">
      <Container className="grid gap-6 md:grid-cols-[2fr_1fr] items-center">
        <div>
          <h2 className="text-paper">Tell Valentina why you want to learn</h2>
          <p className="mt-3 text-paper text-lg max-w-xl">That is all it takes to start. She reads every message herself.</p>
        </div>
        <div className="md:text-right">
          <Link href="/contact/" className="btn btn-paper"><Txt v={label} /></Link>
        </div>
      </Container>
    </section>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: { label: string; href?: string }[] }) {
  return (
    <Container className="pt-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          {crumbs.map((c) => (
            <li key={c.label} className="flex gap-2"><span aria-hidden>/</span>{c.href ? <Link href={c.href} className="hover:underline">{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
          ))}
        </ol>
      </nav>
    </Container>
  );
}
