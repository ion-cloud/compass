import {bresenhamsLine} from './bresenhamsLine';

// ray-casting
export function computeFOV({x=null,y=null,...args}={}){
  if(x===null||y===null) throw new Error('computeFOV: x & y required');
  computeDirectionalFOV({x,y,direction:'east',...args});
  computeDirectionalFOV({x,y,direction:'west',...args});
} //end computeFOV()
export function computeDirectionalFOV({
  map,x=null,y=null,
  direction='east',
  fieldOfViewDegrees=180,
  fieldOfViewRadians=fieldOfViewDegrees*Math.PI/180,
  radius=8,
  accuracy=0.97, //higher accuracy required for higher radius
  isTransparent=({x,y})=> map.isWalkable({x,y})||map.isEmpty({x,y}),
  setTransparent=({x,y,state})=> state.visible[`${x},${y}`]=true,
  isTranslucent=({x,y})=> map.isWindow({x,y}),
  setTranslucent=({x,y,state})=>{
    if(state.firstWindow){
      state.secondWindow = true;
    } else {
      state.firstWindow = true;
    } //end if
  },
  isOpaque=({x,y,state})=> map.isWall({x,y})||map.isDoorClosed({x,y})||state.secondWindow,
  setVisible=()=>{},
  onStart=({state})=>{ state.visible = {}; },
  onTest=({x,y,state})=>{
    if(isTransparent({x,y,state})) setTransparent({x,y,state});
    if(isTranslucent({x,y,state})) setTranslucent({x,y,state});
    state.visible[`${x},${y}`]=true;
    setVisible({x,y,state});
    if(isOpaque({x,y,state})) return false;
    return true;
  },
  ...args
}={}){
  if(x===null||y===null) throw new Error('computeDirectionalFOV: x & y required');
  const quadrants = {
          north: -Math.PI,
          east: -Math.PI/2,
          south: Math.PI*2,
          west: Math.PI/2*5,
          northwest: Math.PI/4*3,
          northeast: -3*Math.PI/4,
          southwest: Math.PI/4,
          southeast: -Math.PI/4
        },
        theta = quadrants[direction]; 

  for(
    let sigma = fieldOfViewRadians;
    sigma > 0;
    sigma -= 1 - accuracy
  ){
    const [x1,y1] = [x,y],
          x2 = Math.round(x1 + radius * Math.cos(sigma + theta)),
          y2 = Math.round(y1 + radius * Math.sin(sigma + theta));

    bresenhamsLine({x1,y1,x2,y2,onStart,onTest, ...args});
  } //end for
} //end computeDirectionalFOV()
