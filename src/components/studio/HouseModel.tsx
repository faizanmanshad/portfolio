import { useMemo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as T from 'three';

type V = [number, number, number];
const cream='#cbbd9f', green='#2b4036';
function Box({p,s,c=cream,map}:{p:V;s:V;c?:string;map?:T.Texture}) {
 return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} map={map} roughness={.88}/></mesh>;
}
function Rod({a,b,r=.018,c=green}:{a:V;b:V;r?:number;c?:string}) {
 const va=new T.Vector3(...a),vb=new T.Vector3(...b),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),vb.clone().sub(va).normalize());
 return <mesh position={va.add(vb).multiplyScalar(.5)} quaternion={q} castShadow><cylinderGeometry args={[r,r,new T.Vector3(...a).distanceTo(new T.Vector3(...b)),6]}/><meshStandardMaterial color={c} roughness={.7}/></mesh>;
}
function Cylinder({p,r,h,c}:{p:V;r:number;h:number;c:string}) {return <mesh position={p} castShadow><cylinderGeometry args={[r,r,h,24]}/><meshStandardMaterial color={c} roughness={.75}/></mesh>}
// Deterministic procedural materials: no downloaded textures or external model dependencies.
function texture(kind:'brick'|'plaster'|'paving') {
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d')!;let seed=37;
 const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 ctx.fillStyle=kind==='brick'?'#b0a08b':kind==='plaster'?'#d4c9b2':'#a89d89';ctx.fillRect(0,0,512,512);
 if(kind==='brick'||kind==='paving') {
 const w=kind==='brick'?85:128,h=kind==='brick'?35:85;
 for(let row=0;row<512/h;row++)for(let col=-1;col<512/w+1;col++){
 const n=Math.floor(random()*24);ctx.fillStyle=kind==='brick'?`rgb(${137+n},${91+n},${68+n})`:`rgb(${155+n},${143+n},${121+n})`;
 ctx.fillRect(col*w+(row%2)*w/2+2,row*h+2,w-4,h-4);
 }
 } else {
 for(let i=0;i<2400;i++){ctx.fillStyle=`rgba(123,94,60,${random()*.11})`;ctx.fillRect(random()*512,random()*512,random()*18+1,random()*10+1)}
 }
 const result=new T.CanvasTexture(canvas);result.colorSpace=T.SRGBColorSpace;result.wrapS=result.wrapT=T.RepeatWrapping;result.anisotropy=4;return result;
}
function Window({p,width=.82,height=1.05}:{p:V;width?:number;height?:number}) {
 return <group position={p} name="window-and-security-grille">
 <Box p={[0,0,-.02]} s={[width+.12,height+.13,.12]} c="#a58c60"/>
 <Box p={[0,0,.051]} s={[width,height,.025]} c="#3a3b2c"/>
 <mesh position={[0,0,.069]}><planeGeometry args={[width-.08,height-.07]}/><meshStandardMaterial color="#b79a62" emissive="#956025" emissiveIntensity={.22} roughness={.45}/></mesh>
 {Array.from({length:7},(_,i)=><Rod key={i} a={[-width/2+i*width/6,-height/2,.12]} b={[-width/2+i*width/6,height/2,.12]} r={.012}/>)}
 {[-height/2,-height*.28,height*.28,height/2].map(y=><Rod key={y} a={[-width/2,y,.12]} b={[width/2,y,.12]} r={.014}/>)}
 {[-.24,0,.24].map(x=><mesh key={x} position={[x,height*.34,.125]} rotation={[0,0,Math.PI/4]}><torusGeometry args={[.057,.009,4,4]}/><meshStandardMaterial color={green}/></mesh>)}
 <Box p={[0,height/2+.15,.13]} s={[width+.35,.09,.42]}/>
 <Box p={[0,-height/2-.09,.04]} s={[width+.18,.08,.23]}/>
 </group>;
}
function Door({p,open=false}:{p:V;open?:boolean}) {return <group position={p} name="door">
 {[-.37,.37].map(x=><Box key={x} p={[x,.7,0]} s={[.07,1.4,.12]} c="#8d734f"/>)}
 <Box p={[0,1.39,0]} s={[.8,.08,.12]} c="#8d734f"/>
 <group position={[-.33,0,.075]} rotation={[0,open?-Math.PI*.6:0,0]}>
 <Box p={[.33,.64,0]} s={[.65,1.27,.045]} c="#394434"/>
 {[.16,.5].map(x=><group key={x}><Box p={[x,.94,.03]} s={[.26,.49,.02]} c="#61533b"/><Box p={[x,.36,.03]} s={[.26,.39,.02]} c="#4a4634"/></group>)}
 <Rod a={[.56,.55,.07]} b={[.56,.71,.07]} c="#bb9d53" r={.018}/>
 </group></group>}
