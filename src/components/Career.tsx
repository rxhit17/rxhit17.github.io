import "./styles/Career.css";
import { experience } from "../data/experience";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experience.map((job) => (
            <div className="career-info-box company-group" key={job.company}>
              <div className="company-header">
                <h3>{job.company}</h3>
                <h5>
                  {job.role} · {job.period}
                </h5>
              </div>
              <div className="experience-list">
                {job.projects.map((project, i) => (
                  <div className="experience-row" key={project.slug}>
                    <div className="exp-left">
                      <div className="role-dot"></div>
                      {i !== job.projects.length - 1 && (
                        <div className="role-connector"></div>
                      )}
                      <div className="role-meta">
                        <h4>{project.title}</h4>
                        <p className="role-date">{job.period}</p>
                      </div>
                    </div>
                    <div className="exp-right">
                      <p>{project.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
