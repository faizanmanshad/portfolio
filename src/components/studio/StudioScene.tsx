import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import HouseModel from "./HouseModel";
import type { JourneyRecord } from "./houseJourney";
import "./studio.css";

type Mode = "assembled" | "exploded";
const views: [number, number, number][] = [
  [7, 5.5, 8],
  [-7, 4.8, 8],
  [-7, 6, -7],
  [7, 5, -7],
  [8, 6, 2],
  [6, 7, 9],
];
function Scene({
  mode,
  sailing,
  step,
  reset,
  reduced,
  ready,
  fail,
}: {
  mode: Mode;
  sailing: boolean;
  step: number | null;
  reset: number;
  reduced: boolean;
  ready: () => void;
  fail: () => void;
}) {
  const { camera, size, invalidate, gl } = useThree();
  const controls = useRef<any>(null);
  const flight = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const zoom = Math.min(
      size.width / 8.8,
      size.height / (mode === "exploded" ? 9.6 : 6.8),
    );
    const framing = gsap.to(camera, {
      zoom,
      duration: reduced ? 0 : 0.45,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.updateProjectionMatrix();
        invalidate();
      },
    });
    return () => {
      framing.kill();
    };
  }, [size.width, size.height, mode, reduced, camera, invalidate]);
  useEffect(() => {
    if (step === null && reset === 0) return;
    const position = views[step === null ? 0 : step % views.length];
    flight.current = gsap.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: reduced ? 0 : 0.65,
      ease: "power2.inOut",
      onUpdate: () => {
        controls.current?.update();
        invalidate();
      },
    });
    return () => {
      flight.current?.kill();
    };
  }, [step, reset, reduced, camera, invalidate]);
  useEffect(() => {
    const frame = requestAnimationFrame(ready);
    const lost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      cancelAnimationFrame(frame);
      gl.domElement.removeEventListener("webglcontextlost", lost);
    };
  }, [ready, fail, gl]);
  useEffect(() => {
    const rotate = (event: Event) => {
      const orbit = controls.current;
      if (!orbit) return;
      flight.current?.kill();
      const { axis, direction } = (event as CustomEvent).detail;
      if (axis === "horizontal")
        orbit.setAzimuthalAngle(orbit.getAzimuthalAngle() + direction * 0.25);
      else
        orbit.setPolarAngle(
          THREE.MathUtils.clamp(
            orbit.getPolarAngle() + direction * 0.15,
            0.25,
            Math.PI / 2 - 0.1,
          ),
        );
      invalidate();
    };
    window.addEventListener("studio:rotate", rotate);
    return () => window.removeEventListener("studio:rotate", rotate);
  }, [invalidate]);
  return (
    <>
      <ambientLight intensity={0.24} />
      <hemisphereLight args={["#b5d8ff", "#33303e", 0.65]} />
      <directionalLight
        position={[-4, 4, -5]}
        color="#6dcaff"
        intensity={1.8}
      />
      <directionalLight
        position={[-3, 7, 5]}
        color="#ffdfac"
        intensity={2.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={6}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <HouseModel
        exploded={mode === "exploded"}
        reduced={reduced}
        sailing={sailing}
      />
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 1.35, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enableDamping={!reduced}
        dampingFactor={0.12}
        onStart={() => flight.current?.kill()}
      />
    </>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function StudioScene({ journey }: { journey: JourneyRecord[] }) {
  const [mode, setMode] = useState<Mode>("assembled");
  const [sailing, setSailing] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const [reset, setReset] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const touring = step !== null;
  const readyCallback = useRef(() => setReady(true)).current;
  const failCallback = useRef(() => setFailed(true)).current;
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    const explore = () => {
      if (journey.length) {
        setMode("assembled");
        setStep(0);
      }
    };
    window.addEventListener("studio:explore", explore);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("studio:explore", explore);
    };
  }, [journey.length]);
  useEffect(() => {
    if (!touring) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    container.current
      ?.querySelector<HTMLButtonElement>('[aria-label="Exit journey"]')
      ?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [touring]);
  const rotate = (axis: string, direction: number) =>
    window.dispatchEvent(
      new CustomEvent("studio:rotate", { detail: { axis, direction } }),
    );
  return (
    <div
      ref={container}
      data-ready={ready || failed}
      className={`studio-interactive ${touring ? "is-touring" : ""}`}
      role={touring ? "dialog" : undefined}
      aria-modal={touring || undefined}
      aria-label={touring ? "Major portfolio milestones" : undefined}
      onKeyDown={(event) => {
        if (!touring) return;
        if (event.key === "Escape") {
          setStep(null);
          return;
        }
        if (event.key !== "Tab") return;
        const items = Array.from(
          container.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], select, [tabindex="0"]',
          ) || [],
        ).filter((el) => el.getClientRects().length > 0);
        const first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div
        className="studio-canvas"
        id="model-view"
        tabIndex={0}
        role="region"
        aria-label="Curiosity observatory beside a bright canal. Drag or use arrow keys to rotate. Look inside lifts the dome; Sail boat moves the sailboat."
        onKeyDown={(event) => {
          if (
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
              event.key,
            )
          ) {
            event.preventDefault();
            rotate(
              event.key === "ArrowLeft" || event.key === "ArrowRight"
                ? "horizontal"
                : "vertical",
              event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1,
            );
          }
        }}
      >
        {!failed && (
          <SceneBoundary onError={failCallback}>
            <Canvas
              orthographic
              camera={{ position: views[0], zoom: 65, near: 0.1, far: 50 }}
              shadows
              dpr={[1, 2]}
              frameloop="demand"
              resize={{ scroll: false }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <Scene
                  mode={mode}
                  sailing={sailing}
                  step={step}
                  reset={reset}
                  reduced={reduced}
                  ready={readyCallback}
                  fail={failCallback}
                />
              </Suspense>
            </Canvas>
          </SceneBoundary>
        )}
        {(!ready || failed) && (
          <div className="model-loading">
            {failed && (
              <img
                src="/images/observatory.svg"
                alt="A colorful observatory with a turquoise dome, telescope and canal"
              />
            )}
            <span>
              {failed
                ? "Illustrated view · the journey is still available"
                : "Preparing the interactive miniature…"}
            </span>
          </div>
        )}
      </div>
      <p className="model-instructions">
        DRAG / ARROW KEYS TO ROTATE · LOOK INSIDE TO LIFT THE DOME
      </p>
      <div className="studio-tools">
        <div role="group" aria-label="Model display">
          {(["assembled", "exploded"] as Mode[]).map((item) => (
            <button
              key={item}
              aria-pressed={mode === item}
              disabled={failed}
              onClick={() => setMode(item)}
            >
              {item === "assembled" ? "Observatory" : "Look inside"}
            </button>
          ))}
        </div>
        <button
          aria-pressed={sailing}
          disabled={failed}
          onClick={() => setSailing((value) => !value)}
        >
          {sailing ? "Return boat" : "Sail boat"}
        </button>
        <button
          className="reset-view"
          disabled={failed}
          onClick={() => {
            setMode("assembled");
            setSailing(false);
            setReset((n) => n + 1);
          }}
          aria-label="Reset model view"
        >
          ↺ <span>Reset view</span>
        </button>
      </div>
      {step === null ? (
        <div className="journey-start">
          <button
            onClick={() => {
              setMode("assembled");
              setStep(0);
            }}
            disabled={!journey.length}
          >
            Explore my journey <span aria-hidden="true">→</span>
          </button>
          <span>{journey.length} major milestones</span>
        </div>
      ) : (
        <aside className="journey-panel" aria-label="Guided portfolio journey">
          <div className="journey-heading">
            <span>
              {String(step + 1).padStart(2, "0")} /{" "}
              {String(journey.length).padStart(2, "0")} · MAJOR MILESTONES
            </span>
            <button onClick={() => setStep(null)} aria-label="Exit journey">
              ×
            </button>
          </div>
          <div className="journey-copy" aria-live="polite" aria-atomic="true">
            <p className="label">
              {journey[step].date} · {journey[step].category}
            </p>
            <h2>{journey[step].title}</h2>
            <p>{journey[step].description}</p>
            <a href={journey[step].href}>Read the full story ↗</a>
          </div>
          <div className="journey-progress" aria-hidden="true">
            <span
              style={{ width: `${((step + 1) / journey.length) * 100}%` }}
            />
          </div>
          <nav aria-label="Journey steps">
            <button
              disabled={step === 0}
              onClick={() => setStep((i) => Math.max(0, (i ?? 0) - 1))}
            >
              ← Previous
            </button>
            <label className="journey-skip">
              Milestone
              <select
                aria-label="Choose journey milestone"
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
              >
                {journey.map((record, i) => (
                  <option key={record.id} value={i}>
                    {String(i + 1).padStart(2, "0")} · {record.title}
                  </option>
                ))}
              </select>
            </label>
            {step < journey.length - 1 ? (
              <button
                onClick={() =>
                  setStep((i) => Math.min(journey.length - 1, (i ?? 0) + 1))
                }
              >
                Next →
              </button>
            ) : (
              <button onClick={() => setStep(null)}>Finish ↗</button>
            )}
          </nav>
        </aside>
      )}
    </div>
  );
}
