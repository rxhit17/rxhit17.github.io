// Work experience, taken from your resume. Each company lists the projects you
// worked on there; these also feed the Work (projects) section via slug.

export type Job = {
  company: string;
  role: string;
  period: string;
  projects: { slug: string; title: string; summary: string }[];
};

export const experience: Job[] = [
  {
    company: "PSITECH Consultancy Services Pvt Ltd",
    role: "AI/ML Engineer",
    period: "May 2026 - Present",
    projects: [
      {
        slug: "ai-voice-calling-agent",
        title: "AI Voice Calling Agent",
        summary:
          "Real-time AI voice agent platform that automates inbound and outbound business calls over Twilio, with Deepgram (ASR), OpenAI LLMs and ElevenLabs (TTS), deployed on a Dockerized VPS with Nginx/SSL.",
      },
      {
        slug: "enterprise-lms-ai-pipeline",
        title: "AI Pipeline for an Enterprise LMS",
        summary:
          "AI-powered enterprise LMS where teams record multi-camera training videos, auto-edit them with AI and publish to their organization, backed by a GPU-local pipeline (FastAPI, Ollama, Qwen3, Kokoro, LongCat, FFmpeg).",
      },
    ],
  },
  {
    company: "Red Fibre Pvt Ltd",
    role: "AI/ML Engineer",
    period: "Aug 2025 - Apr 2026",
    projects: [
      {
        slug: "whatsapp-automation-storytelling",
        title: "WhatsApp Automation & Storytelling App",
        summary:
          "WhatsApp auto-reply system (n8n, WhatsApp Business API) for real-time customer queries, plus a Gemini-powered storytelling app that generates narratives from user-defined characters.",
      },
      {
        slug: "rag-chatbot-image-to-3d",
        title: "RAG Chatbot & Image-to-3D Pipeline",
        summary:
          "Website chatbot using Retrieval-Augmented Generation (vector database + LLM), and an n8n workflow that converts 2D images into 3D assets via third-party generation tools.",
      },
    ],
  },
];
