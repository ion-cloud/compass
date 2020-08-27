// fills rect if `onTest(sector)` return true
export function iterateRect({
  x1=0,y1=0,x2=0,y2=0,
  onEach=()=>{},
}={}){
  const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

  for(let y = y1;y!==y2+dy;y+=dy){
    for(let x = x1;x!==x2+dx;x+=dx){
      onEach({x,y});
    } //end for
  } //end for
} //end fillRect()
