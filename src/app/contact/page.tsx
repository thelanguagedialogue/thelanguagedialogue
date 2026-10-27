import type { Metadata } from "next";
import { file, site, parse, plain } from "@/lib/content";
import { IS_LIVE } from "@/lib/site";
import { breadcrumbSchema, jsonLd, pageMeta } from "@/lib/schema";
import { bookAct, whatsappAct } from "@/lib/links";
import { cleanGaId } from "@/lib/track";
import { PageHead } from "@/components/Sections";
import { T } from "@/components/Text";
import { Btn, Arr, WhatsAppIcon, JsonLd } from "@/components/Ui";
import InquiryForm from "@/components/InquiryForm";

// Contact: book the free call, WhatsApp, or the inquiry form (her fields from the call).
// Text: content/contact.json; links and contact details: content/site.json.
const c = file("contact.json");
const PATH = "/contact/";

export const metadata: Metadata = pageMeta({ title: c.metaTitle, description: c.metaDescription, path: PATH });

export default function Contact() {
  const wa = whatsappAct();
  const email = parse(site.contact.email).text;
  const phone = parse(site.contact.phone).text;
  return (
    <>
      <JsonLd data={jsonLd(breadcrumbSchema([{ label: "Contact", href: PATH }]))} />
      <PageHead
        hero={c.hero}
        crumb="Contact"
        actions={<>
          <Btn act={bookAct()} className="btn olive">{site.buttons.book} <Arr /></Btn>
          {wa && <Btn act={wa} className="btn light"><WhatsAppIcon />{site.buttons.whatsapp}</Btn>}
          <a className="btn light" href="#message">{site.buttons.message}</a>
        </>}
      />
      <section className="contact" id="book">
        <div className="wrap">
          <div className="side">
            <span className="caps kicker" data-reveal="">{c.side.kicker}</span>
            <p data-reveal=""><T v={c.side.text} /></p>
            <dl data-reveal="">
              {phone && (
                <div><dt>Phone or WhatsApp</dt><dd><a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><T v={site.contact.phone} /></a></dd></div>
              )}
              {email && (
                <div><dt>Email</dt><dd><a href={`mailto:${email}`}><T v={site.contact.email} /></a></dd></div>
              )}
              <div><dt>Where</dt><dd><T v={site.contact.area} /></dd></div>
              <div><dt>The first step</dt><dd>A free 15-minute call, no obligation</dd></div>
            </dl>
            <p data-reveal=""><T v={site.cta.fine} /></p>
          </div>
          <div className="formcard" id="message" data-reveal="">
            <h2><T v={c.form.heading} /></h2>
            <p><T v={c.form.text} /></p>
            <InquiryForm email={plain(site.contact.email)} gaId={IS_LIVE ? cleanGaId(site.gaId) : ""} button={c.form.button} note={c.form.note} />
          </div>
        </div>
      </section>
    </>
  );
}