function Lantern({p}:{p:V}) {return <group position={p} name="lantern"><Box p={[0,0,0]} s={[.12,.19,.12]} c="#e9b86c"/><mesh><boxGeometry args={[.1,.16,.1]}/><meshStandardMaterial color="#ffd993" emissive="#ffb342" emissiveIntensity={1.3}/></mesh><Box p={[0,.12,0]} s={[.18,.035,.18]} c={green}/><Box p={[0,-.12,0]} s={[.15,.04,.15]} c={green}/>{[-.055,.055].flatMap(x=>[-.055,.055].map(z=><Rod key={`${x}${z}`} a={[x,-.1,z]} b={[x,.1,z]} r={.009}/>))}</group>}
function Rail({width=3.5}:{width?:number}) {return <group name="iron-balustrade">
 {[.06,.18,.7,.78].map(y=><Rod key={y} a={[-width/2,y,0]} b={[width/2,y,0]} r={.018}/>)}
 {Array.from({length:Math.ceil(width/.12)+1},(_,i)=>{const x=-width/2+i*.12;return <Rod key={i} a={[x,.05,0]} b={[x,.78,0]} r={.013}/>})}
 {[-width*.3,0,width*.3].map(x=><mesh position={[x,.43,.025]} rotation={[0,0,Math.PI/4]} key={x}><torusGeometry args={[.12,.014,5,4]}/><meshStandardMaterial color="#9a8856"/></mesh>)}
 </group>}
