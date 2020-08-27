import {rooms} from '../rooms/';
import {roomGetCoordinates} from '../utilities/roomGetCoordinates';
import {roomGetPossiblePrefabs} from '../utilities/roomGetPossiblePrefabs';
import {takeWeighted} from '../utilities/takeWeighted';
import {takeRandom} from '../utilities/takeRandom';
import {GenericState} from '../utilities/GenericState';
import {shuffle} from '../utilities/shuffle';
import {clipOrphaned} from '../tools/clipOrphaned';
import {getNeighbors} from '../tools/getNeighbors';
import {getNeighborsHorizontal} from '../tools/getNeighborsHorizontal';
import {getNeighborsVertical} from '../tools/getNeighborsVertical';
import {ExistenceMap} from '../ExistenceMap';
import {isRect} from '../tools/isRect';
import {lake} from '../facets/lake';

// eslint-disable-next-line complexity
export function template({map,name,options=null}={}){
  if(!options) throw new Error('template generator options missing');
  const startingState = new GenericState({
          x: Math.floor(map.width/2),
          y: Math.floor(map.height/2),
          direction: takeRandom(['north','south','east','west']),
          room: options.prefabOrigin ? {name: 'prefab origin'} : takeRandom(options.rooms),
          originRoomNumber: map.currentRoom
        }),
        todo = [startingState],
        prefabs = roomGetPossiblePrefabs({map}),
        doors = [];

  let step=0, //number of times of which we've iterated.
      next, //this holds the next set of information pulled from the todo array
      successfulRooms=1; //this is used for the roomNum as well as debugging

  do{
    step++; //increase the number of times we've iterated by one.
    shuffle(todo);
    next=todo.shift(); //now it's shuffled, take a todo off list and start

    // Square and circular rooms have different size metrics. Depending on
    // which type the room is, acquire the room size
    if(buildRoom(next)){
      successfulRooms++;
    }else if(step>=1000&&successfulRooms<15||todo.length===0&&successfulRooms<15){
      map.reset();
      successfulRooms=1;
      step=0;
      todo.length = 0;
      todo.push(startingState);
    } //end if
  }while(todo.length>0&&step<500||step===0);
  if(options.doors&&options.doors.expand&&doors.length) doorExpand();

  // now remove unwalkable - this should hopefully be unnecessary for 6 sigma cases
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isDoor(),
    onFailure: sector=> sector.setWallSpecial()
  });

  if(options.lake&&!options.lake.chance||options.lake&&Math.random()<options.lake.chance){
    const maxWidth = options.lake.maxWidth||16,
          maxHeight = options.lake.maxHeight||16,
          minWidth = options.lake.minWidth||8,
          minHeight = options.lake.minHeight||8,
          minAmount = options.lake.minAmount||options.lake.amount||1,
          maxAmount = options.lake.maxAmount||options.lake.amount||1,
          amount = Math.round(Math.random()*(maxAmount-minAmount)+minAmount),
          x1 = map.startX, y1 = map.startY, x2 = map.width-1, y2 = map.height-1,
          xa = x2-x1-maxWidth, ya = y2-y1-maxHeight;

    let current = 0;

    do{
      const rx = x1+Math.floor(Math.random()*xa),
            ry = y1+Math.floor(Math.random()*xa),
            width = Math.floor(Math.random()*(maxWidth-minWidth)+minWidth),
            height = Math.floor(Math.random()*(maxHeight-minHeight)+minHeight),
            sand = new ExistenceMap(),
            water = new ExistenceMap(),
            waterSpecial = new ExistenceMap(),
            wall = new ExistenceMap();

      lake({
        map,x1:rx,y1:ry,x2:rx+width,y2:ry+height,
        sand: !options.lake.ignoreSand,
        onTestSand:sector=>!sector.isWall()&&!sector.isWater()&&Math.random()<0.4,
        onDrawSand:sector=> sand.set(sector),
        onTestWall:sector=>sector.isEmpty(),
        onDrawWater:sector=> water.set(sector),
        onDrawWaterSpecial:sector=> waterSpecial.set(sector),
        onDrawWall:sector=> wall.set(sector)
      });
      if(
        [...sand.getAll(),...water.getAll()]
          .find(sector=> map.isWalkable(sector))
      ){
        sand.getAll().forEach(({x,y})=>map.setFloorSpecial({x,y}));
        water.getAll().forEach(({x,y})=>{
          if(options.lake.types){
            map[takeRandom(options.lake.types)]({x,y});
          }else{
            map.setWater({x,y});
          } //end if
        });
        waterSpecial.getAll().forEach(({x,y})=>{
          if(options.lake.types){
            map[takeRandom(options.lake.types)]({x,y});
          }else{
            map.setWaterSpecial({x,y});
          } //en dif
        });
        wall.getAll().forEach(({x,y})=>map.setWall({x,y}));
        current++;
      } //end if
    }while(current<amount)
  } //end if

  // now add extra connections and then cleanup doors if they're too close
  if(!options.doors||options.doors&&!options.doors.expand){
    const doors = new ExistenceMap();

    map.sectors.getAll().forEach(sector=>{
      if(sector.isWall()){
        const rooms = {},
              neighborsWalkable = getNeighbors({
                map, ...sector, orthogonal: false, onTest:sector=> sector.isWalkable()
              }),
              neighborsWallHorizontal = getNeighborsHorizontal({
                map, ...sector, onTest:sector=> sector.isWall()
              }),
              neighborsWallVertical = getNeighborsVertical({
                map, ...sector, onTest:sector=> sector.isWall()
              }),
              list = Object.keys(
                neighborsWalkable.reduce((rooms,sector)=>{
                  rooms[sector.roomNumber]=true;
                  return rooms;
                },{})
              );

        if(
          list.length==2&&!map.rooms[list[0]][list[1]]&&
          (neighborsWallHorizontal.length===2||neighborsWallVertical.length===2)
        ){
          if(options.doors&&options.doors.ignore&&Math.random()<options.doors.ignore){
            sector.setFloor();
          }else{
            sector.setDoor();
            doors.set(sector);
          } //end if
          map.rooms[list[0]][list[1]]=true;
        } //end if
      }else if(sector.isDoor()){
        doors.set(sector);
      } //end if
    });
    shuffle(doors.getAll()).forEach(({x,y})=>{
      const sector = map.getSector({x,y});

      if(!sector.isDoor()) return;
      const doorsNearby = getNeighbors({
        map, x, y, size: 2, self: true, onTest:sector=> sector.isDoor()
      });

      if(doorsNearby.length>1) return doorsNearby.forEach(sector=> sector.setFloor());
      const walkableNearby = getNeighbors({
        map, x, y, onTest:sector=> sector.isWalkable()
      });

      if(walkableNearby.length<=1) return sector.setWall();
      const wallsVertical = getNeighborsVertical({
          map, x, y, onTest:sector=> sector.isWall()
        }),
        wallsHorizontal = getNeighborsHorizontal({
          map, x, y, onTest:sector=> sector.isWall()
        });

      if(wallsVertical.length<2&&wallsHorizontal.length<2) sector.setFloor();
    });
  } //end if

  // given a specified x and y coordinate, roomsize, direction and type
  // we will draw a circular room
  // eslint-disable-next-line complexity
  function buildRoom({room,x,y,direction,originRoomNumber}={}){
    const {fn} = rooms.find(r=>r.name.includes(room.name.includes('prefab')?'prefab':room.name)),
          roomSize = room.name==='prefab origin'?null:takeWeighted(room.sizes).size,
          prefab = room.name==='prefab origin'?
            takeRandom(prefabs):room.name.includes('prefab')?
            takeRandom(
              prefabs.filter(prefab=>{
                if(room.filter){
                  return room.filter.includes(prefab.name);
                } //end if
                return prefab.details.width<roomSize&&
                  prefab.details.height<roomSize;
              })
            ):null,
          roomSizeX = room.name.includes('prefab')?prefab.details.width:roomSize,
          roomSizeY = room.name.includes('prefab')?prefab.details.height:roomSize,
          {x1,y1,x2,y2} = roomGetCoordinates({x,y,direction,roomSizeX,roomSizeY}),
          {success,exits} = fn({map,room,prefab,direction,x1,y1,x2,y2});

    // short-circuit
    if(!success) return false;
    map.rooms[originRoomNumber]=map.rooms[originRoomNumber]||{};
    map.rooms[originRoomNumber][map.currentRoom]=true;
    map.rooms[map.currentRoom]={};
    map.rooms[map.currentRoom][originRoomNumber]=true;
    if(!prefab){
      map.setDoor({x,y});
      doors.push({x,y});
      if(options.doors&&options.doors.ignore&&Math.random()<options.doors.ignore){
        map.setFloor({x,y});
        map.setRoom({x,y});
      } //end if
    } //end if
    exits.forEach(({x,y,direction})=>{
      const room = takeWeighted(options.rooms),
            originRoomNumber = map.currentRoom;

      todo.push(new GenericState({x,y,direction,room,originRoomNumber}))
    });
    map.nextRoom();
    return true;
  } //end buildSphereRoom()

  function doorExpand(){
    doors.forEach(({x,y})=>{
      getNeighbors({map,x,y,size:options.doors.expand.size||1})
        .forEach(sector=>{
          if(Math.random()<options.doors.expand.chance){
            if(options.doors.expand.waterChance&&Math.random()<options.doors.expand.waterChance){
              sector.setWater();
            }else{
              sector.setFloor();
            } //end if
          } //end if
          getNeighbors({
            map,
            ...sector,
            onTest(sector){
              return sector.isEmpty();
            }
          }).forEach(sector=> sector.setWall());
        });
    });
  } //end doorExpand()
} //end function
