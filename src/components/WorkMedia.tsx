import { useEffect, useRef, useState } from "react";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { ProjectMedia } from "../data/projects";

interface Props {
  media: ProjectMedia;
  title: string;
  active: boolean; // only the visible slide may load/play media
}

// Shows, in order of preference: video (lazy, plays only when in view),
// first screenshot, or a clean placeholder. Never renders a broken player.
const WorkMedia = ({ media, title, active }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [media.video, videoFailed]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active && inView && !reduceMotion) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active, inView, reduceMotion]);

  let content;
  if (media.video && !videoFailed) {
    content = (
      <video
        ref={videoRef}
        src={media.video}
        poster={media.poster}
        preload={active ? "metadata" : "none"}
        muted
        loop
        playsInline
        controls={reduceMotion}
        aria-label={`${title} demo video`}
        onError={() => setVideoFailed(true)}
      />
    );
  } else if (media.images.length > 0 || media.poster) {
    content = (
      <img
        src={media.images[0] ?? media.poster}
        alt={`${title} screenshot`}
        loading="lazy"
        decoding="async"
      />
    );
  } else {
    content = (
      <div
        className="work-placeholder"
        role="img"
        aria-label={`${title} demo coming soon`}
      >
        <MdOutlineVideoLibrary />
        <span>Demo coming soon</span>
      </div>
    );
  }

  return (
    <div className="work-image">
      <div className="work-image-in">{content}</div>
    </div>
  );
};

export default WorkMedia;
