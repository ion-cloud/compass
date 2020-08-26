import {takeRandom} from '../utilities/takeRandom';

// get start and ending coordinates given a boundary box that will
// touch two separate edges
export function getTerminalPoints({
  map,x1=0,y1=0,x2=0,y2=0,
  horizontal=true,vertical=true,forward=true,backward=true,
  forwardSlant=Math.random()<0.5,backwardSlant=Math.random()<0.5
}={}){
  const directionTypes = [];

  // acquire the direction, forward and backward are diagonals
  if(horizontal) directionTypes.push('horizontal');
  if(vertical) directionTypes.push('vertical');
  if(forward) directionTypes.push('forward');
  if(backward) directionTypes.push('backward');
  const direction = takeRandom(directionTypes);

  // based on the direction randomly compute terminal points
  if(direction==='horizontal'){
    return {
      x1,
      x2,
      y1: Math.floor(Math.random()*y2/2+y2/4),
      y2: Math.floor(Math.random()*y2/2+y2/4)
    };
  }else if(direction==='vertical'){
    return {
      x1: Math.floor(Math.random()*x2/2+x2/4),
      x2: Math.floor(Math.random()*x2/2+x2/4),
      y1,
      y2
    };
  }else if(direction==='forward'){
    if(forwardSlant){
      return {
        x1: Math.floor(Math.random()*x2/4),
        x2,
        y1: y2,
        y2: Math.floor(Math.random()*y2/4)
      };
    } //end if
    return {
      x1,
      x2: Math.floor(Math.random()*x2/4+x2/2),
      y1: Math.floor(Math.random()*y2/4+y2/2),
      y2
    };
  }else if(direction==='backward'){
    if(backwardSlant){
      return {
        x1: Math.floor(Math.random()*x2/4),
        x2,
        y1,
        y2: Math.floor(Math.random()*y2/4+y2/2)
      };
    } //end if
    return {
      x1,
      x2: Math.floor(Math.random()*x2/4+x2/2),
      y1: Math.floor(Math.random()*y2/4),
      y2
    };
  } //end if
  return null;
} //end getTerminalPoints()
