// return the neighbors of a given sector that pass the `test` function.
// Can specify whether or not testing of orthogonal, cardinal or the
// originating sector. `size` will expand to not just nearby sectors
export function getNeighbors({
  map,sector,x=sector.x,y=sector.y,size=1,
  orthogonal=true,cardinal=true,self=false,
  onTest=()=>true
}={}){
  const list=[],
        listAdd = sector=>{
          if(map.isInbounds(sector)&&onTest(map.getSector(sector))){
            list.push(map.getSector(sector));
          } //end if
        };

  for(let cy=y-size;cy<=y+size;cy++){
    for(let cx=x-size;cx<=x+size;cx++){
      if(cx===x&&cy===y&&self){
        listAdd({x: cx, y: cy});
      }else if(cx===x&&cy===y&&!self){
        continue;
      }else if(cx===x&&cardinal||cy===y&&cardinal){ //cardinal
        listAdd({x: cx, y: cy});
      }else if(orthogonal){ //orthogonal
        listAdd({x: cx, y: cy});
      } //end if
    } //end for
  } //end for
  return list;
} //end getNeighbors()
