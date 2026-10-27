import { site, parse, ready } from "./content";
import { IS_LIVE } from "./site";

/**
 * Where the action buttons go. The links live in content/site.json (links.*) so the client can
 * connect her calendar, WhatsApp and video herself in the editor.
 *
 *  - a real link (no marker): used as is.
 *  - "[CONFIRM] <link>": her real link, not yet approved for the site. Works on a preview, and the
 *    build gate blocks a live build until the marker is removed.
 *  - "[EXAMPLE] ..." or empty: not connected yet. The button falls back to the contact page, and on
 *    a preview a click explains what it will do once connected (the D v3 "preview" note).
 */
export interface Act {
  href: string;
  external?: boolean;
  soon?: string;
}

const SOON = {
  booking: "On the live site this opens Valentina’s calendar, and people pick a time for the free call themselves.",
  whatsapp: "On the live site this opens a WhatsApp chat with Valentina’s number.",
  video: "On the live site this plays a 30-second video of Valentina speaking, so people hear her before they book.",
};

function resolve(value: string, fallback: string | null, soon: string): Act | null {
  const { text, mark } = parse(value);
  if (text && (mark === null || (mark === "confirm" && !IS_LIVE))) {
    return { href: text, external: /^https?:\/\//.test(text) };
  }
  if (mark === "example" && !IS_LIVE) return { href: fallback ?? "#", soon };
  return fallback ? { href: fallback } : null;
}

/** "Book a free call": her calendar, or the contact page until it is connected. */
export const bookAct = (): Act => resolve(site.links.booking, "/contact/", SOON.booking)!;

/** WhatsApp chat, or nothing until a number is set. */
export const whatsappAct = (): Act | null => resolve(site.links.whatsapp, null, SOON.whatsapp);

/** "Hear me speak": the video, or nothing until it exists. */
export const videoAct = (): Act | null => resolve(site.links.video, null, SOON.video);

/** The inquiry form. */
export const messageAct = (): Act => ({ href: "/contact/#message" });

/** A plain link from the content (a page, an anchor, or an outside address). */
export const linkAct = (href: string): Act => ({ href, external: /^https?:\/\//.test(href) });

/** True when the calendar is connected, so the contact page can show it first. */
export const bookingConnected = (): boolean => ready(site.links.booking);
