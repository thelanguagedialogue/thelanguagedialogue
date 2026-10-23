import type { Metadata } from "next";
import { site, plain } from "@/lib/content";
import { robotsFor } from "@/lib/site";
import { Container } from "@/components/Blocks";
import { Txt } from "@/components/Ex";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this website collects and how it is used.",
  alternates: { canonical: "/privacy/" },
  robots: robotsFor(false),
};

export default function Privacy() {
  return (
    <section className="py-16">
      <Container className="max-w-2xl prose text-ink-2">
        <h1 className="text-ink">Privacy</h1>
        <p className="mt-6">This site belongs to <Txt v={site.brandName} />, run by <Txt v={site.teacher.name} /> in Atlanta, Georgia.</p>
        <p><strong>The inquiry form.</strong> What you type (your name, email, phone if you add it, the language and level you are interested in, your availability and your message) is sent to Valentina by email so she can reply. It is not sold or shared with anyone else, and it is not used for marketing lists.</p>
        <p><strong>Analytics.</strong> The site uses Google Analytics to count visits and see which pages people read. Google sets a cookie for this. The site honors your browser&apos;s Global Privacy Control and Do Not Track settings: when either is on, analytics does not load.</p>
        <p><strong>Your rights.</strong> Email <a className="underline" href={`mailto:${plain(site.contact.email)}`}><Txt v={site.contact.email} /></a> to ask what information about you is stored, or to have it deleted.</p>
      </Container>
    </section>
  );
}
