import {rooms} from '../rooms/';
import {roomGetCoordinates} from '../utilities/roomGetCoordinates';
import {roomGetPossiblePrefabs} from '../utilities/roomGetPossiblePrefabs';
import {takeWeighted} from '../utilities/takeWeighted';
import {takeRandom} from '../utilities/takeRandom';
import {GenericState} from '../utilities/GenericState';

// eslint-disable-next-line complexity
export function template({map,name,options=null}={}){
  if(!options) throw new Error('template generator options missing');
  const todo = [], //holds the list of directions that need to be searched
        prefabs = roomGetPossiblePrefabs({map});

  let cx = Math.floor(map.width/2),
      cy = Math.floor(map.height/2),
      roomDirection = takeRandom(['north','south','east','west']),
      step=0, //number of times of which we've iterated.
      next, //this holds the next set of information pulled from the todo array
      successfulRooms=1; //this is used for the roomNum as well as debugging

  do{
    step++; //increase the number of times we've iterated by one.

    // First see if it's the first round, if so then we will start out
    // by creating a room in the center of the entire map, else we will use
    // one of the starting points our last room left for us
    if(step!==1){
      if(todo[0].priority){
        next = todo.shift();
      }else{
        map.constructor.shuffle(todo);
        next=todo.shift(); //now it's shuffled, take a todo off list and start
      } //end if
      cx=next.x;
      cy=next.y;
      roomDirection=next.direction;
    } //end if

    const room = step===1&&options.prefabOrigin?{name:'prefab origin'}:takeWeighted(options.rooms);

    // Square and circular rooms have different size metrics. Depending on
    // which type the room is, acquire the room size
    if(buildRoom({room,x:cx,y:cy,roomDirection})){
      successfulRooms++;
    }else if(step>=1000&&successfulRooms<15||todo.length===0&&successfulRooms<15){
      map.sectors.flat().forEach(sector=> sector.setEmpty());
      successfulRooms=1;
      step=0;
      cx = Math.floor(map.width/2);
      cy = Math.floor(map.height/2);
    }else if(next.priority){
      map.setWall({x:next.x,y:next.y});
    } //end if
  }while(todo.length>0&&step<500||step===0);

  /*
  // now remove unwalkable
  map.clipOrphaned({
    test: sector=> sector.isWalkable()||sector.isDoor(),
    failure: sector=> sector.setRemoved()
  });*/

  // given a specified x and y coordinate, roomsize, direction and type
  // we will draw a circular room
  // eslint-disable-next-line complexity
  function buildRoom({room,x,y,roomDirection}={}){

    const {fn} = rooms.find(r=>r.name===(room.name==='prefab origin'?'prefab':room.name)),
          roomSize = room.name==='prefab origin'?null:takeWeighted(room.sizes).size,
          prefab = room.name==='prefab origin'?
            takeRandom(prefabs):room.name==='prefab'?
            takeRandom(prefabs.filter(prefab=>prefab.details.width<roomSize&&prefab.details.height<roomSize)):null,
          roomSizeX = room.name.includes('prefab')?prefab.details.width:roomSize,
          roomSizeY = room.name.includes('prefab')?prefab.details.height:roomSize,
          {x1,y1,x2,y2} = roomGetCoordinates({x,y,roomDirection,roomSizeX,roomSizeY}),
          {success,exits} = fn({map,name: room.name,prefab,roomDirection,x1,y1,x2,y2});

    // short-circuit
    if(!success) return false;
    if(!prefab) map.setDoor({x,y});
    exits.forEach(({x,y,direction})=> todo.push(new GenericState({x,y,direction})));
    return true;
  } //end buildSphereRoom()
} //end function
