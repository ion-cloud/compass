export function tepui({map}){
  map.fillRect({
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    draw(sector){
      const {x,y} = sector,
            yd = Math.abs(y-map.height/2)/(map.height/2),
            xd = Math.abs(x-map.width/2)/(map.width/2),
            d = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2)),
            r = Math.random();

      if(r<0.5&&r>d-0.5){
        sector.setFloor()
      }else{
        sector.setWall();
      } //end if
    }
  });

  const todo = [];

  map.sectors.getAll().forEach(sector=>{
    const nearby = map.getNeighbors({
            x: sector.x,y: sector.y,
            test(sector){
              return sector.isWall();
            }
          }).length,
          {x,y} = sector,
          {width,height} = map;

    if(nearby<5&&x>5&&x<width-5&&y>5&&y<height-5){
      todo.push(sector);
    } //end if
  });

  todo.forEach(sector=> sector.setFloorSpecial());

  // remove all but the center
  map.clipOrphaned({
    test: sector=> sector.isFloorSpecial(),
    failure: sector=> sector.setVoid(),
    success: sector=> sector.setFloor(),
    hardFailure: sector=> sector.setVoid()
  });

  const clone = map.clone();

  clone.sectors.getAll().forEach(sector=>{
    const nearby = clone.getNeighbors({
      x: sector.x,y: sector.y,orthogonal: false,
      test(sector){
        return sector.isFloor()
      }
    }).length;

    if(nearby&&Math.random()<0.8){
      map.setFloor({x: sector.x,y: sector.y});
    } //end if
  });
} //end function
