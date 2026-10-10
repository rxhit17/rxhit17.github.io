# Rohit Gaikwad - AI/ML Engineer Portfolio

Personal portfolio built with **React + TypeScript + Vite**, **Three.js** (3D character), **GSAP** (scroll animation) and plain CSS.

> Credit: based on an open-source portfolio template by Sufi Inam Ul Hassan, used under the MIT License (see [LICENSE](LICENSE)). All content, data and customizations here are my own.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run lint
```

## Where to edit things (you rarely need to touch components)

| What | File |
| --- | --- |
| Name, email, phone, GitHub/LinkedIn URLs, bio, education, resume file name | `src/data/profile.ts` |
| Jobs and the projects under each job (Career section) | `src/data/experience.ts` |
| Project cards (Work section): title, description, tech, link | `src/data/projects.ts` |
| Skills (Tech Stack section) | `src/data/skills.ts` |
| Page title, description, social preview tags | `index.html` |
| Resume PDF | `public/CV.pdf` (replace the file, keep the name) |

### TODOs (not in the resume, so left empty on purpose)
- `src/data/profile.ts`: `github`, `linkedin` URLs (buttons stay hidden until filled), optional `location`.
- `src/data/projects.ts`: `link` for each project (live/GitHub URL) if you have one.
- `index.html`: `og:url` and `og:image` once the site is deployed.
- Project demo videos/screenshots (see below).

---

## Adding project videos and screenshots

Each project has a `slug` in `src/data/projects.ts`. Media is found **automatically** by folder and file name. You do not edit any code.

```
src/assets/projects/<slug>/demo.mp4       <- the video (demo.webm also works)
src/assets/projects/<slug>/poster.webp    <- still image shown before the video plays (.jpg/.png also work)
src/assets/projects/<slug>/shot-1.webp    <- optional screenshots (shot-2, shot-3 ...)
```

The four slugs (folders already exist):

- `ai-voice-calling-agent`
- `enterprise-lms-ai-pipeline`
- `whatsapp-automation-storytelling`
- `rag-chatbot-image-to-3d`

What is shown, in order: video (if `demo.*` exists) -> screenshot/poster -> a clean "Demo coming soon" placeholder. A broken player is never shown. Videos load lazily and only play while on screen.

To add a **new project**, add an object to the `projects` array in `src/data/projects.ts` and create `src/assets/projects/<new-slug>/`.

### Recommended video specs
- 15-30 seconds, 720p (1280x720), no audio, **under about 3 MB**, 16:9.
- MP4 (H.264) is the safest format.

### Compress with ffmpeg
```bash
# MP4 (recommended)
ffmpeg -i input.mov -t 25 -vf "scale=-2:720,fps=24" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -an -movflags +faststart demo.mp4

# Optional smaller WebM
ffmpeg -i input.mov -t 25 -vf "scale=-2:720,fps=24" -c:v libvpx-vp9 -crf 36 -b:v 0 -an demo.webm
```
If the file is still too big, raise `-crf` (30 -> 34) or lower the scale (`-2:540`).

### Make a poster image
```bash
# grab a frame at 2 seconds and save as WebP
ffmpeg -ss 00:00:02 -i demo.mp4 -frames:v 1 -vf "scale=1280:-2" -c:v libwebp -quality 80 poster.webp
```

---

## Performance notes (what makes it smooth)
- **Lite mode** on phones, small screens, low-memory/low-core devices and `prefers-reduced-motion`: the 3D character and Three.js are not even downloaded.
- 3D character: DPR capped at 1.5, 60 fps cap, render loop **pauses when off-screen or tab hidden**, Draco-compressed model, full GPU cleanup on unmount.
- Tech Stack is plain CSS (the old WebGL physics scene was the heaviest part of the page).
- Debounced resize, no leaked listeners, one ScrollSmoother, transform/opacity-only animations.
- Code-split chunks (`react`, `gsap`, `three`) via `manualChunks` in `vite.config.ts`.

---

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) choose **Add New -> Project** and import the repo.
3. **Framework Preset: Vite** (Build Command `npm run build`, Output Directory `dist`; these are auto-detected).
4. Click **Deploy**. After the first deploy, set `og:url` / `og:image` in `index.html`.

---

## License
MIT, see [LICENSE](LICENSE). The original copyright notice is kept as the license requires.
