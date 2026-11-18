import * as THREE from 'three';
import {ARCHITECTURAL_MATERIALS} from './architectural-materials.mjs';
// Screen-space transmission is limited to high quality on desktop. Mobile and
// stereo use dielectric reflections plus transparency, with no refraction pass.
export function createArchitecturalGlass(resources,{mobile=globalThis.matchMedia?.('(pointer: coarse)').matches===true}={}){
 const material=new THREE.MeshPhysicalMaterial({...ARCHITECTURAL_MATERIALS.glass,transmission:mobile?0:.9,transparent:mobile,opacity:mobile?.075:1,depthWrite:false,side:THREE.DoubleSide});material.userData.architecturalGlass=true;material.userData.transmissionBase=.9;resources.push(material);return material;
}
// Alpha-blended glass has no transmission pass, so its colour is lit like a
// white diffuse sheet and blended over the view: a milky veil, doubled by
// stacked panes. Real glazing is near-black in diffuse terms; reflections come
// from the specular/env lobe, which keeps working with the dark body colour.
export const ALPHA_GLASS_COLOR='#282a2a';
export function setArchitecturalGlassQuality(material,{mobile=false,tier=0,xr=false}={}){
 const transmission=!mobile&&tier===0&&!xr?(material.userData.transmissionBase??.9):0,transparent=transmission===0,opacity=transparent?.075:1;
 material.userData.glassColor??='#'+material.color.getHexString();const color=transparent?ALPHA_GLASS_COLOR:material.userData.glassColor;
 if(material.transmission===transmission&&material.transparent===transparent&&material.opacity===opacity&&'#'+material.color.getHexString()===color)return false;
 material.transmission=transmission;material.transparent=transparent;material.opacity=opacity;material.color.set(color);material.needsUpdate=true;return true;
}
