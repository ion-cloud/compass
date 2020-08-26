import {getNeighbors} from '../tools/getNeighbors';

const [WEST,EAST,NORTH,SOUTH] = [0,1,2,3],
      ROOMSIZE = 5; //can't be lower than 3, includes wall

export function organizedRooms({map}){
  let x=Math.floor(map.width/2), //current x position
      y=Math.floor(map.height/2), //current y position
      currentRoomNumber=1;

  createHallways();
  allocateRooms();
  removeDeadEnds();
  buildWalls();
  return map;

  // We find the end of a hallway and recursively work backwards until
  // we find a door or more than one hallway directional path
  function removeDeadEnds(){
    map.sectors.getAll().forEach(sector=>{
      if(!sector.isFloorSpecial()) return; //short-circuit
      let neighbors = getNeighbors({
        map,sector,orthogonal:false,
        onTest:sector=> sector.isFloorSpecial()||sector.isDoor()
      });

      if(neighbors.length>1) return; //short-circuit

      // now we recursively walk backwards down the hallway cleaning it up
      let current = sector;

      do{
        const next = neighbors.pop();

        current.setEmpty();
        current = next;
        neighbors = getNeighbors({
          map,sector:current,orthogonal:false,
          onTest:sector=> sector.isFloorSpecial()||sector.isDoor()
        });
      }while(neighbors.length===1)
    });
  }

  // This function checks to see if the hallways will create
  // a square. We can't allow this, so we return true if they will and
  // prevent it in the move function
  //eslint-disable-next-line complexity
  function blocked(direction){
    let result = false;

    if(direction===NORTH&&y-1-ROOMSIZE>=0){
      if(x-1-ROOMSIZE>=0&& //northwest
        map.isFloorSpecial({x: x-1,y})&&
        map.isFloorSpecial({x: x-1-ROOMSIZE,y: y-1})&&
        map.isFloorSpecial({x: x-1,y: y-1-ROOMSIZE})) result = true;
      if(x+6<map.width&& //northeast
        map.isFloorSpecial({x: x+1,y})&&
        map.isFloorSpecial({x: x+1+ROOMSIZE,y: y-1})&&
        map.isFloorSpecial({x: x+1,y: y-1-ROOMSIZE})) result = true
    }else if(direction===SOUTH&&y+1+ROOMSIZE<map.height){
      if(x-1-ROOMSIZE>=0&& //southwest
        map.isFloorSpecial({x: x-1,y})&&
        map.isFloorSpecial({x: x-1-ROOMSIZE,y: y+1})&&
        map.isFloorSpecial({x: x-1,y: y+1+ROOMSIZE})) result = true;
      if(x+1+ROOMSIZE<map.width&& //southeast
        map.isFloorSpecial({x: x+1,y})&&
        map.isFloorSpecial({x: x+1+ROOMSIZE,y: y+1})&&
        map.isFloorSpecial({x: x+1,y: y+1+ROOMSIZE})) result = true;
    }else if(direction===EAST&&x+6<map.width){
      if(y-1-ROOMSIZE>=0&& //eastnorth
        map.isFloorSpecial({x,y: y-1})&&
        map.isFloorSpecial({x: x+1,y: y-1-ROOMSIZE})&&
        map.isFloorSpecial({x: x+1+ROOMSIZE,y: y-1})) result = true
      if(y+6<map.height&& //eastsouth
        map.isFloorSpecial({x,y: y+1})&&
        map.isFloorSpecial({x: x+1,y: y+1+ROOMSIZE})&&
        map.isFloorSpecial({x: x+1+ROOMSIZE,y: y+1})) result = true
    }else if(direction===WEST&&x-6>=0){
      if(y-6>=0&& //westnorth
        map.isFloorSpecial({x,y: y-1})&&
        map.isFloorSpecial({x: x-1,y: y-1-ROOMSIZE})&&
        map.isFloorSpecial({x: x-1-ROOMSIZE,y: y-1})) result = true;
      if(y<map.height&& //westsouth
        map.isFloorSpecial({x,y: y+1})&&
        map.isFloorSpecial({x: x-1,y: y+1+ROOMSIZE})&&
        map.isFloorSpecial({x: x-1-ROOMSIZE,y: y+1})) result = true;
    } //end if
    return result;
  } //end function

  // Carve out a path for the player in the direction specified
  function move(direction){
    let result=false;

    if(direction===NORTH && !blocked(NORTH)){
      if(map.isFloorSpecial({x,y: y-1-ROOMSIZE})){
        y-=1+ROOMSIZE;
      }else{
        for(let cyc=y;y>=cyc-ROOMSIZE;y--) map.setFloorSpecial({x,y});
        result = true;
      } //end if
    }else if(direction===EAST && !blocked(EAST)){
      if(map.isFloorSpecial({x: x+1+ROOMSIZE,y})){
        x+=1+ROOMSIZE;
      }else{
        for(let cxc=x;x<=cxc+ROOMSIZE;x++) map.setFloorSpecial({x,y});
        result = true;
      } //end if
    }else if(direction===SOUTH && !blocked(SOUTH)){
      if(map.isFloorSpecial({x,y: y+1+ROOMSIZE})){
        y+=1+ROOMSIZE;
      }else{
        for(let cyc=y;y<=cyc+ROOMSIZE;y++) map.setFloorSpecial({x,y});
        result = true;
      } //end if
    }else if(direction===WEST && !blocked(WEST)){
      if(map.isFloorSpecial({x: x-1-ROOMSIZE,y})){
        x-=1+ROOMSIZE;
      }else{
        for(let cxc=x;x>=cxc-ROOMSIZE;x--) map.setFloorSpecial({x,y});
        result = true;
      } //end if
    } //end function
    return result;
  } //end move function

  //eslint-disable-next-line complexity
  function fillRoom(x,y,x2,y2){
    let setDoor = false, randomDirection, failureCount=0;

    for(let j=y;j<=y2;j++){
      for(let i=x;i<=x2;i++){
        if(j===y||j===y2||i===x||i===x2){
          map.setWall({x: i,y: j});
        }else{
          map.setRoom({x: i,y: j,id: currentRoomNumber});
          map.setFloor({x: i,y: j});
        } //end if
      } //end for
    } //end for
    while(!setDoor&&failureCount<100){
      randomDirection=Math.floor(Math.random()*5);

      if(randomDirection===NORTH){
        const rx=Math.floor(Math.random()*(x2-x))+x;

        if(map.isFloor({x: rx,y: y+1})&&map.isFloorSpecial({x: rx,y: y-1})){
          map.setDoor({x: rx,y});setDoor = true;
        } //end if
      }else if(randomDirection===EAST){
        const ry=Math.floor(Math.random()*(y2-y))+y;

        if(map.isFloor({x: x2-1,y: ry})&&map.isFloorSpecial({x: x2+1,y: ry})){
          map.setDoor({x: x2,y: ry});setDoor = true;
        } //end if
      }else if(randomDirection===WEST){
        const ry=Math.floor(Math.random()*(y2-y))+y;

        if(map.isFloor({x: x+1,y: ry})&&map.isFloorSpecial({x: x-1,y: ry})){
          map.setDoor({x,y: ry});setDoor = true;
        } //end if
      }else if(randomDirection===SOUTH){
        const rx=Math.floor(Math.random()*(x2-x))+x;

        if(map.isFloor({x: rx,y: y2-1})&&map.isFloorSpecial({x: rx,y: y2+1})){
          map.setDoor({x: rx,y: y2});setDoor = true;
        } //end if
      } //end if
      failureCount++;
    } //end while()

    // In the unlikely event that the map has a void and we couldn't
    // connect the room to a hallway, lets clear the room we made; otherwise
    // lets attribute the room
    if(!setDoor){
      for(let j=y;j<=y2;j++) for(let i=x;i<=x2;i++) map.setEmpty({x: i,y: j});
    }else{
      currentRoomNumber++;
    } //end if
  } //end fillRoom()

  function allocateRooms(){
    const minWidth=3,minHeight=3;

    map.sectors.getAll().forEach(sector=>{
      const {x,y} = sector;
      if(sector.isEmpty()){
        let freeX=new Set();

        for(let i=x,sx=x;i>0&&i<map.width-2&&i-sx<=ROOMSIZE;i++){
          if(map.isEmpty({x: i,y})){
            freeX.add(i);
          }else{
            break;
          } //end if
        } //end for
        if(freeX.size>=minWidth){
          let freeY = new Set(),
              intersectY=new Set();

          [...freeX].some((fx,fxIndex)=>{
            intersectY.clear();
            for(let i=y,sy=y;i>0&&i<map.height-2&&i-sy<=ROOMSIZE;i++){
              if(map.isEmpty({x: fx,y: i})){
                if(fxIndex===0) freeY.add(i);
                if(fxIndex!==0) intersectY.add(i);
              }else{
                break;
              } //end if
            } //end for
            if(fxIndex>0){
              freeY = new Set([...freeY].filter(o=>intersectY.has(o)));
              if(freeY.size===0) return true;
            } //end if
            return false;
          });
          if(freeY.size>=minHeight){
            fillRoom(
              Math.min(...freeX),
              Math.min(...freeY),
              Math.max(...freeX),
              Math.max(...freeY)
            );
          } //end if
        } //end if
      } //end if
    });
  } //end allocateRooms()

  // Drunk walker makes hallways according to the
  // restriction that we need to leave enough space for rooms
  function createHallways(){
    let fail=0, win=0, direction;

    while(fail<750&&win<map.width+map.height){
      direction=Math.floor(Math.random()*4);
      if(direction===NORTH&&y-2-ROOMSIZE>=0&&move(NORTH)){
        win++
      }else if(direction===EAST&&x+2+ROOMSIZE<map.width&&move(EAST)){
        win++;
      }else if(direction===SOUTH&&y+2+ROOMSIZE<map.height&&move(SOUTH)){
        win++
      }else if(direction===WEST&&x-2-ROOMSIZE>=0&&move(WEST)){
        win++
      }else{
        fail++;
      } //end if
    } //end while
  } //end createHallways()

  // Surround all floors traversable with walls
  function buildWalls(){
    map.sectors.getAll().forEach(sector=>{
      if(!sector.isEmpty()) return; //short-circuit
      if(
        sector.isEmpty()&&
        getNeighbors({
          map,sector,orthogonal:true,
          onTest:sector=>sector.isWalkable()
        }).length
      ){
        sector.setWall();
      } //end if
    });
  } //end buildWalls()
} //end function
