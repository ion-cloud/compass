export function exhumedRiverChannel({map}){
  const terminalPositions = map.constructor.shuffle([
    {
      xmin: 0,
      xmax: 0,
      ymin: Math.floor(map.height/4),
      ymax: Math.floor(map.height/4*3)
    },
    {
      xmin: map.width-1,
      xmax: map.width-1,
      ymin: Math.floor(map.height/4),
      ymax: Math.floor(map.height/4*3)
    },
    {
      xmin: Math.floor(map.width/4),
      xmax: Math.floor(map.width/4*3),
      ymin: 0,
      ymax: 0
    },
    {
      xmin: Math.floor(map.width/4),
      xmax: Math.floor(map.width/4*3),
      ymin: map.height-1,
      ymax: map.height-1
    }
  ]);

  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      const n = (1+map.noise.simplex2(sector.x/map.width*10,sector.y/map.height*10))/2;

      if(n<0.6){
        sector.setFloor();
      }else{
        sector.setWall();
      } //end if
    });
  });
  map.clipOrphaned({
    test: sector=> sector.isWalkable()||sector.isEmpty(),
    failure: sector=> sector.setWallSpecial()
  });

  let x,y;

  // get the start position, set water and save it
  ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
  map.setWater({x,y});
  const x1 = x, y1 = y;

  // get the end position, set water
  ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
  map.setWater({x,y});
  let x2 = x, y2 = y;

  // now we'll draw the path between the points
  map.drunkenPath({
    x1,y1,x2,y2,wide:true,
    draw(sector){
      sector.setWater();

      // small chance to venture slightly further
      if(Math.random()<0.5){
        map.getNeighbors({
          x: sector.x, y: sector.y, size: 3,
          test(sector){
            return sector.isWalkable()&&
              !sector.isWater()&&!sector.isFloorSpecial();
          }
        }).forEach(sector=> Math.random()<0.5?sector.setFloorSpecial():null);
      } //end if
    }
  });

  // 50% chance to have a forked river
  if(Math.random()<0.5){
    ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
    map.setWater({x,y});
    x2 = x; y2 = y;

    // now we'll draw the fork of the path
    map.drunkenPath({
      x1,y1,x2,y2,wide:true,
      draw(sector){
        sector.setWater();

        // small chance to venture slightly further
        if(Math.random()<0.5){
          map.getNeighbors({
            x: sector.x, y: sector.y, size: 3,
            test(sector){
              return sector.isWalkable()&&
                !sector.isWater()&&!sector.isFloorSpecial();
            }
          }).forEach(sector=> Math.random()<0.5?sector.setFloorSpecial():null);
        } //end if
      }
    });
  } //end if

  // now close everything not close enough to the exhumed channel
  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      if(map.isRect({
        x1: sector.x-3,
        y1: sector.y-3,
        x2: sector.x+3,
        y2: sector.y+3,
        test(sector){
          return sector.isWater();
        }
      })&&Math.random()<0.6){
        sector.setWall();
      }else if(!sector.isWater()&&Math.random()<0.1){
        sector.setWallSpecial();
      }else if(sector.isWater()){
        sector.setFloorSpecial();
      }else if(!sector.isWater()){
        sector.setFloor();
      } //end if
    });
  });

  map.clipOrphaned({
    test: sector=> sector.isWalkable()||sector.isEmpty(),
    failure: sector=> sector.setWallSpecial()
  });
} //end function

function getValidTerminalPoint(map,{xmin,xmax,ymin,ymax}){
  let x, y;

  do{
    x = Math.floor(xmin+Math.random()*(xmax-xmin));
    y = Math.floor(ymin+Math.random()*(ymax-ymin));
  }while(!map.isWalkable({x,y}))
  return {x,y};
} //end getValidTerminalPoint()
