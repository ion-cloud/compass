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
      const neighbors = getNeighbors({
        map, x, y, size: 2, self: true, onTest:sector=> sector.isDoor()
      });

      if(neighbors.length>1) neighbors.forEach(sector=> sector.setFloor());
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
