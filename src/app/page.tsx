import type { Metadata } from "next";
import { page, plain } from "@/lib/content";
import { robotsFor } from "@/lib/site";
import { faqSchema, jsonLd, socialCard } from "@/lib/schema";
import { Hero, Section, Languages, HowItWorks, Pricing, Testimonials, FaqList, CtaBand } from "@/components/Blocks";

const c = page("home");

export const metadata: Metadata = {
  title: { absolute: plain(c.metaTitle) },
  description: plain(c.metaDescription),
  alternates: { canonical: "/" },
  robots: robotsFor(true),
  openGraph: socialCard({ title: plain(c.metaTitle), description: plain(c.metaDescription), path: "/" }),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(c.faq)) }} />
      <Hero eyebrow={c.eyebrow} title={c.title} intro={c.intro} image={c.heroImage} imageAlt={c.heroImageAlt} cta={c.ctaLabel}
        secondary={{ href: "/about/", label: "Meet Valentina" }} />
      <Languages />
      <HowItWorks />
      {c.sections.map((s, i) => <Section key={s.heading} s={s} flip={i % 2 === 1} />)}
      <Pricing />
      <Testimonials />
      <FaqList items={c.faq} />
      <CtaBand label={c.ctaLabel} />
    </>
  );
}
