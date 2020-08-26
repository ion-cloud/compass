// test rect to see if `test(sector)` is true
export function isRect({
  map,x1=0,y1=0,x2=0,y2=0,
  hasAll=()=>true,hasOne=()=>false
}={}){
  const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

  for(let y = y1;y!==y2+dy;y+=dy){
    for(let x = x1;x!==x2+dx;x+=dx){
      const sector = map.getSector({x,y});

      if(
        !map.isInbounds(sector)||
        map.isInbounds(sector)&&!hasAll(sector)
      ){
        return false; //exit early
      }else if(map.isInbounds(sector)&&hasOne(sector)){
        return true;
      } //end if
    } //end for
  } //end for
  return true;
} //end isRect()
