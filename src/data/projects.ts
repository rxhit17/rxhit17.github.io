// ONE place to edit your projects. Text lives here; media (video / poster /
// screenshots) is picked up automatically from src/assets/projects/<slug>/
// by file name - see src/assets/projects/README.md.

export type Project = {
  slug: string; // must match the folder name in src/assets/projects/
  title: string;
  category: string;
  company: string;
  description: string;
  tools: string[];
  link?: string; // TODO: add a live/GitHub URL when you have one (none in resume)
};

export const projects: Project[] = [
  {
    slug: "ai-voice-calling-agent",
    title: "AI Voice Calling Agent",
    category: "Conversational AI",
    company: "PSITECH Consultancy Services",
    description:
      "A real-time voice agent that automates inbound and outbound customer calls end to end: speech in, LLM reasoning, speech out.",
    tools: ["Twilio", "Deepgram ASR", "OpenAI", "ElevenLabs TTS", "Docker", "Nginx/SSL", "VPS"],
  },
  {
    slug: "enterprise-lms-ai-pipeline",
    title: "Enterprise LMS AI Pipeline",
    category: "Generative AI / Video",
    company: "PSITECH Consultancy Services",
    description:
      "A GPU-local pipeline that understands documents and generates visuals and voice-over, turning source material into enterprise training videos.",
    tools: ["Python", "FastAPI", "Ollama", "Qwen3", "Kokoro", "LongCat", "FFmpeg"],
  },
  {
    slug: "whatsapp-automation-storytelling",
    title: "WhatsApp Automation & Storytelling App",
    category: "Automation / LLM Apps",
    company: "Red Fibre",
    description:
      "Automated WhatsApp replies for real-time customer queries, and a Gemini-based app that writes dynamic stories from user-defined characters.",
    tools: ["n8n", "WhatsApp Business API", "Google Gemini API", "Prompt Engineering"],
  },
  {
    slug: "rag-chatbot-image-to-3d",
    title: "RAG Chatbot & Image-to-3D",
    category: "RAG / Automation",
    company: "Red Fibre",
    description:
      "A website assistant grounded in custom knowledge via a vector database and LLM, plus an n8n workflow that turns 2D images into 3D assets.",
    tools: ["RAG", "Vector Database", "LLM", "n8n"],
  },
];

// ---- media auto-discovery (no need to edit below) ----
const files = import.meta.glob("../assets/projects/*/*.{mp4,webm,webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export type ProjectMedia = { video?: string; poster?: string; images: string[] };

export function getMedia(slug: string): ProjectMedia {
  const media: ProjectMedia = { images: [] };
  const prefix = `../assets/projects/${slug}/`;
  Object.keys(files)
    .filter((p) => p.startsWith(prefix))
    .sort()
    .forEach((p) => {
      const name = p.slice(prefix.length).toLowerCase();
      if (name.startsWith("demo.")) media.video = files[p];
      else if (name.startsWith("poster.")) media.poster = files[p];
      else if (name.startsWith("shot-")) media.images.push(files[p]);
    });
  return media;
}
