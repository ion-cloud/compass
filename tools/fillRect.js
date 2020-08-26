// fills rect if `onTest(sector)` return true
export function fillRect({
  map,x1=0,y1=0,x2=0,y2=0,
  onTest=()=>true,
  onDraw=()=>false
}={}){
  const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

  for(let y = y1;y!==y2+dy;y+=dy){
    for(let x = x1;x!==x2+dx;x+=dx){
      const sector = map.getSector({x,y});

      if(map.isInbounds(sector)&&onTest(sector)){
        onDraw(sector);
      } //end if
    } //end for
  } //end for
  return true;
} //end fillRect()
