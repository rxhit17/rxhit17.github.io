# Project media

Drop files in the folder named after the project's `slug` (see src/data/projects.ts):

    src/assets/projects/<slug>/demo.mp4     (or demo.webm)   short demo video
    src/assets/projects/<slug>/poster.webp  (or .jpg/.png)   still shown before the video plays
    src/assets/projects/<slug>/shot-1.webp  shot-2.webp ...  optional screenshots

No code changes needed. Missing files => a clean placeholder is shown.
Video: 15-30s, 720p, under ~3 MB. See the guide in the main README.
