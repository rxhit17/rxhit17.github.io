import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

// Custom cursor. Only transform/scale are animated (compositor-friendly),
// there is no per-frame loop, and everything is cleaned up on unmount.
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current!;
    // No custom cursor on touch devices.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      cursor.style.display = "none";
      return;
    }

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });
    let locked = false;

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
      }
      if (locked) return;
      moveX(e.clientX);
      moveY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (!el) return;
      if (el.dataset.cursor === "icons") {
        const r = el.getBoundingClientRect();
        locked = true;
        gsap.to(cursor, {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          scaleX: r.width / 50,
          scaleY: r.height / 50,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else if (el.dataset.cursor === "disable") {
        gsap.to(cursor, { scaleX: 0, scaleY: 0, duration: 0.25, overwrite: "auto" });
      }
    };

    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (!el) return;
      locked = false;
      gsap.to(cursor, { scaleX: 1, scaleY: 1, duration: 0.3, overwrite: "auto" });
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      gsap.killTweensOf(cursor);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} aria-hidden="true"></div>;
};

export default Cursor;
