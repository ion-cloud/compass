import {translate} from './translate';

export function isInbounds({
  map, sector, buffer=0,
  x=sector.x,
  y=sector.y,
  x1=buffer,
  y1=buffer,
  x2=map.width-1-buffer,
  y2=map.height-1-buffer,
  test=0
}={},direction){
  if(test&&(x<x1||x>x2)) console.log({x,x1,x2});
  if(direction) ({x,y} = translate({x,y,direction}));
  const result =  x>=x1&&
    x<=x2&&
    y>=y1&&
    y<=y2&&
    x>=map.startX+buffer&&
    y>=map.startY+buffer&&
    x<=map.width-1-buffer&&
    y<=map.height-1-buffer;

  if(test&&!result) console.log({x1,x,x2});
  return result;
} //end isInbounds()
