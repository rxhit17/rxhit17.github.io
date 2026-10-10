import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    if (!ScrollTrigger.isTouch) return;
    const cleanups: (() => void)[] = [];
    containerRef.current.forEach((container) => {
      if (!container) return;
      container.classList.remove("what-noTouch");
      const onClick = () => handleClick(container);
      container.addEventListener("click", onClick);
      cleanups.push(() => container.removeEventListener("click", onClick));
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>Voice AI Engineer</h3>
              <h4>Real-time Conversational Agents</h4>
              <p>Build voice agents that handle live phone calls from speech to response.</p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Twilio</div>
                <div className="what-tags">Deepgram ASR</div>
                <div className="what-tags">OpenAI LLMs</div>
                <div className="what-tags">ElevenLabs TTS</div>
                <div className="what-tags">Docker</div>
                <div className="what-tags">Nginx / SSL</div>
                <div className="what-tags">VPS Deploy</div>
                <div className="what-tags">Python</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>GenAI &amp; RAG Engineer</h3>
              <h4>LLM Pipelines &amp; Chatbots</h4>
              <p>Ground LLMs in custom knowledge and run generation pipelines locally.</p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">RAG</div>
                <div className="what-tags">Vector DB</div>
                <div className="what-tags">Ollama</div>
                <div className="what-tags">Qwen3</div>
                <div className="what-tags">Gemini API</div>
                <div className="what-tags">Prompt Engineering</div>
                <div className="what-tags">FastAPI</div>
                <div className="what-tags">FFmpeg</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 2)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>Automation Engineer</h3>
              <h4>Workflows &amp; Integrations</h4>
              <p>Automate customer and content workflows without manual effort.</p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">n8n</div>
                <div className="what-tags">WhatsApp Business API</div>
                <div className="what-tags">Twilio</div>
                <div className="what-tags">Kokoro TTS</div>
                <div className="what-tags">LongCat</div>
                <div className="what-tags">Image-to-3D</div>
                <div className="what-tags">Python</div>
                <div className="what-tags">SQL</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
