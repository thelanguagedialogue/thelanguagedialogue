"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** Opens and closes the phone menu (the panel itself is server-rendered in Header.tsx). */
export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const apply = useCallback((on: boolean) => {
    const panel = document.getElementById("menu");
    if (!panel) return;
    panel.hidden = !on;
    document.documentElement.classList.toggle("menu-open", on);
    document.body.style.overflow = on ? "hidden" : "";
    if (on) (panel.querySelector("a") as HTMLElement | null)?.focus({ preventScroll: true });
  }, []);

  // a new page closes the menu (state adjusted during render, React's pattern for "reset on prop change")
  const [path, setPath] = useState(pathname);
  if (path !== pathname) { setPath(pathname); setOpen(false); }

  useEffect(() => { apply(open); }, [open, apply]);

  useEffect(() => {
    if (!open) return;
    const panel = document.getElementById("menu");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    // links to the same page (or an anchor) do not change the path, so close on any click inside
    const onClick = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); };
    const onWide = () => { if (window.innerWidth > 1000) setOpen(false); };
    document.addEventListener("keydown", onKey);
    panel?.addEventListener("click", onClick);
    window.addEventListener("resize", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      panel?.removeEventListener("click", onClick);
      window.removeEventListener("resize", onWide);
    };
  }, [open]);

  return (
    <button
      ref={btn}
      type="button"
      className="menu-btn"
      aria-controls="menu"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setOpen((v) => !v)}
    >
      <i aria-hidden="true" />
    </button>
  );
}
