export function wadi({map}){
  const d = Math.random()<0.5,
        h = d?2:10,
        v = d?10:2;

  map.fillRect({
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    draw(sector){
      const n = (1+map.noise.simplex2(sector.x/map.width*h,sector.y/map.height*v))/2;

      if(n<0.5&&Math.random()<0.5){
        sector.setWall()
      }else if(n<0.5){
        sector.setFloorSpecial();
      }else if(n>0.6&&Math.random()<0.5){
        sector.setWall();
      }else{
        sector.setFloorSpecial();
      } //end if
    }
  });

  // now remove unwalkable
  map.clipOrphaned({
    test: sector=> sector.isWalkable(),
    failure: sector=> sector.setWallSpecial()
  });

  // get the centroid of the open area and use it for center of river
  const walkable = map.sectors.getAll().filter(sector=> sector.isWalkable()),
        centroid = walkable.reduce((p,n)=>{
          return {x: p.x+n.x,y: p.y+n.y};
        },{x: 0, y: 0}),
        x2 = Math.floor(centroid.x/walkable.length),
        y2 = Math.floor(centroid.y/walkable.length);

  (function drawRiverStart(){
    const {x1,y1}= map.constructor.getTerminalPoints({
      x1: 0, y1: 0, x2, y2
    });

    map.drunkenPath({
      x1,y1,x2,y2,wide: true,
      draw(sector){
        sector.setWater();
        map.getNeighbors({
          x: sector.x,y: sector.y,size: 2,
          test(sector){
            return sector.isWalkable()&&!sector.isWater();
          }
        }).forEach(sector=> sector.setFloor());
      },
      onFailure({x1,y1,x2,y2}){
        drawRiverStart(); //reattempt until we get a success
      }
    });
  })();
  (function drawRiverEnd(){
    const {x1,y1}= map.constructor.getTerminalPoints({
      x1: map.width-1, y1: map.height-1, x2, y2
    });

    map.drunkenPath({
      x1, y1, x2, y2, wide: true,
      draw(sector){
        sector.setWater();
        map.getNeighbors({
          x: sector.x, y: sector.y,size: 2,
          test(sector){
            return sector.isWalkable()&&!sector.isWater();
          }
        }).forEach(sector=> sector.setFloor());
      },
      onFailure({x1,y1,x2,y2}){
        drawRiverEnd(); //reattempt until we get a success
      }
    });
  })();
} //end wadi()
