// GA4, one call site per event. The measurement ID comes from content/site.json (gaId),
// so the client can paste it in the editor once her property exists; nothing loads while
// it is empty. Events queue into window.dataLayer and gtag.js drains them in order.
// Respects Global Privacy Control and Do Not Track.

const GA4_SHAPE = /^G-[A-Za-z0-9]{6,20}$/;

export function cleanGaId(value: string | undefined): string {
  const v = (value || "").trim();
  return GA4_SHAPE.test(v) ? v : "";
}

type DL = { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

function allowed(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  try {
    if (nav.globalPrivacyControl === true) return false;
    return !(nav.doNotTrack === "1" || (window as unknown as { doNotTrack?: string }).doNotTrack === "1" || nav.msDoNotTrack === "1");
  } catch {
    return false;
  }
}

function gtag(...args: unknown[]) {
  const w = window as unknown as DL;
  (w.dataLayer = w.dataLayer || []).push(args);
}

let booted = "";
export function bootstrap(id: string) {
  if (typeof window === "undefined" || !id || booted === id || !allowed()) return;
  booted = id;
  const w = window as unknown as DL;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== "function") w.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id);
}

export function track(id: string, name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !id || !name || !allowed()) return;
  bootstrap(id);
  gtag("event", name, params || {});
}
