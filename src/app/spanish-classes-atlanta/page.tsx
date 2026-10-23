import type { Metadata } from "next";
import { page, plain } from "@/lib/content";
import { robotsFor } from "@/lib/site";
import { socialCard } from "@/lib/schema";
import ServicePage from "@/components/ServicePage";

const PATH = "/spanish-classes-atlanta/";
const c = page("spanish");

export const metadata: Metadata = {
  title: plain(c.metaTitle),
  description: plain(c.metaDescription),
  alternates: { canonical: PATH },
  robots: robotsFor(true),
  openGraph: socialCard({ title: plain(c.metaTitle), description: plain(c.metaDescription), path: PATH }),
};

export default function Page() {
  return <ServicePage slug="spanish" path={PATH} crumb="Spanish classes in Atlanta" service={true} />;
}