function Plant({p,scale=1,flowers=false}:{p:V;scale?:number;flowers?:boolean}) {
 return <group position={p} scale={scale} name="terracotta-planter">
 <mesh position={[0,.12,0]} castShadow><cylinderGeometry args={[.15,.1,.24,12]}/><meshStandardMaterial color="#ae6340" roughness={1}/></mesh>
 <Cylinder p={[0,.245,0]} r={.15} h={.025} c="#cf9364"/>
 {Array.from({length:7},(_,i)=>{const angle=i*2.4;return <group key={i}><Rod a={[0,.22,0]} b={[Math.cos(angle)*.13,.47+(i%3)*.06,Math.sin(angle)*.13]} r={.007} c="#4b6238"/><mesh position={[Math.cos(angle)*.14,.47+(i%3)*.06,Math.sin(angle)*.14]} scale={[.085,.16,.04]} rotation={[0,angle,.45]} castShadow><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={flowers&&i%2===0?'#d19e92':['#597449','#788448','#405b36'][i%3]}/></mesh></group>})}
 </group>
}
// Leaves and flowers share geometry/materials through instancing instead of hundreds of draw calls.
function Vine({p,height=2.7,flowers=false}:{p:V;height?:number;flowers?:boolean}) {
 const leaves=useRef<T.InstancedMesh>(null);
 useEffect(()=>{const mesh=leaves.current;if(!mesh)return;const dummy=new T.Object3D();for(let i=0;i<100;i++){const a=i*2.399,y=(i/100)*height;dummy.position.set(Math.sin(a)*(.14+.12*Math.sin(i)),y,Math.cos(a)*.16);dummy.rotation.set(i*.7,a,i*.4);dummy.scale.set(.055+(i%4)*.013,.075,.035);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color(flowers&&i%3===0?'#b63c70':['#526a37','#7e8b4b','#3b5a34'][i%3]));}mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;},[height,flowers]);
 return <group position={p} name={flowers?'bougainvillea':'climber'}><Rod a={[0,0,0]} b={[0,height,0]} c="#665137" r={.025}/><instancedMesh ref={leaves} args={[undefined,undefined,100]} castShadow><icosahedronGeometry args={[1,0]}/><meshStandardMaterial roughness={1}/></instancedMesh></group>
}
function ShadeCanopy() {
 const geometry=useMemo(()=>{const g=new T.PlaneGeometry(1.55,1.18,12,10);const positions=g.attributes.position;for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i);positions.setZ(i,-.1*(1-(x/.775)**2)*(1-(y/.59)**2));}g.computeVertexNormals();return g;},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh position={[0,1.23,0]} rotation={[-Math.PI/2,0,0]} geometry={geometry} castShadow receiveShadow><meshStandardMaterial color="#b39872" side={T.DoubleSide} roughness={1}/></mesh>;
}
function Desk(){return <group position={[.45,.1,-.35]} name="future-work-room-desk">
 <Box p={[0,.55,0]} s={[1.3,.07,.6]} c="#a08255"/>{[-.53,.53].map(x=><Box key={x} p={[x,.28,0]} s={[.06,.5,.5]} c={green}/>)}
 <Box p={[.15,.81,-.16]} s={[.52,.34,.045]} c="#27322e"/><Box p={[.15,.81,-.13]} s={[.46,.28,.008]} c="#7faaa3"/><Box p={[.15,.63,-.16]} s={[.045,.16,.045]} c={green}/>
 <Box p={[-.38,.6,.02]} s={[.32,.025,.24]} c="#77847d"/><Box p={[-.38,.72,-.08]} s={[.32,.23,.025]} c="#6b8d84"/><Box p={[.15,.6,.16]} s={[.33,.025,.12]} c="#3b4540"/><Box p={[.43,.61,.17]} s={[.055,.035,.085]} c="#b5baa9"/>
 {/* Small details remain legible when the tour approaches the workstation. */}
  {Array.from({length:30},(_,i)=><Box key={`key${i}`} p={[.01+(i%10)*.03,.617,.125+Math.floor(i/10)*.03]} s={[.023,.008,.022]} c="#8c9689"/>)}
  {[-.02,.13,.31].map(x=><Box key={`cadx${x}`} p={[x,.82,-.121]} s={[.006,.2,.002]} c="#bed2b6"/>)}
  {[.72,.82,.92].map(y=><Box key={`cady${y}`} p={[.145,y,-.121]} s={[.34,.005,.002]} c="#bed2b6"/>)}
  <Box p={[-.38,.73,-.064]} s={[.28,.18,.004]} c="#263f38"/>
  {Array.from({length:4},(_,i)=><Box key={`code${i}`} p={[-.4,.78-i*.026,-.06]} s={[.18-i*.023,.005,.002]} c="#97b6a1"/>)}
  <Box p={[.48,.6,-.17]} s={[.17,.025,.18]} c="#ddd2b9"/>
  <Box p={[.1,.36,.65]} s={[.4,.07,.35]} c={green}/><Box p={[.1,.61,.8]} s={[.4,.43,.065]} c={green}/><Cylinder p={[.1,.2,.65]} r={.025} h={.3} c="#686d64"/>
 </group>}
