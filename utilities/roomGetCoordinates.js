export function roomGetCoordinates({
  x,y,roomDirection,roomSize=2,
  roomSizeX=roomSize,roomSizeY=roomSize
}={}){
  let x1,y1,x2,y2;

  if(roomDirection==='north'){
    x1 = x-Math.floor(roomSizeX/2);
    x2 = x+Math.ceil(roomSizeX/2);
    y1 = y-roomSizeY;
    y2 = y;
  }else if(roomDirection==='east'){
    x1 = x;
    x2 = x+roomSizeY;
    y1 = y-Math.floor(roomSizeX/2);
    y2 = y+Math.ceil(roomSizeX/2);
  }else if(roomDirection==='south'){
    x1 = x-Math.floor(roomSizeX/2);
    x2 = x+Math.ceil(roomSizeX/2);
    y1 = y;
    y2 = y+roomSizeY;
  }else if(roomDirection==='west'){
    x1 = x-roomSizeY;
    x2 = x;
    y1 = y-Math.floor(roomSizeX/2);
    y2 = y+Math.ceil(roomSizeX/2);
  }else{
    throw new Error(`Improper direction: ${roomDirection}`);
  } //end if
  return {x1,y1,x2,y2};
} //end roomGetCoordinatesFromOrigin()
