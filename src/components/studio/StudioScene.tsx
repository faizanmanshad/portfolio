import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Environment, Lightformer, Html, ContactShadows, Edges } from '@react-three/drei';
import * as THREE from 'three';
import './studio.css';
type Point = [number, number, number];
type Mode = 'assembled' | 'exploded' | 'drawing';
type Topic = 'structure' | 'practice' | 'research';
export type StudioRecord = { title: string; description: string; href: string; label: string };
type Records = Record<Topic, StudioRecord>;
const ORANGE = '#e97939', CREAM = '#d8ceba', STEEL = '#414849';
function Block({ at, size, color = CREAM, wire = false, radius = 0.035 }: { at: Point; size: Point; color?: string; wire?: boolean; radius?: number }) {
  if (wire) return <mesh position={at}><boxGeometry args={size}/><meshBasicMaterial color="#aac2af" transparent opacity={0.035} depthWrite={false}/><Edges color="#a2b8a5"/></mesh>;
  return <RoundedBox position={at} args={size} radius={Math.min(radius, ...size.map(n => n / 3))} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.76} metalness={color === STEEL ? 0.3 : 0.04}/></RoundedBox>;
}
function Member({ from, to, color = STEEL, radius = 0.028 }: { from: Point; to: Point; color?: string; radius?: number }) {
  const start = new THREE.Vector3(...from), end = new THREE.Vector3(...to);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
  return <mesh position={mid} quaternion={rotation} castShadow><cylinderGeometry args={[radius, radius, start.distanceTo(end), 8]}/><meshStandardMaterial color={color} roughness={0.6}/></mesh>;
}
function Tree({ at, scale = 1 }: { at: Point; scale?: number }) {
  return <group position={at} scale={scale}><Block at={[0,0.12,0]} size={[0.6,0.25,0.6]} color="#8d897d"/><Member from={[0,0.2,0]} to={[0,1,0]} radius={0.04} color="#74624e"/>{[[0,1.04,0],[-0.17,0.89,0.09],[0.16,0.85,-0.07]].map((p,i)=><mesh key={i} position={p as Point} castShadow><icosahedronGeometry args={[0.31-i*0.035,1]}/><meshStandardMaterial color={['#6b795c','#83906c','#58634d'][i]} roughness={1}/></mesh>)}</group>;
}
function Person({ at }: { at: Point }) {
  return <group position={at}><mesh position={[0,0.42,0]} castShadow><sphereGeometry args={[0.065,12,8]}/><meshStandardMaterial color="#e0bda0"/></mesh><Block at={[0,0.27,0]} size={[0.12,0.22,0.1]} color={ORANGE}/>{[-0.036,0.036].map(x=><Member key={x} from={[x,0.02,0]} to={[x,0.2,0]} radius={0.024}/>)}</group>;
}
function Hotspot({ at, label, number, onSelect }: { at: Point; label: string; number: string; onSelect: () => void }) {
  return <Html position={at} center zIndexRange={[30,0]}><button className="model-hotspot" aria-label={label} onClick={onSelect}><span>{number}</span><span className="hotspot-label">{label}</span></button></Html>;
}
function Pavilion({ mode, selected, select, reduced }: { mode: Mode; selected: Topic|null; select: (topic:Topic)=>void; reduced:boolean }) {
  const floor=useRef<THREE.Group>(null), roof=useRef<THREE.Group>(null);
  const { invalidate }=useThree(); const scroll=useRef(0); const [hovered,setHovered]=useState(false); const wire=mode==='drawing';
  useEffect(()=>{ const change=()=>{ const rect=document.getElementById('studio')?.getBoundingClientRect(); scroll.current=reduced||!rect?0:THREE.MathUtils.clamp(-rect.top/rect.height,0,1)*0.55; invalidate(); };change();window.addEventListener('scroll',change,{passive:true});return()=>window.removeEventListener('scroll',change); },[invalidate,reduced]);
  useFrame((_,delta)=>{const target=mode==='exploded'?0.72:scroll.current;let moving=false;[floor.current,roof.current].forEach((group,index)=>{if(!group)return;const y=target*(index+1);group.position.y=reduced?y:THREE.MathUtils.damp(group.position.y,y,5,Math.min(delta,0.05));if(Math.abs(group.position.y-y)>0.001)moving=true;});if(moving)invalidate();});
  const inspect=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();select('structure');};
  return <group position={[-0.95,0,0]}>
    <Block at={[0,0.08,0]} size={[3.45,0.19,2.8]} wire={wire}/>
    <Block at={[-1.34,0.72,-0.25]} size={[0.09,1.15,2]} color="#827c6b" wire={wire}/>
    <Block at={[0,0.72,-1.12]} size={[2.6,1.15,0.055]} color="#52605a" wire={wire}/>
    {[-1.15,-0.38,0.38,1.15].map(x=><Block key={x} at={[x,0.72,-1.05]} size={[0.045,1.15,0.06]} color={STEEL}/>)}
    <Block at={[-0.6,0.55,-0.4]} size={[1.05,0.08,0.48]} color="#ac8b61"/>
    {[-1.03,-0.17].map(x=><Block key={x} at={[x,0.33,-0.4]} size={[0.06,0.42,0.36]} color={STEEL}/>)}
    <Block at={[-0.6,0.72,-0.45]} size={[0.33,0.25,0.045]} color="#292e2d"/><Block at={[-0.3,0.602,-0.27]} size={[0.22,0.012,0.16]} color="#eee4d2"/>
    {[0,1].map(level=><group key={level}>{[-1.3,1.3].flatMap(x=>[-1.04,1.04].map(z=><group key={`${x}${z}`}><Block at={[x,0.8+level*1.28,z]} size={[0.15,1.24,0.15]} color={STEEL} wire={wire}/><Block at={[x,0.22+level*1.28,z]} size={[0.3,0.065,0.3]} color={STEEL}/></group>))}</group>)}
    <group ref={floor}><Block at={[0,1.48,0]} size={[3.3,0.18,2.65]} wire={wire}/><Block at={[0,1.32,0.97]} size={[2.85,0.17,0.12]} color={STEEL} wire={wire}/><Block at={[0.1,1.61,-0.75]} size={[1.1,0.11,0.45]} color="#b49a77" wire={wire}/><Block at={[-0.95,1.76,-0.7]} size={[0.45,0.45,0.45]} color="#a7ae97" wire={wire}/><Hotspot at={[-1.55,1.85,0.8]} number="02" label="Digital construction" onSelect={()=>select('practice')}/></group>
    <group ref={roof}>
      {[-1.17,1.17].map(z=><Block key={z} at={[0,2.85,z]} size={[3.35,0.22,0.38]} wire={wire}/>)}
      {[-1.48,1.48].map(x=><Block key={x} at={[x,2.85,0]} size={[0.38,0.22,2.15]} wire={wire}/>)}
      <group onPointerOver={e=>{e.stopPropagation();setHovered(true);}} onPointerOut={()=>setHovered(false)} onClick={inspect}><Block at={[0,2.63,1.04]} size={[2.8,0.2,0.15]} color={hovered||selected==='structure'?'#ffac68':ORANGE} wire={wire}/>{[-1.24,1.24].map(x=><Block key={x} at={[x,2.63,1.14]} size={[0.25,0.3,0.055]} color={ORANGE}/>)}</group>
      {[-0.8,0,0.8].map(x=><Block key={x} at={[x,2.7,0]} size={[0.075,0.1,2.1]} color={STEEL} wire={wire}/>)}
      <Hotspot at={[1.5,2.7,1.15]} number="01" label="Inspect the structure" onSelect={()=>select('structure')}/><Hotspot at={[0.6,3.15,-1]} number="03" label="BIM to augmented reality" onSelect={()=>select('research')}/>
    </group>
    {Array.from({length:8},(_,i)=><Block key={i} at={[1.02,0.21+i*0.155,0.92-i*0.22]} size={[0.54,0.12,0.26]} color="#b7ac96" wire={wire}/>)}
    <Member from={[1.32,0.65,1]} to={[1.32,1.76,-0.62]} radius={0.018}/><Person at={[-0.7,0.18,1.02]}/>
  </group>;
}
function Bridge({ wire, selected, select }: { wire:boolean;selected:boolean;select:()=>void }) {
 return <group position={[1,0.25,0.25]} onClick={event=>{event.stopPropagation();select();}}><Block at={[1.3,0.2,0]} size={[2.8,0.14,0.75]} color="#aaa58f" wire={wire}/>{[0.08,2.55].map(x=><Block key={x} at={[x,-0.08,0]} size={[0.35,0.55,0.95]} color="#9c978c" wire={wire}/>)}{[-0.4,0.4].map(z=><group key={z}><Member from={[0,0.23,z]} to={[2.65,0.23,z]}/><Member from={[0,0.82,z]} to={[2.65,0.82,z]} color={selected?ORANGE:STEEL}/>{Array.from({length:5},(_,i)=><group key={i}><Member from={[i*0.53,0.23,z]} to={[(i+1)*0.53,0.82,z]}/><Member from={[i*0.53,0.82,z]} to={[(i+1)*0.53,0.23,z]} radius={0.018}/></group>)}</group>)}{Array.from({length:15},(_,i)=><Block key={i} at={[0.05+i*0.18,0.28,0]} size={[0.012,0.012,0.68]} color="#777c70"/>)}</group>;
}
function Scene({ mode,selected,select,reduced,reset,ready,fail }: { mode:Mode;selected:Topic|null;select:(topic:Topic)=>void;reduced:boolean;reset:number;ready:()=>void;fail:()=>void }) {
 const {size,camera,invalidate,gl}=useThree();const controls=useRef<any>(null);
 useEffect(()=>{(camera as THREE.OrthographicCamera).zoom=Math.min(size.width/10.3,size.height/7.1);camera.updateProjectionMatrix();invalidate();},[size,camera,invalidate]);
 useEffect(()=>{camera.position.set(7.8,6,9.5);controls.current?.target.set(0.2,1,0);controls.current?.update();invalidate();},[reset,camera,invalidate]);
 useEffect(()=>{const turn=(event:Event)=>{const orbit=controls.current;if(orbit)orbit.setAzimuthalAngle(THREE.MathUtils.clamp(orbit.getAzimuthalAngle()+(event as CustomEvent<number>).detail*0.25,-0.65,1.35));invalidate();};window.addEventListener('studio:rotate',turn);return()=>window.removeEventListener('studio:rotate',turn);},[invalidate]);
 useEffect(()=>{ready();const lost=(event:Event)=>{event.preventDefault();fail();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,ready,fail]);
 return <><ambientLight intensity={0.75}/><directionalLight position={[-4,9,5]} intensity={3.2} color="#ffe9c9" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={0.04}/><directionalLight position={[5,3,-5]} intensity={1.3} color="#d2d8ce"/>
 <Environment resolution={64}><Lightformer position={[0,5,-3]} scale={[8,4,1]} intensity={1.2} color="#f0dfc7"/></Environment>
 <group position={[0,-0.3,0]}>
 <Block at={[0.15,-0.35,0]} size={[8,0.5,4.7]} color="#242a28" radius={0.1}/><Block at={[0.15,-0.083,0]} size={[7.82,0.035,4.52]} color="#343936"/>
 {Array.from({length:17},(_,i)=><Member key={`x${i}`} from={[-3.6+i*0.45,-0.058,-2.1]} to={[-3.6+i*0.45,-0.058,2.1]} radius={0.003} color="#61665c"/>)}{Array.from({length:10},(_,i)=><Member key={`z${i}`} from={[-3.6,-0.057,-2+i*0.45]} to={[3.9,-0.057,-2+i*0.45]} radius={0.003} color="#61665c"/>)}
 <Pavilion mode={mode} selected={selected} select={select} reduced={reduced}/><Bridge wire={mode==='drawing'} selected={selected==='practice'} select={()=>select('practice')}/>
 <Tree at={[-3,0,-0.7]} scale={1.1}/><Tree at={[-2.6,0,1.65]} scale={0.68}/><Tree at={[3.35,0,-1.4]} scale={0.8}/><Block at={[-0.75,0.08,1.9]} size={[1.6,0.15,0.24]} color="#a58e6c"/><Person at={[2.9,0,1.25]}/><Block at={[-2.6,-0.32,2.36]} size={[0.72,0.045,0.018]} color={ORANGE}/>
 </group><ContactShadows position={[0,-0.56,0]} opacity={0.45} scale={16} blur={2.5} far={6} frames={1} resolution={256} color="#000000"/>
 <OrbitControls ref={controls} makeDefault target={[0.2,1,0]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI/5} maxPolarAngle={Math.PI/2.5} minAzimuthAngle={-0.65} maxAzimuthAngle={1.35} enableDamping={!reduced} dampingFactor={0.09}/></>;
}
class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}componentDidCatch(){this.props.onError();}render(){return this.state.failed?null:this.props.children;}}
export default function StudioScene({ records }: { records:Records }) {
 const [mode,setMode]=useState<Mode>('assembled'),[selected,select]=useState<Topic|null>(null),[reset,setReset]=useState(0),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const [reduced,setReduced]=useState(()=>typeof window!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(query.matches);query.addEventListener('change',update);const explore=()=>{select('structure');document.getElementById('model-view')?.focus({preventScroll:true});};window.addEventListener('studio:explore',explore);return()=>{query.removeEventListener('change',update);window.removeEventListener('studio:explore',explore);};},[]);
 const readyCallback=useRef(()=>setReady(true)).current,failCallback=useRef(()=>setFailed(true)).current;
 const rotate=(direction:number)=>window.dispatchEvent(new CustomEvent('studio:rotate',{detail:direction}));
 return <div className="studio-interactive" data-mode={mode}>
 <div className="studio-canvas" id="model-view" tabIndex={0} role="region" aria-label="Interactive engineering studio. Drag or use arrow keys to rotate. Model controls are below." onKeyDown={event=>{if(event.key==='Escape')select(null);if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();rotate(event.key==='ArrowLeft'?-1:1);}}}>
 {!failed&&<SceneBoundary onError={failCallback}><Canvas orthographic camera={{position:[7.8,6,9.5],zoom:70,near:0.1,far:70}} shadows={THREE.PCFShadowMap} dpr={[1,1.5]} frameloop="demand" gl={{antialias:true,alpha:true}}><Suspense fallback={null}><Scene mode={mode} selected={selected} select={select} reduced={reduced} reset={reset} ready={readyCallback} fail={failCallback}/></Suspense></Canvas></SceneBoundary>}
 {(!ready||failed)&&<div className="model-loading"><img src="/images/studio-fallback.svg" alt="Architectural drawing of a pavilion with a truss bridge"/><span>{failed?'The studio, in drawing form. Explore the work below.':'Setting out the studio…'}</span></div>}
 </div>
 <div className="studio-tools"><div role="group" aria-label="Model display">{(['assembled','exploded','drawing'] as Mode[]).map(item=><button key={item} aria-pressed={mode===item} disabled={failed} onClick={()=>setMode(item)}>{item==='drawing'?'Blueprint':item}</button>)}</div>
 <div className="rotation-buttons" role="group" aria-label="Rotate the model"><button disabled={failed} aria-label="Rotate model left" onClick={()=>rotate(-1)}>←</button><button disabled={failed} aria-label="Rotate model right" onClick={()=>rotate(1)}>→</button></div>
 <button className="reset-view" disabled={failed} onClick={()=>{setMode('assembled');select(null);setReset(n=>n+1);}} aria-label="Reset model view">↺ <span>Reset view</span></button></div>
 <div className="studio-topics" role="group" aria-label="Explore my work through the model">{(Object.keys(records) as Topic[]).map((topic,index)=><button key={topic} aria-pressed={selected===topic} onClick={()=>select(selected===topic?null:topic)}><span>0{index+1}</span>{records[topic].label}</button>)}</div>
 {selected&&<aside className="model-story" aria-live="polite"><button className="close-story" aria-label="Close model detail" onClick={()=>select(null)}>×</button><p className="label">{records[selected].label}</p><h2>{records[selected].title}</h2><p>{records[selected].description}</p><a href={records[selected].href}>Explore this work <span>↗</span></a></aside>}
 </div>;
}
