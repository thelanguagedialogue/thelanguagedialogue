"use client";
import Script from "next/script";
import { useEffect } from "react";
import { bootstrap } from "@/lib/track";

/** Loads gtag.js only when a valid GA4 id exists. Nothing renders otherwise. */
export default function Analytics({ id }: { id: string }) {
  useEffect(() => { if (id) bootstrap(id); }, [id]);
  if (!id) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />;
}
