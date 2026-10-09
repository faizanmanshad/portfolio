import { housePoint } from './houseSpace';
export type JourneyRecord = {
 id: string; title: string; description: string; href: string; date: string; category: string;
};
export type TourStop = { name:string; position:[number,number,number]; target:[number,number,number] };
// World coordinates (the model base is lowered by .35). Routes are independent of content.
export const HOUSE_ROUTE: TourStop[] = [
 {name:'At the gate',position:[.05,1.05,4.5],target:[0,.75,2.35]},
 {name:'Entrance courtyard',position:[.5,1.05,2.05],target:[.82,.9,.6]},
 {name:'Welcome hall',position:[.82,1.05,.75],target:[1.05,.8,-1.15]},
 {name:'Reading room',position:[-.42,1.02,.68],target:[-1.52,.8,-.65]},
 {name:'Education shelves',position:[-1.05,1.02,.2],target:[-1.7,.8,-1.05]},
 {name:'Recognition wall',position:[-1.3,1.02,-.5],target:[-.95,.69,-1.71]},
 {name:'Community corner',position:[-.55,1.02,-.9],target:[-1.5,.8,-.5]},
 {name:'Stair hall',position:[.55,1.05,-.9],target:[1.1,1.2,-.9]},
 {name:'Staircase',position:[1.05,1.85,-.15],target:[1.05,2.25,-1.35]},
 {name:'Upper landing',position:[1.1,2.92,-1.2],target:[.15,2.65,-.5]},
 {name:'Project room',position:[-.35,2.95,-.15],target:[-1.3,2.3,.1]},
 {name:'Model table',position:[-1.05,2.95,-.75],target:[-1,2.3,.3]},
 {name:'Studio balcony',position:[-1.1,2.9,1.7],target:[.8,2.7,1.4]},
 {name:'Research display',position:[-.45,2.95,.5],target:[-.95,2.59,-1.71]},
 {name:'Work desk',position:[.65,2.85,.6],target:[.6,2.45,-.4]},
 {name:'Roof terrace',position:[1.2,4.55,1.15],target:[.65,3.95,-.1]},
 {name:'Looking ahead',position:[2,5,3],target:[0,4,-.4]},
];
export function journeyStop(index:number,count:number):TourStop {
 const stop= Math.round(index/Math.max(1,count-1)*(HOUSE_ROUTE.length-1));
 const view=HOUSE_ROUTE[Math.min(HOUSE_ROUTE.length-1,Math.max(0,stop))];
 return {...view,position:housePoint(view.position),target:housePoint(view.target)};
}

// Doorway waypoints, indexed by destination stop. Reverse travel uses the same path.
const passages: Record<number,[number,number,number][]> = {
  3:[[.65,1.05,-.1],[-.35,1.05,-.1]],
  7:[[-.4,1.05,-.15],[.5,1.05,-.15]],
  8:[[.6,1.05,.55],[1.05,1.1,.55]],
  10:[[.65,2.92,-.15],[.15,2.92,-.15]],
  11:[[.15,2.95,-.15],[-.35,2.95,-.15]],
  12:[[-.4,2.95,-.15],[.6,2.95,-.15],[.82,2.95,1.7]],
  13:[[.82,2.95,1.7],[.82,2.95,.65],[.5,2.95,-.15],[-.3,2.95,-.15]],
  14:[[-.3,2.95,-.15],[.55,2.95,-.15]],
  // Scenic lift outside the balcony; free walking is a later phase.
  15:[[.82,2.85,1.7],[.82,2.85,2.35],[.82,4.65,2.35]],
};
export function journeyPath(from:number|null,to:number,count:number):[number,number,number][] {
  const index=(n:number)=>Math.round(n/Math.max(1,count-1)*(HOUSE_ROUTE.length-1));
  const end=index(to);
  if(from===null || Math.abs(to-from)>1) return [housePoint(HOUSE_ROUTE[end].position)];
  const start=index(from), direction=end>=start?1:-1;
  const points:[number,number,number][]=[];
  for(let i=start;i!==end;i+=direction){
    const via=passages[direction>0?i+1:i]||[];
    points.push(...(direction>0?via:[...via].reverse()),HOUSE_ROUTE[i+direction].position);
  }
  return (points.length?points:[HOUSE_ROUTE[end].position]).map(housePoint);
}
