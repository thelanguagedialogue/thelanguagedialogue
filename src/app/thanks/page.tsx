import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/schema";
import { bookAct } from "@/lib/links";
import { PageHead } from "@/components/Sections";
import { Btn, Arr } from "@/components/Ui";

export const metadata: Metadata = pageMeta({
  title: `Thank you | ${site.brandName}`,
  description: "Your message is on its way.",
  path: null,
  index: false,
});

export default function Thanks() {
  return (
    <PageHead
      hero={{
        issue: ["Message sent"],
        title: "Grazie, *got it*",
        lede: "Your message is on its way to me. I read every message myself and reply as soon as I can.",
      }}
      actions={<>
        <Btn act={bookAct()} className="btn olive">{site.buttons.book} <Arr /></Btn>
        <Link className="btn light" href="/">Back to the homepage</Link>
      </>}
    />
  );
}
