// eslint-disable-next-line complexity
export function cuesta({map}){
  let x=[
        map.width/6|0,
        map.width/6*5|0
      ][Math.random()*2|0],
      y=[
        map.height/6|0,
        map.height/6*5|0
      ][Math.random()*2|0],
      filled = 0;

  const xw=x>map.width/2?-1:1, //we weight the DLA to opposite the side of the...
        yw=y>map.height/2?-1:1, //starting location
        sparks=[], //holds all filled locations to start a new spark
        maxFilled = map.width*map.height/3,
        hashmap = {},
        r = (n,m)=> filled<maxFilled/16?true:Math.random()*2-(n===m?1:0)<0.4;

  // We start in a corner and create a spark predominately in the weighted
  // opposite direction.
  do{
    if(filled<maxFilled/16){
      map.setFloorSpecial({x,y});
    }else{
      map.setFloor({x,y});
    } //end if
    filled++;
    if(
      map.isInbounds({x: x-1,y})&&map.isEmpty({x: x-1,y})&&
      r(xw,-1)&&!hashmap[`${x-1}:${y}`]
    ){
      sparks.push({x: x-1,y}); hashmap[`${x-1}:${y}`]={x: x-1,y};
    } //end if
    if(
      map.isInbounds({x: x+1,y})&&map.isEmpty({x: x+1,y})&&
      r(xw,1)&&!hashmap[`${x+1}:${y}`]
    ){
      sparks.push({x: x+1,y}); hashmap[`${x+1}:${y}`]={x: x+1,y};
    } //end if
    if(
      map.isInbounds({x,y: y-1})&&map.isEmpty({x,y: y-1})&&
      r(yw,-1)&&!hashmap[`${x}:${y-1}`]
    ){
      sparks.push({x,y: y-1}); hashmap[`${x}:${y-1}`]={x,y: y-1};
    } //end if
    if(
      map.isInbounds({x,y: y+1})&&map.isEmpty({x,y: y+1})&&
      r(yw,1)&&!hashmap[`${x}:${y+1}`]
    ){
      sparks.push({x,y: y+1}); hashmap[`${x}:${y+1}`]={x,y: y+1};
    } //end if
    if(sparks.length){
      ({x,y} = map.constructor.shuffle(sparks).pop());
    }else{
      ({x,y} = map.constructor.shuffle(Object.values(hashmap)).pop());
    } //end if
  }while(filled<maxFilled);

  // surround the corridors that arent surrounded with walls yet with walls now.
  map.fillRoom({
    x1: 0,y1: 0,x2: map.width-1,y2: map.height-1,
    test(sector){
      const nearbyWalkable = map.getNeighbors({
        x: sector.x,y: sector.y,
        test(sector){
          return sector.isWalkable();
        }
      }).length;

      return nearbyWalkable&&sector.isEmpty()?true:false;
    },
    draw(sector){
      sector.setWall();
    }
  });
} //end function
