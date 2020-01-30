import {rooms} from '../rooms/';

// expects array of objects that contain attribute `weight` of type Number
function takeWeighted(array){
  let weightPool = array.map(c=>c.weight).reduce((p,c)=>p+c),
      randomWeight = Math.random()*weightPool;

  return array.find(option=>{
    let result = false;

    randomWeight-=option.weight;
    if(randomWeight<=0) result = option;
    return result;
  });
} //end takeWeighted()

function takeRandom(array){
  return array[Math.floor(Math.random()*array.length)];
} //end takeRandom()

class Todo{
  constructor({x,y,direction}={}){
    this.x = x;
    this.y = y;
    this.direction = direction;
  }
}

// eslint-disable-next-line complexity
export function ruins({
  map,
  options={
    rooms: [
      {
        name: 'pillar square',
        weight: 8,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'pillar circle',
        weight: 8,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'normal square',
        weight: 8,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'normal circle',
        weight: 8,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      }
    ]
  }
}={}){
  const todo = []; //holds the list of directions that need to be searched

  let cx = Math.floor(map.width/2),
      cy = Math.floor(map.height/2),
      roomDirection, //room direction to build
      step=0, //number of times of which we've iterated.
      next, //this holds the next set of information pulled from the todo array
      successfulRooms=1; //this is used for the roomNum as well as debugging

  do{
    step++; //increase the number of times we've iterated by one.

    // First see if it's the first round, if so then we will start out
    // by creating a room in the center of the entire map, else we will use
    // one of the starting points our last room left for us
    if(step!==1){
      map.constructor.shuffle(todo);
      next=todo.shift(); //now it's shuffled, take a todo off list and start
      cx=next.x;
      cy=next.y;
      roomDirection=next.direction;
    } //end if

    const room = takeWeighted(options.rooms),
          roomSize = takeWeighted(room.sizes).size;

    // If we are first starting out the generation, then we need to have a
    // starting direction to begin building. Randomly choose that direction
    if(step===1) roomDirection = takeRandom(['north','south','east','west']);

    // Square and circular rooms have different size metrics. Depending on
    // which type the room is, acquire the room size
    if(buildRoom({room,x:cx,y:cy,roomSize,roomDirection})){
      successfulRooms++;
    }else if(step>=1000&&successfulRooms<15||todo.length===0&&successfulRooms<15){
      map.sectors.flat().forEach(sector=> sector.setEmpty());
      successfulRooms=1;
      step=0;
      cx = Math.floor(map.width/2);
      cy = Math.floor(map.height/2);
    }else{
      todo.unshift(next); //try this room exit again later
    } //end if
  }while(todo.length>0&&step<500||step===0);

  // given a specified x and y coordinate, roomsize, direction and type
  // we will draw a circular room
  // eslint-disable-next-line complexity
  function buildRoom({room,x,y,roomSize,roomDirection}={}){
    const potentialTodos = [];

    let x1,y1,x2,y2;

    if(roomDirection==='north'){
      x1 = x-Math.floor(roomSize/2);
      x2 = x+Math.ceil(roomSize/2);
      y1 = y-roomSize;
      y2 = y;
    }else if(roomDirection==='east'){
      x1 = x;
      x2 = x+roomSize;
      y1 = y-Math.floor(roomSize/2);
      y2 = y+Math.ceil(roomSize/2);
    }else if(roomDirection==='south'){
      x1 = x-Math.floor(roomSize/2);
      x2 = x+Math.ceil(roomSize/2);
      y1 = y;
      y2 = y+roomSize;
    }else if(roomDirection==='west'){
      x1 = x-roomSize;
      x2 = x;
      y1 = y-Math.floor(roomSize/2);
      y2 = y+Math.ceil(roomSize/2);
    }else{
      throw new Error(`Improper direction: ${roomDirection}`);
    } //end if
    const {fn} = rooms.find(r=>r.name===room.name),
          {success,exits} = fn({map,x1,y1,x2,y2});

    if(success){
      if(roomSize>2&&successfulRooms>1){
        map.setDoor({x,y});
      }else if(successfulRooms>1){
        map.setFloor({x,y});
      } //end if
      if(roomDirection!=='south'&&exits.north.length){
        const {x,y} = map.constructor.shuffle(exits.north).shift();

        todo.push(new Todo({direction:'north',x,y}));
      } //end if
      if(roomDirection!=='west'&&exits.east.length){
        const {x,y} = map.constructor.shuffle(exits.east).shift();

        todo.push(new Todo({direction:'east',x,y}));
      } //end if
      if(roomDirection!=='north'&&exits.south.length){
        const {x,y} = map.constructor.shuffle(exits.south).shift();

        todo.push(new Todo({direction:'south',x,y}));
      } //end if
      if(roomDirection!=='east'&&exits.west.length){
        const {x,y} = map.constructor.shuffle(exits.west).shift();

        todo.push(new Todo({direction:'west',x,y}));
      } //end if
      return true;
    } //end if
    return false;
  } //end buildSphereRoom()
} //end function
