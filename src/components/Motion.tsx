"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The concept's motion and header behaviour, ported from the D v3 script. Runs again on every
 * page change (the site navigates without full reloads). The markup it animates (split headline
 * words, statement words) is already rendered on the server, so nothing here changes text.
 *
 *  - reveal on scroll ([data-reveal], .split) unless the visitor prefers reduced motion
 *  - homepage languages: the sticky word follows the card in view
 *  - header turns solid after the cover; floating WhatsApp shows after the cover, hides over the
 *    contact band; gentle parallax on [data-speed] photos; statement words ink in with scroll
 *  - preview notes for links that are not connected yet ([data-soon]); video dialog ([data-video])
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const motion = !root.classList.contains("rm");
    const offs: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: Window | Document, ev: K | string, fn: EventListener, opt?: AddEventListenerOptions | boolean) => {
      t.addEventListener(ev, fn, opt);
      offs.push(() => t.removeEventListener(ev, fn, opt));
    };

    // preview notes + video dialog. Capture phase, so it runs before any link navigation.
    const toast = document.querySelector<HTMLElement>(".toast");
    let tt: number | undefined;
    on(document, "click", ((e: MouseEvent) => {
      const el = e.target as Element | null;
      const soon = el?.closest<HTMLElement>("[data-soon]");
      if (soon) {
        e.preventDefault();
        if (!toast) return;
        toast.innerHTML = "<b>Preview</b>";
        toast.appendChild(document.createTextNode(soon.getAttribute("data-soon") || ""));
        toast.classList.add("on");
        window.clearTimeout(tt);
        tt = window.setTimeout(() => toast.classList.remove("on"), 4200);
        return;
      }
      const vid = el?.closest<HTMLAnchorElement>("[data-video]");
      if (vid && typeof HTMLDialogElement === "function") {
        e.preventDefault();
        const dlg = document.createElement("dialog");
        dlg.className = "player";
        dlg.innerHTML = '<form method="dialog"><button type="submit">Close</button></form>';
        const v = document.createElement("video");
        v.src = vid.href; v.controls = true; v.autoplay = true; v.playsInline = true;
        dlg.appendChild(v);
        dlg.addEventListener("close", () => dlg.remove());
        document.body.appendChild(dlg);
        dlg.showModal();
      }
    }) as EventListener, true);

    if (!("IntersectionObserver" in window)) { root.classList.add("rm"); return () => offs.forEach((f) => f()); }

    // reveal on scroll; the cover reveals at once
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    document.querySelectorAll("[data-reveal], .split").forEach((el) => {
      if (el.classList.contains("in")) return;
      if (el.closest(".hero, .pagehead")) { requestAnimationFrame(() => el.classList.add("in")); return; }
      io.observe(el);
    });

    // homepage: sticky language word follows the card in view
    const phr = document.querySelectorAll(".phrase > span");
    const words3 = document.querySelectorAll(".bigword span");
    const cur = document.querySelector(".counter .cur");
    const bar = document.querySelector<HTMLElement>(".counter .bar i");
    const langs = document.querySelectorAll(".lang");
    const lio = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = Number(e.target.getAttribute("data-i"));
        words3.forEach((s, k) => s.classList.toggle("on", k === i));
        phr.forEach((s, k) => s.classList.toggle("on", k === i));
        if (cur) cur.textContent = String(i + 1).padStart(2, "0");
        if (bar) bar.style.transform = `scaleX(${(i + 1) / langs.length})`;
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    langs.forEach((el) => lio.observe(el));

    // header, floating WhatsApp, parallax, statement ink: one frame per scroll
    const site = document.querySelector<HTMLElement>(".site");
    const headEnd = document.querySelector<HTMLElement>("[data-head-end]");
    const heroBar = headEnd?.querySelector<HTMLElement>(".hero-bar") ?? null;
    const wa = document.querySelector<HTMLElement>(".wa");
    const ctaBand = document.querySelector<HTMLElement>(".cta");
    const par = Array.from(document.querySelectorAll<HTMLElement>("[data-speed]"));
    const big = document.querySelector<HTMLElement>("[data-words]");
    const sw = big ? Array.from(big.querySelectorAll<HTMLElement>(".sw")) : [];
    let ticking = false;
    const frame = () => {
      ticking = false;
      const vh = window.innerHeight;
      const hh = site ? site.offsetHeight : 84;
      // solid as soon as the info bar reaches the header, so the two never overlap
      const past = heroBar ? heroBar.getBoundingClientRect().top < hh : headEnd ? headEnd.getBoundingClientRect().bottom < hh : true;
      site?.classList.toggle("solid", past);
      // the contact band has its own WhatsApp button, so the floating one steps aside there
      const cr = ctaBand?.getBoundingClientRect();
      wa?.classList.toggle("show", past && !(cr && cr.top < vh * 0.6 && cr.bottom > vh * 0.4));
      if (!motion) { sw.forEach((s) => s.classList.add("lit")); return; }
      par.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const c = r.top + r.height / 2 - vh / 2;
        let y = -c * parseFloat(el.getAttribute("data-speed") || "0");
        if (parent.classList.contains("frame")) { const spare = el.offsetHeight - r.height; y = Math.max(-spare, Math.min(0, y - spare / 2)); }
        el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
      });
      if (big && sw.length) {
        const r = big.getBoundingClientRect();
        const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
        const lit = Math.round(Math.max(0, Math.min(1, p)) * sw.length * 1.35);
        sw.forEach((s, k) => s.classList.toggle("lit", k < lit));
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    on(window, "scroll", onScroll as EventListener, { passive: true });
    on(window, "resize", onScroll as EventListener);
    frame();

    return () => {
      offs.forEach((f) => f());
      io.disconnect();
      lio.disconnect();
      window.clearTimeout(tt);
    };
  }, [pathname]);

  return null;
}
