import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const recolor = (mesh: THREE.Mesh, color: string) => {
  const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
  mat.color = new THREE.Color(color);
  mesh.material = mat;
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF | null> => {
    const encrypted = await decryptFile("/models/character.enc?v=2", "MyCharacter12");
    const blobUrl = URL.createObjectURL(new Blob([encrypted]));

    let gltf: GLTF;
    try {
      gltf = await loader.loadAsync(blobUrl);
    } finally {
      URL.revokeObjectURL(blobUrl);
      dracoLoader.dispose();
    }

    const character = gltf.scene;
    await renderer.compileAsync(character, camera, scene);
    character.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      // Change clothing colors to match site theme
      if (mesh.material) {
        if (mesh.name === "BODY.SHIRT") recolor(mesh, "#8B4513");
        else if (mesh.name === "Pant") recolor(mesh, "#000000");
      }
      mesh.frustumCulled = true;
    });

    setCharTimeline(character, camera);
    setAllTimeline();
    const footR = character.getObjectByName("footR");
    const footL = character.getObjectByName("footL");
    if (footR) footR.position.y = 3.36;
    if (footL) footL.position.y = 3.36;
    return gltf;
  };

  return { loadCharacter };
};

export default setCharacter;
