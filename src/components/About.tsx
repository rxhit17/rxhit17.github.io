import "./styles/About.css";
import { profile } from "../data/profile";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">{profile.bio}</p>
      </div>
    </div>
  );
};

export default About;
