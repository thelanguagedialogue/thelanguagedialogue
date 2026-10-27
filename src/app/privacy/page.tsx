import type { Metadata } from "next";
import { site, parse } from "@/lib/content";
import { pageMeta } from "@/lib/schema";
import { PageHead } from "@/components/Sections";
import { T } from "@/components/Text";

export const metadata: Metadata = pageMeta({
  title: `Privacy | ${site.brandName}`,
  description: "What this website collects, why, and how to have it deleted.",
  path: "/privacy/",
  index: false,
});

export default function Privacy() {
  const email = parse(site.contact.email).text;
  return (
    <>
      <PageHead hero={{ issue: ["Privacy"], title: "Privacy", lede: "What this website collects, why, and how to have it deleted." }} crumb="Privacy" />
      <section className="prose">
        <div className="wrap">
          <p>This website belongs to {site.brandName}, run by {site.teacher.name} in the Atlanta metro area, Georgia, USA.</p>
          <h2>The inquiry form</h2>
          <p>When you send the form, what you type (your name, email, phone if you add it, the language, level and format you are interested in, your preferred days and times, and your message) is delivered to {site.teacher.firstName} by email through Netlify, the company that hosts this website. It is used only to reply to you and to plan your lessons. It is not sold, shared or added to a mailing list.</p>
          <h2>WhatsApp and the calendar</h2>
          <p>If you message on WhatsApp or book the free call through the online calendar, those services handle your details under their own privacy policies.</p>
          <h2>Analytics</h2>
          <p>The website may use Google Analytics to count visits and see which pages are read. Google sets a cookie for this. If your browser sends Global Privacy Control or Do Not Track, analytics does not load.</p>
          <h2>Your rights</h2>
          <p>To see what information about you is kept, or to have it deleted, write to {email ? <a href={`mailto:${email}`}><T v={site.contact.email} /></a> : "the email address on the contact page"}.</p>
        </div>
      </section>
    </>
  );
}
