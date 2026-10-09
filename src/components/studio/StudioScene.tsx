import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Canvas,
  useThree,
  useFrame,
} from "@react-three/fiber";
import { gsap } from "gsap";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import "./studio.css";
import HouseModel from "./HouseModel";
import { OVERVIEW_SPAN, housePoint } from "./houseSpace";
import { journeyStop, journeyPath, type JourneyRecord } from "./houseJourney";

// Suppress THREE.Clock deprecation warning caused by @react-three/fiber
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("THREE.Clock: This module has been deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};

type Point = [number, number, number];
type Mode = "assembled" | "exploded";
function Scene({
  mode,
  step,
  total,
  reduced,
  reset,
  ready,
  fail,
  introState,
  sceneRef,
}: {
  mode: Mode;
  step: number | null;
  total: number;
  reduced: boolean;
  reset: number;
  ready: () => void;
  fail: () => void;
  introState: string;
  sceneRef: React.MutableRefObject<any>;
}) {
  const { size, camera, invalidate, gl } = useThree();
  const controls = useRef<any>(null);
  const entryPose=useRef({position:[7.8,6,9.5] as Point,quaternion:new THREE.Quaternion(),target:new THREE.Vector3(0,1.9,0)});
  useFrame(()=>{
    if(step!==null || !(camera instanceof THREE.OrthographicCamera) || !controls.current) return;
    const target=controls.current.target;
    const visibleHeight=size.height/Math.max(.1,camera.zoom);
    const distance=visibleHeight/(2*Math.tan(THREE.MathUtils.degToRad(62)/2));
    entryPose.current={position:camera.position.clone().sub(target).normalize().multiplyScalar(distance).add(target).toArray() as Point,quaternion:camera.quaternion.clone(),target:target.clone()};
  });

  useEffect(() => {
    sceneRef.current = { camera, invalidate };
    return () => { 
      sceneRef.current = null; 
    };
  }, [camera, invalidate, sceneRef]);

  useEffect(() => {
    if (introState !== "docking" && step === null && camera instanceof THREE.OrthographicCamera) {
      const isMobile = (size.width || window.innerWidth) < 768;
      let zoomX = OVERVIEW_SPAN.width;
      let zoomY = OVERVIEW_SPAN.height;
      if (introState === "loading" || introState === "revealing" || introState === "holding") {
        zoomX = isMobile ? 16.0 : 20.0;
        zoomY = isMobile ? 11.2 : 14.0;
      }
      const safeWidth = size.width || window.innerWidth;
      const safeHeight = size.height || window.innerHeight;
      (camera as THREE.OrthographicCamera).zoom = Math.max(0.1, Math.min(
        safeWidth / zoomX,
        safeHeight / zoomY,
      ));
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [size, camera, invalidate, introState, step]);
  const flight = useRef<gsap.core.Timeline | null>(null);
  const tourAim = useRef(new THREE.Vector3(0,.75,2.35));
  const previousStep = useRef<number | null>(null);
  useEffect(() => {
    if (introState !== "complete" || !controls.current) return;
    if ((step !== null) !== (camera instanceof THREE.PerspectiveCamera)) return;
    const orbit = controls.current;
    const baseZoom = Math.min(size.width / OVERVIEW_SPAN.width, size.height / OVERVIEW_SPAN.height);
    const stop = step === null ? null : journeyStop(step,total);
    const view = stop ? {...stop,zoom:1} : {position:[7.8,6,9.5] as Point,target:[0,mode === "exploded" ? 3 : 1.9,0] as Point,zoom:mode === "exploded" ? .8 : 1};
    const aim = tourAim.current;
    flight.current?.kill();
    const entering=stop && previousStep.current===null;
    const skipping=step!==null && previousStep.current!==null && Math.abs(step-previousStep.current)>1;
    if(entering) aim.copy(entryPose.current.target);
    const timeline = gsap.timeline({onUpdate:()=>{camera.updateProjectionMatrix(); if(stop) camera.lookAt(aim); else orbit.update(); invalidate();}});
    flight.current = timeline;
    // A direct selection fades to its destination, without replaying intermediate rooms.
    if(skipping && !reduced){
      timeline.to(gl.domElement,{opacity:0,duration:.22})
        .add(()=>{camera.position.fromArray(view.position);aim.fromArray(view.target);camera.lookAt(aim);camera.zoom=1;camera.updateProjectionMatrix();invalidate();})
        .to(gl.domElement,{opacity:1,duration:.4});
    } else {
      gsap.set(gl.domElement,{opacity:1});
      const path:Point[]=entering ? [housePoint([0,2.2,6.8]),view.position] : stop && step!==null ? journeyPath(previousStep.current,step,total) : [view.position];
      const travelDuration = reduced ? 0 : entering ? 3.6 : step===null ? 1.2 : Math.min(3.4,Math.max(2.1,path.length*.7));
      path.forEach((point,i)=>timeline.to(camera.position,{x:point[0],y:point[1],z:point[2],duration:travelDuration/path.length,ease:"sine.inOut"},i*travelDuration/path.length));
      timeline.to(stop ? aim : orbit.target,{x:view.target[0],y:view.target[1],z:view.target[2],duration:travelDuration,ease:"sine.inOut"},0)
        .to(camera,{zoom:stop ? 1 : baseZoom*view.zoom,duration:travelDuration,ease:"sine.inOut"},0);
    }
    previousStep.current=step;
    return () => {timeline.kill();gsap.set(gl.domElement,{opacity:1});};
  }, [step, total, reset, mode, introState, reduced, size.width, size.height, camera, invalidate]);
  useEffect(() => {
    const turn = (event: Event) => {
      const orbit = controls.current;
      if (!orbit) return;
      flight.current?.kill();
      orbit.setAzimuthalAngle(orbit.getAzimuthalAngle() + (event as CustomEvent<number>).detail * .25);
      invalidate();
    };
    const tilt = (event: Event) => {
      const orbit = controls.current;
      if (!orbit) return;
      flight.current?.kill();
      orbit.setPolarAngle(THREE.MathUtils.clamp(orbit.getPolarAngle() + (event as CustomEvent<number>).detail * .18,.12,Math.PI/2-.08));
      invalidate();
    };
    window.addEventListener("studio:rotate", turn);
    window.addEventListener("studio:tilt", tilt);
    return () => {window.removeEventListener("studio:rotate", turn);window.removeEventListener("studio:tilt", tilt);};
  }, [invalidate]);
  useEffect(() => {
    ready();
    const lost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, ready, fail]);
  return (
    <>
      {step !== null && <PerspectiveCamera makeDefault position={entryPose.current.position} quaternion={entryPose.current.quaternion} fov={62} near={.035} far={80} />}
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[-4, 9, 5]}
        intensity={2.5}
        color="#e5e3c9"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[5, 3, -5]} intensity={1.3} color="#d2d8ce" />
      <Environment resolution={64}>
        <Lightformer
          position={[0, 5, -3]}
          scale={[8, 4, 1]}
          intensity={1.2}
          color="#f0dfc7"
        />
      </Environment>
      <HouseModel exploded={mode === "exploded" && step === null} reduced={reduced} touring={step !== null} />
      <ContactShadows
        position={[0, -0.56, 0]}
        opacity={0.45}
        scale={16}
        blur={2.5}
        far={6}
        frames={1}
        resolution={256}
        color="#000000"
      />
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 1.9, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI / 2 - 0.08}
        onStart={() => flight.current?.kill()}
        enableDamping={!reduced}
        dampingFactor={0.09}
        enabled={introState === "complete" && step === null}
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
  componentDidCatch(error: any) {
    console.error("SceneBoundary caught an error:", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function StudioScene({ journey }: { journey: JourneyRecord[] }) {
  const [mode, setMode] = useState<Mode>("assembled"),
    [step, setStep] = useState<number | null>(null),
    [reset, setReset] = useState(0),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  
  const shouldSkipIntro = typeof window !== "undefined" && (
    sessionStorage.getItem('skipIntro') === 'true' ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const [introState, setIntroState] = useState<"loading" | "revealing" | "holding" | "docking" | "complete">(
    () => shouldSkipIntro ? "complete" : "loading"
  );
  
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const touring = step !== null;
  useEffect(() => {
    if (!touring) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    containerRef.current?.querySelector<HTMLButtonElement>('[aria-label="Exit journey"]')?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus({preventScroll:true}); };
  }, [touring]);
  const sceneRef = useRef<any>(null);
  const clipPlane = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), 10.0)).current;
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    const explore = () => {
      setMode("assembled");
      setStep(0);
      document.getElementById("model-view")?.focus({ preventScroll: true });
    };
    window.addEventListener("studio:explore", explore);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("studio:explore", explore);
    };
  }, []);

  // Scroll lock during intro
  useEffect(() => {
    if (introState !== "complete") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [introState]);

  // Intro Sequence Orchestration
  useEffect(() => {
    if (introState === "loading" && ready && !failed) {
      setIntroState("revealing");
      
      const loader = document.getElementById("global-intro-loader");
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 400);
      }
      
      const tl = gsap.timeline({
        onUpdate: () => sceneRef.current?.invalidate(),
      });

      clipPlane.constant = -1.0;

      // 1. Section Reveal
      tl.to(clipPlane, {
        constant: 9,
        duration: 2.8,
        ease: "power2.inOut"
      });

      // 2. Hold momentarily
      tl.add(() => setIntroState("holding"));
      tl.to({}, { duration: 0.4 });

      // 3. Docking (Iris Wipe)
      tl.add(() => {
        setIntroState("docking");
        
        const baseStyle = 'position:fixed;top:0;bottom:0;z-index:2147483647;pointer-events:none;';
        const left = document.createElement('div');
        left.style.cssText = baseStyle + 'left:0;width:0;background:linear-gradient(to right, #101412 70%, #2a1008 100%);';
        const right = document.createElement('div');
        right.style.cssText = baseStyle + 'right:0;width:0;background:linear-gradient(to left, #101412 70%, #2a1008 100%);';
        document.body.appendChild(left);
        document.body.appendChild(right);

        // Doors close → snap layout → doors open
        gsap.to([left, right], {
          width: '50vw',
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: () => {
            // Screen fully covered — snap the layout
            if (containerRef.current) containerRef.current.style.cssText = '';
            const canvas = containerRef.current?.querySelector('.studio-canvas') as HTMLElement;
            if (canvas) canvas.style.cssText = '';
            setIntroState("complete");
            sessionStorage.setItem('skipIntro', 'true');

            setTimeout(() => {
              gsap.to([left, right], {
                width: 0,
                duration: 0.85,
                ease: 'power4.inOut',
                onComplete: () => { left.remove(); right.remove(); }
              });
            }, 100);
          }
        });
      });
    }

    // If we skipped the intro (returning visitor), still clean up the loader
    if (introState === "complete" && shouldSkipIntro) {
      const loader = document.getElementById("global-intro-loader");
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 100);
      }
    }
  }, [introState, ready, failed]);
  const readyCallback = useRef(() => setReady(true)).current,
    failCallback = useRef(() => setFailed(true)).current;
  const rotate = (direction: number) =>
    window.dispatchEvent(
      new CustomEvent("studio:rotate", { detail: direction }),
    );
    
  const isIntro = introState !== "complete";

  return (
    <div 
      className={`studio-interactive ${isIntro ? 'is-intro' : ''} ${step !== null ? 'is-touring' : ''}`} 
      role={touring ? 'dialog' : undefined}
        data-lenis-prevent={touring ? '' : undefined}
      aria-modal={touring || undefined}
      aria-label={touring ? 'Guided house journey' : undefined}
      onKeyDown={event => {
        if (!touring) return;
        if(event.key === 'Escape') {setStep(null);return;}
        if(event.key !== 'Tab') return;
        const items=Array.from(containerRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], select, [tabindex="0"]') || []).filter(el=>el.getClientRects().length>0);
        const first=items[0],last=items[items.length-1];
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
        if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
      }}
      data-mode={mode} 
      ref={containerRef}
    >
      {isIntro && <div className="intro-overlay" ref={overlayRef}></div>}
      <div
        className="studio-canvas"
        id="model-view"
        tabIndex={0}
        role="region"
        aria-label="Interactive engineering studio. Drag or use arrow keys to rotate. Model controls are below."
        onKeyDown={(event) => {
          if (event.key === "Escape") setStep(null);
          if (step !== null) {
            if(event.key === 'ArrowRight') {event.preventDefault();setStep(Math.min(journey.length-1,step+1));}
            if(event.key === 'ArrowLeft') {event.preventDefault();setStep(Math.max(0,step-1));}
            return;
          }
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent("studio:tilt", {detail:event.key === "ArrowUp" ? -1 : 1}));
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            rotate(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {!failed && (
          <SceneBoundary onError={failCallback}>
            <Canvas
              orthographic
              camera={{ position: [7.8, 6, 9.5], zoom: 70, near: 0.1, far: 70 }}
              shadows="percentage"
              dpr={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : [1, 1.5]}
              frameloop="demand"
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl, camera, size }) => {
                gl.clippingPlanes = [clipPlane];
                const isMobile = (size.width || window.innerWidth) < 768;
                let zX = OVERVIEW_SPAN.width;
                let zY = OVERVIEW_SPAN.height;
                if (introState === "loading" || introState === "revealing" || introState === "holding") {
                  zX = isMobile ? 16.0 : 20.0;
                  zY = isMobile ? 11.2 : 14.0;
                }
                const safeWidth = size.width || window.innerWidth;
                const safeHeight = size.height || window.innerHeight;
                (camera as THREE.OrthographicCamera).zoom = Math.max(0.1, Math.min(
                  safeWidth / zX,
                  safeHeight / zY,
                ));
                camera.updateProjectionMatrix();
              }}
            >
              <Suspense fallback={null}>
                <Scene
                  mode={mode}
                  step={step}
                  total={journey.length}
                  reduced={reduced}
                  reset={reset}
                  ready={readyCallback}
                  fail={failCallback}
                  introState={introState}
                  sceneRef={sceneRef}
                />
              </Suspense>
            </Canvas>
          </SceneBoundary>
        )}
        {(!ready || failed) && (
          <div className={`model-loading ${isIntro ? 'is-intro-loading' : ''}`}>
            {failed && (
              <img
                src="/images/house-reference.png"
                alt="Reference illustration of the Pakistani brick-and-plaster house"
              />
            )}
            {!failed && isIntro && (
              <span style={{color: '#8b9586', font: '9px var(--font-mono)', letterSpacing: '0.15em'}}>
                SETTING OUT THE STUDIO...
              </span>
            )}
            {(!isIntro || failed) && (
              <span>
                {failed
                  ? "The house, in illustration form. Explore the work below."
                  : "Setting out the studio…"}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="studio-tools">
        <div role="group" aria-label="Model display">
          {(["assembled", "exploded"] as Mode[]).map((item) => (
            <button
              key={item}
              aria-pressed={mode === item}
              disabled={failed}
              onClick={() => { setStep(null); setMode(item); }}
            >
              {item === "assembled" ? "General" : "Exploded"}
            </button>
          ))}
        </div>
        <button
          className="reset-view"
          disabled={failed}
          onClick={() => {
            setMode("assembled");
            setStep(null);
            setReset((n) => n + 1);
          }}
          aria-label="Reset model view"
        >
          ↺ <span>Reset view</span>
        </button>
      </div>
      {step === null ? (
        <div className="journey-start"><button onClick={() => {setMode("assembled");setStep(0);}} disabled={!journey.length}>Explore my journey <span aria-hidden="true">→</span></button><span>{journey.length} milestones · oldest to newest</span></div>
      ) : (
        <aside className="journey-panel" aria-label="Guided portfolio journey">
          <div className="journey-heading"><span>{String(step+1).padStart(2,'0')} / {String(journey.length).padStart(2,'0')} · {journeyStop(step,journey.length).name}</span><button onClick={()=>setStep(null)} aria-label="Exit journey">×</button></div>
          <div className="journey-copy" aria-live="polite" aria-atomic="true">
            <p className="label">{journey[step].date} · {journey[step].category}</p>
            <h2>{journey[step].title}</h2>
            <p>{journey[step].description}</p>
            <a href={journey[step].href}>Read the full story ↗</a>
          </div>
          <div className="journey-progress" aria-hidden="true"><span style={{width:`${(step+1)/journey.length*100}%`}} /></div>
          <nav aria-label="Journey steps"><button disabled={step===0} onClick={()=>setStep(i=>Math.max(0,(i??0)-1))}>← Previous</button>
            <label className="journey-skip">Milestone<select aria-label="Choose journey milestone" value={step} onChange={e=>setStep(Number(e.target.value))}>{journey.map((record,i)=><option key={record.id} value={i}>{String(i+1).padStart(2,'0')} · {record.date} · {record.title}</option>)}</select></label>
            {step<journey.length-1 ? <button onClick={()=>setStep(i=>Math.min(journey.length-1,(i??0)+1))}>Next →</button> : <button onClick={()=>{setStep(null);setReset(n=>n+1)}}>Finish ↗</button>}
          </nav>
        </aside>
      )}
    </div>
  );
}
