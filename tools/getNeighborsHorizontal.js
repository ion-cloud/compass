// return the neighbors of a given sector that pass the `test` function.
// Can specify whether or not testing of orthogonal, cardinal or the
// originating sector. `size` will expand to not just nearby sectors
export function getNeighborsHorizontal({
  map,sector,x=sector.x,y=sector.y,size=1,self=false,
  onTest=()=>true
}={}){
  const list=[],
        listAdd = sector=>{
          if(map.isInbounds(sector)&&onTest(map.getSector(sector))){
            list.push(map.getSector(sector));
          } //end if
        };

  for(let cx=x-size;cx<=x+size;cx++){
    if(cx===x&&self){
      listAdd({x: cx, y});
    }else if(cx===x&&!self){
      continue;
    }else{
      listAdd({x: cx, y});
    } //end if
  } //end for
  return list;
} //end getNeighbors()
