import "./styles/TechStack.css";
import { skillGroups } from "../data/skills";

// Lightweight, CSS-only replacement for the old WebGL physics scene:
// no GPU work, no extra JS bundle, and the content is readable/accessible.
const TechStack = () => {
  return (
    <section className="techstack" id="techstack" aria-labelledby="techstack-title">
      <h2 id="techstack-title">
        My <span>Techstack</span>
      </h2>
      <div className="techstack-grid">
        {skillGroups.map((group) => (
          <div className="techstack-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
