import { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { profile } from "../data/profile";
import { prefersReducedMotion } from "../utils/device";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const links = [
  { id: "about", label: "ABOUT" },
  { id: "career", label: "CAREER" },
  { id: "work", label: "WORK" },
  { id: "techstack", label: "TECH" },
  { id: "contact", label: "CONTACT" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const reduce = prefersReducedMotion();
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: reduce ? 0 : 1.2,
      effects: !reduce,
      autoResize: true,
      ignoreMobileResize: true,
    });
    smoother.scrollTop(0);
    smoother.paused(true);

    // Active link: one ScrollTrigger per section (cheap, no scroll listener).
    const triggers = links.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setActiveId(id);
          else setActiveId((cur) => (cur === id ? "" : cur));
        },
      })
    );

    // One debounced resize handler.
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollSmoother.refresh(true), 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      triggers.forEach((tr) => tr.kill());
      smoother.kill();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    smoother.scrollTo(`#${id}`, !prefersReducedMotion(), "top top");
  };

  return (
    <>
      <a
        className="skip-link"
        href="#about"
        onClick={(e) => goTo(e, "about")}
        data-cursor="disable"
      >
        Skip to content
      </a>
      <div className="header">
        <div className="navbar-left">
          <a
            href="#top"
            className="navbar-logo"
            data-cursor="disable"
            aria-label="Back to top"
            onClick={(e) => {
              e.preventDefault();
              smoother.scrollTo(0, !prefersReducedMotion());
            }}
          >
            {profile.initials}
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="navbar-connect"
            data-cursor="disable"
          >
            {profile.email}
          </a>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <MdMenu />
        </button>

        <nav
          className={`nav-menu ${isMenuOpen ? "open" : ""}`}
          aria-label="Primary"
        >
          <button
            className="menu-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <MdClose />
          </button>
          <ul>
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={activeId === id ? "nav-active" : undefined}
                  aria-current={activeId === id ? "true" : undefined}
                  onClick={(e) => goTo(e, id)}
                >
                  <HoverLinks text={label} />
                </a>
              </li>
            ))}
            <li className="nav-resume">
              <a href={profile.resumeFile} download={profile.resumeDownloadName}>
                <HoverLinks text="RESUME" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
