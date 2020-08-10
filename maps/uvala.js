export function uvala({map}){
  const sinkholes = [];

  map.fillRect({
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    draw(sector){
      const n = (1+map.noise.simplex2(sector.x/map.width*12,sector.y/map.height*12))/2;

      if(n<0.06){
        sector.setWaterSpecial();
        sinkholes.push(sector);
      }else if(n>0.75){
        sector.setWallSpecial();
      }else if(n>0.6){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  sinkholes.forEach(sector=>{
    map.getNeighbors({
      x: sector.x, y: sector.y, size: 5,
      test(sector){
        return sector.isWalkable();
      }
    }).forEach(sector=>{
      const n = (1+map.noise.simplex2(sector.x/map.width*12,sector.y/map.height*12))/2;

      if(n<0.1){
        sector.setWater();
      }else if(n<0.2){
        sector.setFloorSpecial();
      }else if(n<0.3&&Math.random()<0.5){
        sector.setFloorSpecial();
      }else if(Math.random()<0.2){
        sector.setFloorSpecial();
      } //end if
    })
  });

  // finally we'll clean up unwalkable sections
  map.clipOrphaned({
    test: sector=> sector.isWalkable()||sector.isWater(),
    failure: sector=> sector.setWallSpecial()/*,
    hardFailure: sector=> sector.setWall()*/
  });
} //end function
