import type { Metadata } from "next";
import { page, plain, site } from "@/lib/content";
import { IS_LIVE, robotsFor } from "@/lib/site";
import { breadcrumbSchema, jsonLd, socialCard } from "@/lib/schema";
import { cleanGaId } from "@/lib/track";
import { Container, Eyebrow, Breadcrumbs } from "@/components/Blocks";
import { Txt, Paras } from "@/components/Ex";
import InquiryForm from "@/components/InquiryForm";

const PATH = "/contact/";
const c = page("contact");

export const metadata: Metadata = {
  title: plain(c.metaTitle),
  description: plain(c.metaDescription),
  alternates: { canonical: PATH },
  robots: robotsFor(true),
  openGraph: socialCard({ title: plain(c.metaTitle), description: plain(c.metaDescription), path: PATH }),
};

export default function Contact() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ label: "Contact" }])) }} />
      <Breadcrumbs crumbs={[{ label: "Contact" }]} />
      <section className="pt-10 pb-16">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow><Txt v={c.eyebrow} /></Eyebrow>
            <h1 className="mt-3"><Txt v={c.title} /></h1>
            <Paras v={c.intro} className="mt-6 text-lg text-ink-2" />
            <dl className="mt-8 space-y-4 text-ink-2">
              {site.contact.email && (
                <div><dt className="text-sm text-muted">Email</dt><dd><a className="underline" href={`mailto:${plain(site.contact.email)}`}><Txt v={site.contact.email} /></a></dd></div>
              )}
              {site.contact.phone && (
                <div><dt className="text-sm text-muted">Phone or WhatsApp</dt><dd><Txt v={site.contact.phone} /></dd></div>
              )}
              <div><dt className="text-sm text-muted">Where</dt><dd><Txt v={site.contact.area} /></dd></div>
              <div><dt className="text-sm text-muted">Usually available</dt><dd><Txt v={site.availability} /></dd></div>
            </dl>
          </div>
          <div className="bg-paper-2 border border-line p-6 sm:p-8 rounded-sm">
            <InquiryForm email={plain(site.contact.email)} gaId={IS_LIVE ? cleanGaId(site.gaId) : ""} />
          </div>
        </Container>
      </section>
    </>
  );
}
