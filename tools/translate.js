export function translate({x=0,y=0,direction}={}){
  if(direction==='north'){
    return {x,y:y-1};
  }else if(direction==='northeast'){
    return {x:x+1,y:y-1};
  }else if(direction==='east'){
    return {x:x+1,y};
  }else if(direction==='southeast'){
    return {x:x+1,y:y+1};
  }else if(direction==='south'){
    return {x,y:y+1};
  }else if(direction==='southwest'){
    return {x:x-1,y:y+1};
  }else if(direction==='west'){
    return {x:x-1,y};
  }else if(direction==='northwest'){
    return {x:x-1,y:y-1};
  } //end if
  return {x,y};
} //end translate()
