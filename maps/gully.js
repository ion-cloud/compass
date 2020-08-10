export function gully({map}){
  const d = Math.random()<0.5,
        h = d?2:10,
        v = d?10:2;

  map.fillRect({
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    draw(sector){
      const n = (1+map.noise.simplex2(sector.x/map.width*h,sector.y/map.height*v))/2;

      if(n<0.4){
        sector.setFloorSpecial();
      }else if(n>0.5&&Math.random()<0.4){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  // remove all but the largest gully
  map.clipOrphaned({
    test: sector=> sector.isFloorSpecial(),
    failure: sector=> Math.random()<0.4?sector.setWall():sector.setFloor()
  });

  // now remove unwalkable
  map.clipOrphaned({
    test: sector=> sector.isWalkable(),
    failure: sector=> sector.setWallSpecial()
  });
} //end function
