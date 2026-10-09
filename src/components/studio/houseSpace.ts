// A wider plan with unchanged floor heights. Furniture can retain its human scale.
export const HOUSE_SCALE: [number,number,number] = [1.12,1,1.25];
export function housePoint(p:[number,number,number]):[number,number,number] {
 return [p[0]*HOUSE_SCALE[0],p[1],p[2]*HOUSE_SCALE[2]];
}
export const OVERVIEW_SPAN = { width:11.8, height:10.2 };
