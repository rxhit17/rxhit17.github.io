// Decides how heavy the experience should be.
// "lite" = no WebGL character, no scroll-scrubbed 3D; text-first and fast.
const nav = navigator as Navigator & { deviceMemory?: number };

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isLiteMode = () =>
  window.innerWidth <= 1024 ||
  prefersReducedMotion() ||
  (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
  (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2);
