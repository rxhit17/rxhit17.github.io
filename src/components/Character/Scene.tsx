import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { killScrollTimelines } from "../utils/GsapScroll";

const MAX_DPR = 1.5; // retina screens do not need 2x-3x for this scene
const FRAME_MS = 1000 / 60; // never render faster than 60fps (144Hz screens)

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    let disposed = false;
    const scene = new THREE.Scene();
    const rect = container.getBoundingClientRect();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 1.5, // MSAA is wasted on dense screens
      powerPreference: "high-performance",
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, rect.width / rect.height, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;
    let characterObj: THREE.Object3D | null = null;
    let removeHover: (() => void) | undefined;
    let introTimer: number | undefined;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        if (!gltf || disposed) return;
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          removeHover = animations.hover(gltf, hoverDivRef.current);
        }
        mixer = animations.mixer;
        characterObj = gltf.scene;
        scene.add(characterObj);
        headBone = characterObj.getObjectByName("spine006") || null;
        screenLight = characterObj.getObjectByName("screenlight") || null;
        progress.loaded().then(() => {
          introTimer = window.setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 1000);
        });
      })
      .catch(() => {
        // Model failed: let the page load anyway; text content is the product.
        progress.clear();
      });

    // ---- input (cheap: just stores coordinates) ----
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    const onMouseMove = (event: MouseEvent) =>
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    const onTouchMove = (e: TouchEvent) =>
      handleTouchMove(e, (x, y) => (mouse = { x, y }));
    const onTouchEnd = () =>
      handleTouchEnd((x, y, ix, iy) => {
        mouse = { x, y };
        interpolation = { x: ix, y: iy };
      });

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    const landingDiv = document.getElementById("landingDiv");
    landingDiv?.addEventListener("touchmove", onTouchMove, { passive: true });
    landingDiv?.addEventListener("touchend", onTouchEnd, { passive: true });

    // ---- render loop: runs only while visible ----
    let raf = 0;
    let last = 0;
    let visible = true;
    let tabVisible = !document.hidden;

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (now - last < FRAME_MS - 1) return;
      last = now;
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        if (screenLight) light.setPointLight(screenLight);
      }
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };

    const syncLoop = () => {
      const shouldRun = visible && tabVisible && !disposed;
      if (shouldRun && !raf) {
        clock.getDelta(); // drop the time spent paused so animations don't jump
        raf = requestAnimationFrame(animate);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncLoop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ---- debounced resize ----
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (characterObj) handleResize(renderer, camera, canvasDiv, characterObj);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    syncLoop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      progress.stop();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(introTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      landingDiv?.removeEventListener("touchmove", onTouchMove);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      removeHover?.();
      killScrollTimelines();

      // Free GPU memory.
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => {
            if (v instanceof THREE.Texture) v.dispose();
          });
          m.dispose();
        });
      });
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
