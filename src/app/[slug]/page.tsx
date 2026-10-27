import type { Metadata } from "next";
import { page, pageSlugs, plain, parse } from "@/lib/content";
import { breadcrumbSchema, faqSchema, jsonLd, pageMeta, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/Ui";
import { Hero, PageHead, Statement, Audience, Chapter, AboutBlock, Lessons, Band, Levels, Prices, Reviews, Faq, Related, Cta, Stats } from "@/components/Sections";

/**
 * Every page in content/pages/ (the "Pages" collection in the editor) is built from this one
 * template: content/pages/italian-classes-atlanta.json is served at /italian-classes-atlanta/.
 * A new lesson, workshop or trip page is a new file in that folder, in the same style.
 * Blocks appear in a fixed order and each one is optional.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return pageSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = page(slug);
  return pageMeta({ title: plain(c.metaTitle), description: plain(c.metaDescription), path: `/${slug}/` });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = page(slug);
  const path = `/${slug}/`;
  const hasCover = parse(c.hero.image).text !== "";
  const related = pageSlugs()
    .filter((s) => s !== slug)
    .map((s) => ({ s, p: page(s) }))
    .filter(({ p }) => p.listed)
    .slice(0, 3)
    .map(({ s, p }) => ({ href: `/${s}/`, title: plain(p.title), summary: plain(p.summary) }));

  return (
    <>
      <JsonLd data={jsonLd(
        breadcrumbSchema([{ label: plain(c.title), href: path }]),
        c.service ? serviceSchema(plain(c.title), plain(c.metaDescription), path) : null,
        faqSchema(c.faq?.items),
      )} />
      {hasCover ? <Hero hero={c.hero} page crumb={plain(c.title)} /> : <PageHead hero={c.hero} crumb={plain(c.title)} />}
      {c.intro?.text && <Statement kicker={c.intro.kicker} text={c.intro.text} />}
      {c.audience && c.audience.items?.length > 0 && <Audience {...c.audience} />}
      {(c.chapters ?? []).map((ch, i) =>
        ch.image2 ? (
          <AboutBlock key={i} id={ch.id || `part-${i + 1}`} kicker={ch.kicker} heading={ch.heading} body={ch.body} image={ch.image} imageAlt={ch.imageAlt}
            image2={ch.image2} image2Alt={ch.image2Alt} signature={ch.signature} video={ch.video} stats={Boolean(c.stats)} />
        ) : (
          <Chapter key={i} c={ch} index={i} />
        ),
      )}
      {c.stats && !(c.chapters ?? []).some((ch) => ch.image2) && <section className="about"><div className="wrap"><Stats /></div></section>}
      {c.lessons?.show && <Lessons id="how" kicker={c.lessons.kicker} heading={c.lessons.heading} note={c.lessons.note} image={c.lessons.image} imageAlt={c.lessons.imageAlt} />}
      {c.band?.show && <Band band={c.band} />}
      {c.levels?.show && <Levels heading={c.levels.heading || "Start where *you are*"} text={c.levels.text} />}
      {c.service && <Prices />}
      {c.reviews?.show && <Reviews kicker={c.reviews.kicker} />}
      {c.faq && c.faq.items?.length > 0 && <Faq kicker={c.faq.kicker} heading={c.faq.heading} items={c.faq.items} />}
      <Related items={related} />
      <Cta />
    </>
  );
}
