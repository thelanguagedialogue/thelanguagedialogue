import type { Metadata } from "next";
import { page, plain } from "@/lib/content";
import { robotsFor } from "@/lib/site";
import { socialCard } from "@/lib/schema";
import ServicePage from "@/components/ServicePage";

const PATH = "/about/";
const c = page("about");

export const metadata: Metadata = {
  title: plain(c.metaTitle),
  description: plain(c.metaDescription),
  alternates: { canonical: PATH },
  robots: robotsFor(true),
  openGraph: socialCard({ title: plain(c.metaTitle), description: plain(c.metaDescription), path: PATH }),
};

export default function Page() {
  return <ServicePage slug="about" path={PATH} crumb="About" service={false} />;
}
