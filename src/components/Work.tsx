import { useState, useCallback, useRef } from "react";
import "./styles/Work.css";
import WorkMedia from "./WorkMedia";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md";
import { projects, getMedia } from "../data/projects";

const mediaBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, getMedia(p.slug)])
);

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lock = useRef(false);

  const goToSlide = useCallback((index: number) => {
    if (lock.current) return;
    lock.current = true;
    setCurrentIndex(index);
    setTimeout(() => (lock.current = false), 500);
  }, []);

  const goToPrev = () =>
    goToSlide(currentIndex === 0 ? projects.length - 1 : currentIndex - 1);
  const goToNext = () =>
    goToSlide(currentIndex === projects.length - 1 ? 0 : currentIndex + 1);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper" aria-roledescription="carousel">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translate3d(-${currentIndex * 100}%,0,0)` }}
            >
              {projects.map((project, index) => (
                <div
                  className="carousel-slide"
                  key={project.slug}
                  aria-hidden={index !== currentIndex}
                  {...(index !== currentIndex ? ({ inert: "" } as object) : {})}
                >
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category} · {project.company}
                        </p>
                        <p className="carousel-desc">{project.description}</p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tech used</span>
                          <div className="work-tags-flex">
                            {project.tools.map((tool) => (
                              <div className="work-tags" key={tool}>
                                {tool}
                              </div>
                            ))}
                          </div>
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="project-link"
                            data-cursor="disable"
                          >
                            View Project <MdArrowOutward />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkMedia
                        media={mediaBySlug[project.slug]}
                        title={project.title}
                        active={index === currentIndex}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                className={`carousel-dot ${
                  index === currentIndex ? "carousel-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}: ${project.title}`}
                aria-current={index === currentIndex}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
