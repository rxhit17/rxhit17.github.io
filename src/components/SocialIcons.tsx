import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { profile } from "../data/profile";
import { prefersReducedMotion } from "../utils/device";

const SocialIcons = () => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const social = document.getElementById("social");
    if (!social) return;

    // Magnetic hover. One rAF loop for all icons that only runs while an
    // icon is still moving, and only writes transform-based CSS variables.
    const items = Array.from(social.querySelectorAll("span")).map((span) => {
      const link = span.querySelector("a") as HTMLElement;
      return { span, link, x: 0, y: 0, tx: 0, ty: 0 };
    });
    let raf = 0;

    const tick = () => {
      let moving = false;
      items.forEach((it) => {
        it.x += (it.tx - it.x) * 0.15;
        it.y += (it.ty - it.y) * 0.15;
        if (Math.abs(it.tx - it.x) > 0.1 || Math.abs(it.ty - it.y) > 0.1) {
          moving = true;
        } else {
          it.x = it.tx;
          it.y = it.ty;
        }
        it.link.style.setProperty("--dx", `${it.x}px`);
        it.link.style.setProperty("--dy", `${it.y}px`);
      });
      raf = moving ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: MouseEvent) => {
      items.forEach((it) => {
        const r = it.span.getBoundingClientRect();
        const lx = e.clientX - r.left;
        const ly = e.clientY - r.top;
        const near = lx > 10 && lx < 40 && ly > 5 && ly < 40;
        it.tx = near ? lx - r.width / 2 : 0;
        it.ty = near ? ly - r.height / 2 : 0;
      });
      if (!raf) raf = requestAnimationFrame(tick);
    };

    social.addEventListener("mousemove", onMove, { passive: true });
    social.addEventListener("mouseleave", () => {
      items.forEach((it) => ((it.tx = 0), (it.ty = 0)));
      if (!raf) raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      social.removeEventListener("mousemove", onMove);
    };
  }, []);

  const icons = [
    { href: profile.github, label: "GitHub", Icon: FaGithub },
    { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  ].filter((i) => i.href);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {icons.map(({ href, label, Icon }) => (
          <span key={label}>
            <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
              <Icon />
            </a>
          </span>
        ))}
      </div>
      <a
        className="resume-button"
        href={profile.resumeFile}
        download={profile.resumeDownloadName}
        aria-label="Download resume"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
