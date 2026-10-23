import { page, plain } from "@/lib/content";
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/schema";
import { Hero, Section, HowItWorks, Pricing, FaqList, CtaBand, Breadcrumbs } from "./Blocks";

/** The three lesson pages and the about page share one layout, driven by content/pages/<slug>.json. */
export default function ServicePage({ slug, path, crumb, service = true }: { slug: string; path: string; crumb: string; service?: boolean }) {
  const c = page(slug);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(
        breadcrumbSchema([{ label: crumb }]),
        service ? serviceSchema(plain(c.title), plain(c.metaDescription), path) : null,
        faqSchema(c.faq),
      ) }} />
      <Breadcrumbs crumbs={[{ label: crumb }]} />
      <Hero eyebrow={c.eyebrow} title={c.title} intro={c.intro} image={c.heroImage} imageAlt={c.heroImageAlt} cta={c.ctaLabel} />
      {c.sections.map((s, i) => <Section key={s.heading} s={s} flip={i % 2 === 1} />)}
      {service && <HowItWorks />}
      {service && <Pricing />}
      <FaqList items={c.faq} />
      <CtaBand label={c.ctaLabel} />
    </>
  );
}
