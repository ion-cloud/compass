import {getNeighbors} from '../tools/getNeighbors';
import {iterateRect} from '../tools/iterateRect';
import {getNeighborsNontouching} from '../tools/getNeighborsNontouching';
import {getNeighborsHorizontal} from '../tools/getNeighborsHorizontal';
import {getNeighborsVertical} from '../tools/getNeighborsVertical';
import {takeRandom} from '../utilities/takeRandom';
import {shuffle} from '../utilities/shuffle';
import {isInbounds} from '../tools/isInbounds';
import {ExistenceMap} from '../ExistenceMap';
import {isRect} from '../tools/isRect';
import {fillRect} from '../tools/fillRect';

export function diffuseCorridors({
  map,x1=map.startX,y1=map.startY,x2=map.width,y2=map.height,
  minSize=2,maxSize=5,connected=0.5,deadends=false
}={}){
  const todo = [],
        directions = ['north','south','east','west'],
        targetSectors = (x2-x1)*(y2-y1)/8,
        originX = Math.floor(x1+(x2-x1)/2),
        originY = Math.floor(y1+(y2-y1)/2);

  let current = 0,
      sparkNum = 0,
      currentWalk = 0,
      direction = null,
      sector = map.getSector({x: originX,y: originY}),
      lastSector = null,
      neighbors = null;

  sector.setFloorSpecial();
  directions.forEach(direction=> todo.push({sector:map.getSector(sector,direction),direction}));
  do{
    if(sparkNum>4){
      ({sector,direction} = shuffle(todo).shift());
    }else{
      ({sector,direction} = todo.shift());
    } //end if
    sparkNum++;
    if(getNeighbors({map, sector, size: 1, onTest:s=>!s.isEmpty()}).length>2) continue;
    if(
      sparkNum>4&&
      getNeighborsNontouching({
        map, size: 2, sector,
        onTest:sector=> sector.isWalkable()
      }).filter(sector=> !sector.isEmpty()).length
    ) continue;
    sector.setFloorSpecial();
    currentWalk = 0;
    do{
      lastSector = sector;
      sector = map.getSector(sector,direction);
      if(!sector.isEmpty()||!isInbounds({map,sector,buffer:1})) break;
      if(
        getNeighborsNontouching({
          map, size: 1, sector: lastSector,
          onTest: sector=> sector.isWalkable()
        }).filter(sector=> !sector.isEmpty()).length
      ) break;
      if(getNeighbors({map, sector, size: 1, onTest:s=>!s.isEmpty()}).length>2) break;
      directions.forEach(direction=> todo.push({sector,direction}));
      sector.setFloorSpecial();
      currentWalk++;
      current++;
    }while(currentWalk<maxSize)
  }while(current<targetSectors&&todo.length)

  // See where all the walls could have been
  const walls = new ExistenceMap();

  map.sectors.getAll().forEach(sector=>{
    if(!sector.isFloor()) return;
    getNeighbors({
      map,x: sector.x,y: sector.y,
      onTest: sector=> sector.isEmpty()
    }).forEach(sector=> walls.set(sector));
  });

  // now randomly add some doors to connect corridors
  walls.getAll().forEach(sector=>{
    const neighborsWallHorizontal = getNeighborsHorizontal({
            map, ...sector, onTest:sector=> sector.isFloor()
          }).length,
          neighborsWallVertical = getNeighborsVertical({
            map, ...sector, onTest:sector=> sector.isFloor()
          }).length,
          neighborsTotal = neighborsWallHorizontal+neighborsWallVertical,
          canConnect = neighborsTotal===2&&(!neighborsWallHorizontal||!neighborsWallVertical);

    if(Math.random()<connected&&canConnect) map.setFloorSpecial(sector);
  });
  allocateRooms(map);
  if(!deadends) removeDeadEnds(map);

  // surround map with walls
  map.sectors.getAll().forEach(sector=>{
    if(!sector.isFloor()) return;
    getNeighbors({
      map,x: sector.x,y: sector.y,
      onTest: sector=> sector.isEmpty()
    }).forEach(sector=> sector.setWall());
  });
} //end diffuseCorridors()

const [WEST,EAST,NORTH,SOUTH] = [0,1,2,3],
      ROOMSIZE = 5; //can't be lower than 3, includes wall

let currentRoomNumber=1;
function allocateRooms(map){
  const minWidth=4,minHeight=4;

  iterateRect({
    map,x1:map.startX,y1:map.startY,x2:map.width-1,y2:map.width-1,
    onEach({x,y}){
      const sector = map.getSector({x,y});

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
              map,
              Math.min(...freeX),
              Math.min(...freeY),
              Math.max(...freeX),
              Math.max(...freeY)
            );
          } //end if
        } //end if
      } //end if
    }
  });
} //end allocateRooms()

function fillRoom(map,x,y,x2,y2){
  let setDoor = false, randomDirection, failureCount=0;

  for(let j=y+1;j<=y2-1;j++){
    for(let i=x+1;i<=x2-1;i++){
      map.setRoom({x: i,y: j,id: currentRoomNumber});
      map.setFloor({x: i,y: j});
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

// We find the end of a hallway and recursively work backwards until
// we find a door or more than one hallway directional path
function removeDeadEnds(map){
  map.sectors.getAll().forEach(sector=>{
    if(!sector.isFloorSpecial()) return; //short-circuit
    let neighbors = getNeighbors({
      map,sector,orthogonal:false,
      onTest:sector=> sector.isFloorSpecial()||sector.isDoor()
    });

    if(!neighbors.length||neighbors.length>1) return; //short-circuit

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
