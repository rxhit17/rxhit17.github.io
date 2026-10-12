import { useEffect, useRef, useState } from "react";
import { MdOutlineVideoLibrary, MdPlayArrow } from "react-icons/md";
import { ProjectMedia, getYouTubeId } from "../data/projects";

interface Props {
  media: ProjectMedia;
  title: string;
  active: boolean; // only the visible slide may load/play media
  youtube?: string; // optional full-length demo on YouTube
}

// Shows, in order of preference: video (lazy, plays only when in view),
// first screenshot, or a clean placeholder. Never renders a broken player.
const WorkMedia = ({ media, title, active, youtube }: Props) => {
  const ytId = getYouTubeId(youtube);
  const [ytPlaying, setYtPlaying] = useState(false);
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

  // Stop the YouTube player when the user moves to another slide.
  useEffect(() => {
    if (!active) setYtPlaying(false);
  }, [active]);

  let content;
  if (ytId) {
    // "Facade": a cheap thumbnail first; the heavy YouTube player only loads on click.
    content = ytPlaying ? (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
        title={`${title} demo video`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    ) : (
      <button
        type="button"
        className="yt-facade"
        onClick={() => setYtPlaying(true)}
        aria-label={`Play ${title} demo video`}
        data-cursor="disable"
      >
        <img
          src={media.poster ?? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="yt-play">
          <MdPlayArrow />
        </span>
      </button>
    );
  } else if (media.video && !videoFailed) {
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
