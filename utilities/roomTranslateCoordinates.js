// return an {x,y} coordinate for a specified {cx,cy} after the room
// was reflected/turned given a width, height, and roomDirection, and x1,y1
export function roomTranslateCoordinates({x1,y1,cx,cy,width,height,roomDirection}){
  if(roomDirection==='north'){
    return {x: x1+cx, y: y1+cy+1};
  }else if(roomDirection==='east'){
    return {x: y1+height-cy-1+x1-y1, y: x1+cx+y1-x1};
  }else if(roomDirection==='west'){
    return {x: y1+cy+x1-y1+1, y: x1+cx+y1-x1};
  }else if(roomDirection==='south'){
    return {x: x1+cx,y: y1+height-1-cy};
  } //end if
  return {x:cx,y:cy};
} //end roomTranslateCoordinates()
