import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";
import { isLiteMode } from "./utils/device";

// The 3D scene (Three.js) is a separate chunk. It is only requested on
// capable desktop devices; phones / low-power / reduced-motion get "lite".
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));

// Decided once so the page never flips modes mid-session.
const LITE = isLiteMode();

const App = () => {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <MainContainer lite={LITE}>
          {!LITE && (
            <Suspense fallback={null}>
              <CharacterModel />
            </Suspense>
          )}
        </MainContainer>
      </Suspense>
    </LoadingProvider>
  );
};

export default App;