export default function HouseModel({exploded,reduced,touring=false}:{exploded:boolean;reduced:boolean;touring?:boolean}) {
 const mats=useMemo(()=>({brick:texture('brick'),plaster:texture('plaster'),paving:texture('paving')}),[]);
 useEffect(()=>()=>Object.values(mats).forEach(t=>t.dispose()),[mats]);
 const first=useRef<T.Group>(null),roof=useRef<T.Group>(null);const {invalidate}=useThree();
 useEffect(()=>invalidate(),[exploded,invalidate]);
 useFrame((_,dt)=>{[first.current,roof.current].forEach((g,i)=>{if(!g)return;const target=exploded?(i+1)*1.05:0;g.position.y=reduced?target:T.MathUtils.damp(g.position.y,target,5,Math.min(dt,.05));if(Math.abs(target-g.position.y)>.001)invalidate()})});
 function Level({upper=false}:{upper?:boolean}) {return <group name={upper?'first-floor-shell':'ground-floor-shell'}>
   {upper ? <>
   <Box p={[-.65,.1,-.25]} s={[2.8,.2,3.55]} map={mats.paving} c="#ffffff"/>
   <Box p={[1.4,.1,.62]} s={[1.3,.2,1.81]} map={mats.paving} c="#ffffff"/>
   </> : <Box p={[0,.1,-.25]} s={[4.1,.2,3.55]} map={mats.paving} c="#ffffff"/>}
   {/* Interior partitions leave a central corridor and a proper doorway. */}
   <Box p={[0,.86,-1.14]} s={[.1,1.5,1.2]} c="#b9ad93"/>
   <Box p={[0,1.51,-.15]} s={[.1,.28,.8]} c="#b9ad93"/>
   <Box p={[0,.86,.8]} s={[.1,1.5,.75]} c="#b9ad93"/>
   {!upper && <>
    <Box p={[-1.6,.6,-1.35]} s={[.45,.94,.3]} c="#775d41"/>
    {[.25,.5,.75,.98].map(y=><Box key={y} p={[-1.6,y,-1.16]} s={[.46,.025,.1]} c="#b59c72"/>)}
    {Array.from({length:14},(_,i)=><Box key={i} p={[-1.79+(i%7)*.058,.37+Math.floor(i/7)*.25,-1.2]} s={[.04,.18,.17]} c={['#797f60','#a17955','#4c665a'][i%3]}/>)}
    <Box p={[-1.3,.32,.15]} s={[.95,.12,.58]} c="#827454"/>
    <Box p={[-1.3,.55,.4]} s={[.95,.45,.12]} c="#6a7159"/>
    <Box p={[-1.25,.28,-.5]} s={[.6,.05,.4]} c="#96774f"/>
    <Rod a={[-1.25,.05,-.5]} b={[-1.25,.28,-.5]} r={.04}/>
    {Array.from({length:10},(_,i)=><Box key={i} p={[1.12,.21+i*.17,.5-i*.23]} s={[.68,.18,.27]} c="#b7aa8b"/>)}
    <Rod a={[1.49,.8,.5]} b={[1.49,2.33,-1.57]} r={.022}/>
   </>}
   {upper && <>
    <Box p={[-1.15,.55,.1]} s={[.9,.07,.65]} c="#9b825e"/>
    {[-1.5,-.8].map(x=><Box key={x} p={[x,.28,.1]} s={[.06,.52,.5]} c={green}/>)}
    <Box p={[-1.15,.69,.1]} s={[.5,.2,.36]} c="#d0c2a0"/>
    <Box p={[-1.15,.85,.1]} s={[.54,.07,.4]} c="#b8ac91"/>
   </>}
   {[-.95,.9].map(x=><group key={`exhibit${x}`} name="journey-display" position={[x,1.04,-1.71]}>
    <Box p={[0,0,0]} s={[.58,.42,.04]} c="#594e3a"/><Box p={[0,0,.03]} s={[.51,.35,.012]} c="#d1c5a6"/>
    {[0,1,2].map(i=><Box key={i} p={[0,.08-i*.075,.04]} s={[.35,.012,.005]} c="#969e87"/>)}
   </group>)}
   {/* Front facade: actual openings, with piers and lintels, not a solid cube. */}
   <Box p={[0,1.64,1.35]} s={[4,.28,.2]} map={mats.plaster} c="#ffffff"/>
   {[-1.83,0,1.83].map(x=><Box key={x} p={[x,.89,1.35]} s={[.34,1.4,.23]} map={x===1.83?mats.brick:mats.plaster} c="#ffffff"/>)}
   <Box p={[-.95,.32,1.35]} s={[1.48,.42,.2]} map={mats.plaster} c="#ffffff"/>
   <Window p={[-.95,1.02,1.45]} width={1.02} height={.88}/><Door p={[.82,.2,1.4]} open={touring}/>
   <Lantern p={[.24,1.24,1.59]}/>
   <Box p={[-1.92,.94,-.25]} s={[.18,1.65,3.1]} map={mats.brick} c="#ffffff"/>
   <Box p={[0,.94,-1.83]} s={[4,1.65,.17]} map={mats.plaster} c="#ffffff"/>
   <Box p={[1.92,.94,-.25]} s={[.18,1.65,3.1]} map={mats.brick} c="#ffffff"/>
   {[-1.15,.3].map(z=><group key={z} position={[2.02,1,z]} rotation={[0,Math.PI/2,0]}><Window p={[0,0,0]} width={.64} height={.85}/></group>)}

   {upper&&<><Box p={[0,.1,1.7]} s={[4.25,.2,.8]} map={mats.plaster} c="#ffffff"/><group position={[0,.2,2.06]}><Rail width={4}/></group>{[-2,2].map(x=><group key={x} position={[x,.2,1.73]} rotation={[0,Math.PI/2,0]}><Rail width={.64}/></group>)}<Desk/></>}
 </group>}
 return <group name="pakistani-house" position={[0,-.35,0]}>
   <group name="site-and-entry">
    <Box p={[0,.55,-2.35]} s={[5.12,1.1,.2]} map={mats.plaster} c="#ffffff"/>
    <Box p={[0,1.14,-2.35]} s={[5.22,.08,.29]}/>
    {[-2.46,0,2.46].map(x=><group key={`rear${x}`}><Box p={[x,.64,-2.35]} s={[.27,1.3,.3]} map={mats.brick} c="#ffffff"/><Box p={[x,1.32,-2.35]} s={[.36,.09,.4]}/></group>)}
    <Box p={[0,-.13,.1]} s={[5.6,.25,5.5]} map={mats.paving} c="#ffffff"/>
    <Box p={[0,.055,1.7]} s={[4.3,.14,1.2]} map={mats.paving} c="#ffffff"/>
    {[-1,1].map(side=><group key={side}><Box p={[side*2.46,.55,.05]} s={[.2,1.1,4.8]} map={mats.plaster} c="#ffffff"/><Box p={[side*2.46,1.14,.05]} s={[.29,.08,4.8]}/><Box p={[side*1.75,.54,2.35]} s={[1.25,1.1,.22]} map={mats.plaster} c="#ffffff"/>{[1.1,2.46].map(x=><group key={x}><Box p={[side*x,.64,2.35]} s={[.25,1.3,.32]} map={mats.brick} c="#ffffff"/><Box p={[side*x,1.32,2.35]} s={[.36,.09,.4]}/><Lantern p={[side*x,1.49,2.35]}/></group>)}</group>)}
    <group name="double-entrance-gate" position={[0,.08,2.37]}>
     {[-1,1].map(side=><group key={side} name={side<0?'gate-leaf-left':'gate-leaf-right'} position={[side*1.02,0,0]} rotation={[0,touring?side*1.25:0,0]}><group position={[-side*.51,0,0]}><Box p={[0,.55,0]} s={[.98,1.1,.075]} c={green}/>{[-.39,-.2,0,.2,.39].map(x=><Box key={x} p={[x,.52,.052]} s={[.016,.91,.025]} c="#71816a"/>)}{[.15,.9,1.12].map(y=><Box key={y} p={[0,y,.055]} s={[.99,.023,.025]} c="#819072"/>)}<mesh position={[0,.59,.06]} rotation={[0,0,Math.PI/4]}><torusGeometry args={[.14,.018,5,4]}/><meshStandardMaterial color="#b3a66d"/></mesh><Rod a={[-side*.37,.47,.09]} b={[-side*.37,.65,.09]} c="#b5a775"/></group></group>)}
    </group>
    {[0,1,2].map(i=><Box key={i} p={[0,-.025+i*.04,2.64-i*.13]} s={[2.1,.075,.3]} map={mats.paving} c="#ffffff"/>)}
   </group>
   <group name="ground-floor"><Level/></group>
   <group ref={first} name="first-floor-explodable"><group position={[0,1.9,0]}><Level upper/>{[-1.5,-.4,.4,1.6].map(x=><Plant key={x} p={[x,.21,1.8]} scale={.7}/>)}</group></group>
   <group ref={roof} name="roof-terrace-explodable"><group position={[0,3.8,0]}>
    <Box p={[0,.06,-.15]} s={[4.22,.16,3.75]} map={mats.paving} c="#ffffff"/>
    {[-1,1].map(side=><Box key={side} p={[side*2,.36,-.16]} s={[.17,.55,3.65]} map={mats.plaster} c="#ffffff"/>)}
    {[-1.94,1.64].map(z=><Box key={z} p={[0,.36,z]} s={[4.16,.55,.16]} map={mats.plaster} c="#ffffff"/>)}
    <group name="roof-stair-mumty" position={[-.85,.13,-1.15]}><Box p={[0,.48,0]} s={[1.3,.96,1.05]} map={mats.plaster} c="#ffffff"/><Box p={[0,1.02,0]} s={[1.47,.12,1.22]}/><group scale={.6} position={[.15,0,.58]}><Door p={[0,0,0]}/></group></group>
    <group name="water-tank" position={[-1.25,.62,-.25]}><Cylinder p={[0,0,0]} r={.37} h={.78} c="#333631"/>{[-.32,-.19,-.06,.07,.2,.33].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.374,.012,5,32]}/><meshStandardMaterial color="#6e6c60"/></mesh>)}<Cylinder p={[0,.41,0]} r={.14} h={.045} c="#45473d"/></group>
    <group name="charpai-and-shade" position={[.75,.13,-.1]}>
     {[-.56,.56].flatMap(x=>[-.38,.38].map(z=><Rod key={`${x}${z}`} a={[x,0,z]} b={[x,.36,z]} c="#795333" r={.04}/>))}
     <Box p={[0,.32,0]} s={[1.2,.05,.84]} c="#987646"/>
     {Array.from({length:24},(_,i)=><Rod key={i} a={[-.55+i*.047,.355,-.37]} b={[-.55+i*.047,.355,.37]} r={.009} c={i%3===0?'#9e5442':'#cab68d'}/>)}
     <Box p={[-.36,.4,0]} s={[.25,.08,.55]} c="#b27759"/>
     {[-.72,.72].flatMap(x=>[-.54,.54].map(z=><Rod key={`${x}${z}`} a={[x,0,z]} b={[x,1.23,z]} c="#806448" r={.018}/>))}
     <ShadeCanopy/>
    </group>
    {[-1.7,.1,1.7].map(x=><Plant key={x} p={[x,.16,1.26]} scale={.75}/>)}
    
   </group></group>
   <group name="services"><Rod a={[2.12,.15,.8]} b={[2.12,4.38,.8]} r={.04}/>{[.5,1.2,2,2.8,3.6].map(y=><Box key={y} p={[2.12,y,.8]} s={[.12,.06,.12]} c="#738074"/>)}<Box p={[2.17,2.9,1.03]} s={[.3,.4,.59]} c="#bcb9a8"/><mesh position={[2.335,2.9,1.03]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.14,.02,8,24]}/><meshStandardMaterial color="#4e554e"/></mesh></group>
   <group name="planting">
    {[-1.6,-.2,1.6].map(x=><Plant key={`porch${x}`} p={[x,.17,1.83]} scale={.85}/>)}
    <Vine p={[-2.12,.18,1.65]} height={3.7} flowers/><Vine p={[-1.7,.12,2.39]} height={1.5}/><Vine p={[1.55,.1,2.42]} height={1.5}/>
    {[-2.15,-1.45,1.45,2.18].map(x=><Plant key={x} p={[x,1.16,2.35]} scale={.75}/>)}
    <Rod a={[2.28,0,-.75]} b={[2.28,2.1,-.75]} c="#766343" r={.055}/>{[0,1,2,3].map(i=><group key={i} position={[2.28+Math.sin(i*2)*.25,1.3+i*.2,-.75+Math.cos(i*2)*.24]}><Vine p={[0,0,0]} height={.6}/></group>)}
   </group>
   
 </group>
}
