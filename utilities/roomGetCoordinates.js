export function roomGetCoordinates({
  x,y,direction,roomSize=2,
  roomSizeX=roomSize,roomSizeY=roomSize
}={}){
  let x1,y1,x2,y2;

  if(direction==='north'){
    x1 = x-Math.floor(roomSizeX/2);
    x2 = x+Math.ceil(roomSizeX/2);
    y1 = y-roomSizeY;
    y2 = y;
  }else if(direction==='east'){
    x1 = x;
    x2 = x+roomSizeY;
    y1 = y-Math.floor(roomSizeX/2);
    y2 = y+Math.ceil(roomSizeX/2);
  }else if(direction==='south'){
    x1 = x-Math.floor(roomSizeX/2);
    x2 = x+Math.ceil(roomSizeX/2);
    y1 = y;
    y2 = y+roomSizeY;
  }else if(direction==='west'){
    x1 = x-roomSizeY;
    x2 = x;
    y1 = y-Math.floor(roomSizeX/2);
    y2 = y+Math.ceil(roomSizeX/2);
  }else{
    throw new Error(`Improper direction: ${direction}`);
  } //end if
  return {x1,y1,x2,y2};
} //end roomGetCoordinatesFromOrigin()
