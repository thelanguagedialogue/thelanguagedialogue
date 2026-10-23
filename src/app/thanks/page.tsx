import type { Metadata } from "next";
import Link from "next/link";
import { robotsFor } from "@/lib/site";
import { Container } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "Thank you",
  robots: robotsFor(false),
  alternates: { canonical: null },
};

export default function Thanks() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl">
        <h1>Grazie. Got it.</h1>
        <p className="mt-6 text-lg text-ink-2">Your message is on its way to Valentina. She reads every inquiry herself and will reply personally.</p>
        <p className="mt-3 text-ink-2">If it is urgent, the email and phone are in the footer.</p>
        <Link href="/" className="btn btn-outline mt-8">Back to the homepage</Link>
      </Container>
    </section>
  );
}
