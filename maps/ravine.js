export function ravine({map}){

  // draw a bunch of rivers going every which way
  const {x1,y1,x2,y2}= map.constructor.getTerminalPoints({
    x1: 0, y1: 0, x2: map.width-1, y2: map.height-1
  });

  // now draw that river
  map.drunkenPath({
    x1,y1,x2,y2,wide: true,
    draw(sector){
      sector.setWater();
    }
  });

  // now close everything not close enough to river
  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      if(
        !map.getNeighbors({
          x: sector.x,y: sector.y, size: 2
        }).some(sector=> sector.isWater())
        &&Math.random()<0.6
      ){
        sector.setWall();
      }else if(!sector.isWater()&&Math.random()<0.1){
        sector.setWallSpecial();
      } //end if
    });
  });

  // now that we've represented the map fully, lets find the largest walkable
  // space and fill in all the rest
  map.clipOrphaned({
    test: sector=> sector.isWalkable()||sector.isEmpty(),
    failure: sector=> sector.setWallSpecial(),
    success: sector=>{
      if(!sector.isWalkable()) sector.setFloor();
    }
  });

  // lastly lets find all floor that's near water and give it a large chance
  // to be sand
  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      if(sector.isWater()) return; //leave water alone
      const x = sector.x,y = sector.y;

      if(map.getNeighbors({x,y}).some(sector=> sector.isWater())){
        if(Math.random()<0.5) sector.setFloorSpecial();
      } //end if
    });
  });
} //end function
