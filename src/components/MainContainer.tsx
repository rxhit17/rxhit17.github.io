import { PropsWithChildren, useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import TechStack from "./TechStack";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText, { scheduleSplitText } from "./utils/splitText";
import { setAllTimeline, killScrollTimelines } from "./utils/GsapScroll";
import { setProgress } from "./Loading";
import { useLoading } from "../context/LoadingProvider";
import { prefersReducedMotion } from "../utils/device";

type Props = PropsWithChildren<{ lite: boolean }>;

const MainContainer = ({ children, lite }: Props) => {
  const { setLoading } = useLoading();

  // Split-text animations + debounced resize.
  useEffect(() => {
    // Wait for web fonts: splitting text with the fallback font measures the
    // wrong line breaks (and causes a visible layout jump afterwards).
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) setSplitText();
    });
    window.addEventListener("resize", scheduleSplitText);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", scheduleSplitText);
    };
  }, []);

  // Lite mode has no 3D model to wait for: finish loading as soon as fonts
  // are ready, then build only the cheap section animations.
  useEffect(() => {
    if (!lite) return;
    const progress = setProgress(setLoading);
    let cancelled = false;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.race([
      fontsReady,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]).then(() => {
      if (cancelled) return;
      progress.loaded();
      if (!prefersReducedMotion()) setAllTimeline();
    });
    return () => {
      cancelled = true;
      progress.stop();
      killScrollTimelines();
    };
  }, [lite, setLoading]);

  return (
    <div className={`container-main ${lite ? "lite-mode" : ""}`} id="top">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {!lite && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing />
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <TechStack />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
