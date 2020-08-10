export function hogback({map}){
  const points = [],
        minD = 10,
        maxD = 20;

  let x1, y1, x2, y2;

  //horizontal or vertical deviance
  if(Math.random()<0.5){
    x1 = Math.floor(map.width/4+Math.random()*map.width/2);
    y1 = Math.floor(map.height/8+Math.random()*map.height/4);
    x2 = Math.floor(map.width/4+Math.random()*map.width/2);
    y2 = Math.floor(map.height/8*4+Math.random()*map.height/4);
  }else{
    x1 = Math.floor(map.width/8+Math.random()*map.width/4);
    y1 = Math.floor(map.height/4+Math.random()*map.height/2);
    x2 = Math.floor(map.width/8*4+Math.random()*map.width/4);
    y2 = Math.floor(map.height/4+Math.random()*map.height/2);
  } //end if

  while(points.length<4){
    const xd = Math.floor(minD+Math.random()*(maxD-minD) - maxD/2),
          yd = Math.floor(minD+Math.random()*(maxD-minD) - maxD/2);

    points.push({x1: x1+xd, y1: y1+yd, x2: x2+xd, y2: y2+yd});
  }

  map.fillRect({
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    draw(sector){
      if(Math.random()<0.6){
        sector.setFloor()
      }else{
        sector.setWall();
      } //end if
    }
  });
  points.forEach(point=>{
    map.getNeighbors({x: point.x1,y: point.y1})
      .forEach(sector=> sector.setFloor());
    map.getNeighbors({x: point.x2,y: point.y2})
      .forEach(sector=> sector.setFloor());
  });

  const hogback = {};

  points.forEach(point=>{
    map.setFloorSpecial({x: point.x1,y: point.y1});
    map.setFloorSpecial({x: point.x2,y: point.y2});
    map.bresenhamsLine({
      ...point,
      onEach({x,y}){
        map.getNeighbors({
          x, y, self: true,
          test(sector){
            return !sector.isWallSpecial();
          }
        }).forEach(sector=>{
          sector.setFloorSpecial();
          hogback[`x${sector.x}y${sector.y}`] = true;
          map.getNeighbors({
            x: sector.x,y: sector.y, size: 2,
            test(sector){
              return Math.random()<0.1&&!sector.isWallSpecial();
            }
          }).forEach(sector=>{
            sector.setFloorSpecial();
            hogback[`x${sector.x}y${sector.y}`] = true;
          });
        });
        if(Math.random()<0.8) map.setWallSpecial({x,y});
      }
    });
  });

  const finished = {};

  Object.keys(hogback)
    .forEach(key=>{
      const [,x,y] = key.split(/x|y/g).map(n=>+n);

      map.fillRect({
        x1: x-3, y1: y-3, x2: x+3, y2: y+3,
        test({x,y}){
          return finished[`x${x}y${y}`]===undefined;
        },
        draw(sector){
          const {x,y} = sector;

          finished[`x${x}y${y}`] = true;
          if(sector.isFloorSpecial()) return;
          if(Math.random()<0.8) sector.setFloor();
        }
      });
    });

  // remove all but the largest gully
  map.clipOrphaned({
    test: sector=> sector.isWalkable(),
    failure: sector=> sector.setWallSpecial()
  });
} //end function
