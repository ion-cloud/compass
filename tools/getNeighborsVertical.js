// return the neighbors of a given sector that pass the `test` function.
// Can specify whether or not testing of orthogonal, cardinal or the
// originating sector. `size` will expand to not just nearby sectors
export function getNeighborsVertical({
  map,sector,x=sector.x,y=sector.y,size=1,self=false,
  onTest=()=>true
}={}){
  const list=[],
        listAdd = sector=>{
          if(map.isInbounds(sector)&&onTest(map.getSector(sector))){
            list.push(map.getSector(sector));
          } //end if
        };

  for(let cy=y-size;cy<=y+size;cy++){
    if(cy===y&&self){
      listAdd({x, y: cy});
    }else if(cy===y&&!self){
      continue;
    }else{
      listAdd({x, y: cy});
    } //end if
  } //end for
  return list;
} //end getNeighbors()
