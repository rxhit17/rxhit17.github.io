import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "../../utils/device";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

let refreshHooked = false;
let splitTimer: number | undefined;

// Debounced entry point: resize fires many times per second, re-splitting the
// DOM each time is what made resizing janky.
export function scheduleSplitText() {
  window.clearTimeout(splitTimer);
  splitTimer = window.setTimeout(setSplitText, 200);
}

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900 || prefersReducedMotion()) return;
  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }

    para.split = new SplitText(para, {
      type: "lines,words",
      linesClass: "split-line",
    });

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
  });
  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    title.split = new SplitText(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });

  // Register once (it used to be added again on every call).
  if (!refreshHooked) {
    refreshHooked = true;
    ScrollTrigger.addEventListener("refresh", scheduleSplitText);
  }
}
