import type { Metadata } from "next";
import { file } from "@/lib/content";
import { faqSchema, jsonLd, pageMeta } from "@/lib/schema";
import { JsonLd } from "@/components/Ui";
import { Hero, Statement, Languages, Lessons, Band, AboutBlock, Levels, Prices, Travel, Trip, Reviews, Faq, Cta } from "@/components/Sections";

// The homepage: the approved D v3 concept, section by section. Text: content/home.json.
const c = file("home.json");

export const metadata: Metadata = pageMeta({ title: c.metaTitle, description: c.metaDescription, path: "/" });

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd(faqSchema(c.faq.items))} />
      <Hero hero={c.hero} />
      <Statement kicker={c.statement.kicker} text={c.statement.text} />
      <Languages kicker={c.languages.kicker} items={c.languages.items} />
      <Lessons id="how" kicker={c.lessons.kicker} heading={c.lessons.heading} image={c.lessons.image} imageAlt={c.lessons.imageAlt} />
      <Band band={c.band} />
      <AboutBlock kicker={c.about.kicker} heading={c.about.heading} body={c.about.body} image={c.about.image} imageAlt={c.about.imageAlt}
        image2={c.about.image2} image2Alt={c.about.image2Alt} videoLabel={c.about.videoLabel} />
      <Levels kicker={c.levels.kicker} heading={c.levels.heading} agesLabel={c.levels.agesLabel} />
      <Prices />
      <Travel t={c.travel} />
      <Trip t={c.trip} />
      <Reviews kicker={c.reviews.kicker} />
      <Faq kicker={c.faq.kicker} heading={c.faq.heading} items={c.faq.items} />
      <Cta />
    </>
  );
}
