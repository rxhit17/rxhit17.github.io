import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { profile, education } from "../data/profile";

const Contact = () => {
  const socials = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
  ].filter((s) => s.href);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h3>Contact</h3>
        </div>

        <div className="contact-grid">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${profile.email}`} data-cursor="disable">
                {profile.email}
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} data-cursor="disable">
                {profile.phone}
              </a>
            </p>
            {profile.location && (
              <>
                <h4>Location</h4>
                <p>{profile.location}</p>
              </>
            )}
          </div>

          <div className="contact-box">
            <h4>Education</h4>
            {education.map((e) => (
              <div className="edu-item" key={e.school}>
                <p>{e.degree}</p>
                <p className="edu-year">
                  {e.period} · {e.detail}
                </p>
                <p className="edu-detail">{e.school}</p>
              </div>
            ))}
          </div>

          <div className="contact-box">
            <h4>Social</h4>
            <div className="social-links-grid">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="disable"
                  className="contact-social"
                >
                  {s.label} <MdArrowOutward />
                </a>
              ))}
              <a
                href={profile.resumeFile}
                download={profile.resumeDownloadName}
                data-cursor="disable"
                className="contact-social"
              >
                Download Resume <MdArrowOutward />
              </a>
            </div>
          </div>
        </div>

        <footer className="footer-area">
          <div className="footer-line"></div>
          <div className="footer-content">
            <p className="footer-copyright">
              {profile.fullName}'s Portfolio <span className="footer-separator">|</span>{" "}
              <MdCopyright /> {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contact;
