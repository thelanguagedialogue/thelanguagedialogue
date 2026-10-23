import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Blocks";
import { robotsFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not here. Everything on the site is one click away from the homepage.",
  robots: robotsFor(false),
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl">
        <h1>That page is not here</h1>
        <p className="mt-6 text-lg text-ink-2">The link may be old. Everything on the site is one click away from the homepage.</p>
        <Link href="/" className="btn btn-outline mt-8">Back to the homepage</Link>
      </Container>
    </section>
  );
}
