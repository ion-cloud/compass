// can pass in a wall and floor draw function, or just a generic draw
// function to merely fill the entire area with something. `test` is
// also optional, it will test the sector before passing to draw fn's
export function fillRoom({
  map,x1=0,y1=0,x2=0,y2=0,
  onDraw = null,
  onTest=()=>true,
  onWall=()=>true,
  onFloor=()=>true
}={}){
  const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

  for(let y = y1;y!==y2+dy;y+=dy){
    for(let x = x1;x!==x2+dx;x+=dx){
      if(!map.isInbounds({x,y})){
        continue;
      }else if(typeof onDraw === 'function'){
        if(onTest(map.getSector({x,y}))) onDraw(map.getSector({x,y}));
      }else if(y===y1||y===y2||x===x1||x===x2){
        if(onTest(map.getSector({x,y}))) onWall(map.getSector({x,y}));
      }else if(onTest(map.getSector({x,y}))){
        onFloor(map.getSector({x,y}));
      } //end if
    } //end for
  } //end for
} //end fillRect()
