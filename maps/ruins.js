const mapTypes = [
  {
    name: 'standard crypt',
    waterChance: 5,
    roomShape: [
      {
        name: 'square',
        chance: 95,
        sizes: [
          {size: 5, chance: 10},{size: 4, chance: 35},
          {size: 3, chance: 70},{size: 2, chance: 100}
        ]
      },
      {
        name: 'spherical',
        chance: 100,
        sizes: [
          {size: 9, chance: 4},{size: 8, chance: 8},
          {size: 7, chance: 12},{size: 6, chance: 20},
          {size: 5, chance: 45},{size: 4, chance: 70},
          {size: 3, chance: 100}
        ]
      }
    ]
  },
  {
    name: 'ancient crypt',
    waterChance: 85,
    roomShape: [
      {
        name: 'square',
        chance: 80,
        sizes: [
          {size: 5, chance: 10},{size: 4, chance: 35},
          {size: 3, chance: 70},{size: 2, chance: 100}
        ]
      },
      {
        name: 'spherical',
        chance: 100,
        sizes: [
          {size: 9, chance: 4},{size: 8, chance: 8},
          {size: 7, chance: 12},{size: 6, chance: 20},
          {size: 5, chance: 45},{size: 4, chance: 70},
          {size: 3, chance: 100}
        ]
      }
    ]
  },
  {
    name: 'crypt catacombs',
    waterChance: 15,
    roomShape: [
      {
        name: 'square',
        chance: 100,
        sizes: [
          {size: 5, chance: 10},{size: 4, chance: 35},
          {size: 3, chance: 70},{size: 2, chance: 100}
        ]
      }
    ]
  },
  {
    name: 'marshy dredge',
    waterChance: 85,
    roomShape: [
      {
        name: 'spherical',
        chance: 50,
        sizes: [
          {size: 15, chance: 2},{size: 14, chance: 4},
          {size: 13, chance: 6},{size: 12, chance: 8},
          {size: 11, chance: 10},{size: 10, chance: 12},
          {size: 9, chance: 14},{size: 8, chance: 16},
          {size: 7, chance: 18},{size: 6, chance: 20},
          {size: 5, chance: 45},{size: 4, chance: 70},
          {size: 3, chance: 100}
        ]
      },
      {
        name: 'square',
        chance: 100,
        sizes: [
          {size: 5, chance: 10},{size: 4, chance: 35},
          {size: 3, chance: 70},{size: 2, chance: 100}
        ]
      }
    ]
  },
  {
    name: 'wide passages',
    waterChance: 35,
    roomShape: [
      {
        name: 'spherical',
        chance: 100,
        sizes: [
          {size: 15, chance: 4},{size: 14, chance: 8},
          {size: 13, chance: 12},{size: 12, chance: 16},
          {size: 11, chance: 20},{size: 10, chance: 24},
          {size: 9, chance: 28},{size: 8, chance: 32},
          {size: 7, chance: 36},{size: 6, chance: 40},
          {size: 5, chance: 70},{size: 4, chance: 90},
          {size: 3, chance: 100}
        ]
      }
    ]
  },
  {
    name: 'deep passages',
    waterChance: 60,
    roomShape: [
      {
        name: 'spherical',
        chance: 90,
        sizes: [
          {size: 11, chance: 4},{size: 10, chance: 8},
          {size: 9, chance: 12},{size: 8, chance: 16},
          {size: 7, chance: 20},{size: 6, chance: 30},
          {size: 5, chance: 50},{size: 4, chance: 70},
          {size: 3, chance: 100}
        ]
      },
      {
        name: 'square',
        chance: 100,
        sizes: [
          {size: 5, chance: 10},{size: 4, chance: 35},
          {size: 3, chance: 70},{size: 2, chance: 100}
        ]
      }
    ]
  }
];

const roomTypes = [
  'normal','dispersion','water islands','water island walkways',
  'water island','water pool'
];
const roomTypesNonWater = roomTypes.filter(r=>!r.includes('water'));

// given a certain procedural type randomly select the room shape
function getRoomShape(proceduralType){
  const d100 = Math.floor(Math.random()*100);

  let roomShape;

  //eslint-disable-next-line no-return-assign
  proceduralType.roomShape.some(s=>roomShape=d100<s.chance?s.name:false);
  return roomShape;
} //end getRoomShape()

// given a certain procedural type and shape randomly select a room size
function getRoomSize(proceduralType,shapeName){
  const d100 = Math.floor(Math.random()*100),
        roomShape =  proceduralType.roomShape.find(s=>s.name===shapeName);

  let roomSize;

  //eslint-disable-next-line no-return-assign
  roomShape.sizes.some(s=> roomSize = d100<s.chance?s.size:false);
  return roomSize;
} //end getRoomSize()

// eslint-disable-next-line complexity
export function ruins({
  map,templateName=[
    'standard crypt','ancient crypt','crypt catacombs','marshy dredge',
    'wide passages','deep passages'
  ][Math.floor(Math.random()*6)]
}={}){
  const size = map.width,
        todo = [], //holds the list of directions that need to be searched
        proceduralType=mapTypes.find(template=>template.name===templateName);

  let cx = Math.floor(map.width/2),
      cy = Math.floor(map.height/2),
      roomDirection, //room direction to build
      roomSize, //room size of which to try to build.
      roomShape, //room type of which to build
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

    roomShape = getRoomShape(proceduralType);
    roomSize = getRoomSize(proceduralType,roomShape);

    // If we are first starting out the generation, then we need to have a
    // starting direction to begin building. Randomly choose that direction
    if(step===1) roomDirection = ['north','south','east','west'][Math.floor(Math.random()*4)];

    // Square and spherical rooms have different size metrics. Depending on
    // which type the room is, acquire the room size
    if(step>=1000){
      todo.length=0;
    }else{
      const useWater = Math.floor(Math.random()*100)<proceduralType.waterChance,
            drawPathway = step===1?false:true;

      let roomType;

      if(successfulRooms>=15&&useWater){
        roomType=roomTypes[Math.floor(Math.random()*roomTypes.length)];
      }else if(successfulRooms>=15&&!useWater){
        roomType=roomTypesNonWater[Math.floor(Math.random()*roomTypesNonWater.length)];
      } //end if
      if(roomShape==='spherical'){
        if(buildSphereRoom(cx,cy,roomSize,roomDirection,drawPathway,roomType)){
          successfulRooms++;
        }else if(Math.random()<0.5){
          roomSize=2;
          roomShape='square'; //try a square room before moving on
        } //end if
      } //end if
      if(roomShape==='square'){
        if(buildSquareRoom(cx,cy,roomSize,roomDirection,drawPathway,roomType)){
          successfulRooms++;
        } //end if
      } //end if
    } //end if
    if(todo.length===0 && successfulRooms<15){
      map.sectors.flat().forEach(sector=> sector.setEmpty());
      successfulRooms=1;
      step=0;
      cx = Math.floor(map.width/2);
      cy = Math.floor(map.height/2);
    } //end if
  }while(todo.length>0||step===0);

  // remove stranded floors, wallifying and cleaning doors
  map.sectors.flat().forEach(sector=>{
    if(
      (sector.isWalkable()||sector.isDoor())&&
      !map.getNeighbors({
        sector,orthogonal:true,
        test:sector=>sector.isWalkable()||sector.isDoor()
      }).length
    ){
      sector.setEmpty(); //removing stranded floors
    }else if(
      sector.isEmpty()&&
      map.getNeighbors({
        sector,orthogonal:true,
        test:sector=>sector.isWalkable()||sector.isDoor()
      }).length
    ){
      sector.setWall(); //wallifying
    }else if(
      sector.isDoor()&&
      map.getNeighbors({
        sector,test:sector=>sector.isWall()
      }).length<2
    ){
      sector.setRemoved(); //removing erroneous doors
    } //end if
  });
  return true;

  //eslint-disable-next-line complexity
  function drawSpecialty(x,y,sx,sy,ex,ey,type){
    const halfX = (ex-sx)/2,
          halfY = (ey-sy)/2;

    if(type==='dispersion'){
      map.setFloor({x,y});
      if(ey-sy>2&&ex-sx>2&&(x===sx||x===ex||y===sy||y===ey)&&Math.random()<0.5){
        map.setEmpty({x,y});
      } //end if
    }else if(type==='water islands'){
      if(Math.random()<0.5){ //50% chance
        map.setFloor({x,y});
      }else{
        map.setWater({x,y});
      } //end if
    }else if(type==='water island walkways'){
      const n=Math.random()<0.5,
            s=Math.random()<0.5,
            e=Math.random()<0.5,
            w=Math.random()<0.5,
            na = x>=sx+halfX-1&&x<=ex-halfX&&y<=ey-halfY,
            sa = x>=sx+halfX-1&&x<=ex-halfX&&y>=sy+halfY-1,
            wa = x<=ex-halfX&&y>=sy+halfY-1&&y<=ey-halfY,
            ea = x>=sx+halfX-1&&y>=sy+halfY-1&&y<=ey-halfY;

      if(n&&na||s&&sa||w&&wa||e&&ea){
        map.setFloor({x,y});
        if(Math.random()<0.3)if(map.isWater({x: x-1,y: y-1}))map.setFloor({x: x-1,y: y-1});
        if(Math.random()<0.3)if(map.isWater({x: x+1,y: y-1}))map.setFloor({x: x+1,y: y-1});
        if(Math.random()<0.3)if(map.isWater({x: x-1,y: y+1}))map.setFloor({x: x-1,y: y+1});
        if(Math.random()<0.3)if(map.isWater({x: x+1,y: y+1}))map.setFloor({x: x+1,y: y+1});
      }else{
        map.setWater({x,y});
      } //end if
    }else if(type==='water island'){
      if(x>=sx+halfX/2&&x<=ex-halfX/2&&y>=sy+halfY/2&&y<=ey-halfY/2){
        const bend = Math.random()<0.5;

        if(bend&&x===sx+(halfX/2)|0||bend&&x===ex-(halfX/2)|0||
           bend&&y===sy+(halfY/2)|0||bend&&y===ey-(halfY/2)|0){
          map.setWater({x,y});
        }else{
          map.setFloor({x,y});
        } //end if
      }else{
        map.setWater({x,y});
      } //end if
    }else if(type==='water pool'){
      if(x>=sx+halfX/2&&x<=ex-halfX/2&&y>=sy+halfY/2&&y<=ey-halfY/2){
        const bend = Math.random()<0.5;

        if(bend&&x===sx+(halfX/2)|0||bend&&x===ex-(halfX/2)|0||
           bend&&y===sy+(halfY/2)|0||bend&&y===ey-(halfY/2)|0){
          map.setFloor({x,y});
        }else{
          map.setWater({x,y});
        } //end if
      }else{
        map.setFloor({x,y});
      } //end if
    }else{ // type==='normal'
      map.setFloor({x,y});
    } //end if
    return true;
  } //end drawSpecialty()

  // given a specified x and y coordinate, roomsize, direction and type
  // we will draw a spherical room
  // eslint-disable-next-line complexity
  function buildSphereRoom(x,y,roomSize,roomDirection,drawPathway,type){
    const r = roomSize/2,
          offset = roomSize%2===0?2:1,
          lx = x-(r)|0-offset>=0,
          ly = y-(r)|0-offset>=0,
          rn = lx && x+Math.ceil(r)+offset<size&&y-roomSize-offset>=0,
          re = ly && y+Math.ceil(r)+offset<size&&x+roomSize+offset<size,
          rs = lx && x+Math.ceil(r)+offset<size&&y+roomSize+offset<size,
          rw = ly && y+Math.ceil(r)+offset<size&&x-roomSize-offset>=0;

    let i,j,sx,sy,ex,ey;

    if(roomSize===5){
      if(roomDirection==='north' && rn){
        if(!map.isRect({
          x1:x-3,y1:y-6,x2:x+3,y2:y,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x-2; sy=y-5; ex = x+2; ey=y-1;
        /*eslint-disable */
        [
                              [x,y-5],
                    [x-1,y-4],[x,y-4],[x+1,y-4],
          [x-2,y-3],[x-1,y-3],[x,y-3],[x+1,y-3],[x+2,y-3],
                    [x-1,y-2],[x,y-2],[x+1,y-2],
                              [x,y-1]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
        map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
        todo.push({direction: 'north',x,y: y-6});
        todo.push({direction: 'west',x: x-3,y: y-3});
        todo.push({direction: 'east',x: x+3,y: y-3});
      }else if(roomDirection==='east' && re){
        if(!map.isRect({
          x1:x,y1:y-3,x2:x+6,y2:y+2,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x+1; ex = x+5; sy = y-2; ey = y+2;
        /*eslint-disable */
        [
                              [x+3,y-2],
                    [x+2,y-1],[x+3,y-1],[x+4,y-1],
          [x+1,y  ],[x+2,y  ],[x+3,y  ],[x+4,y  ],[x+5,y  ],
                    [x+2,y+1],[x+3,y+1],[x+4,y+1],
                              [x+3,y+2]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
        map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
        todo.push({direction: 'north',x: x+3,y: y-3});
        todo.push({direction: 'east',x: x+6,y});
        todo.push({direction: 'south',x: x+3,y: y+3});
      }else if(roomDirection==='south' && rs){
        if(!map.isRect({
          x1:x-3,y1:y,x2:x+3,y2:y+6,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x-2; sy = y+1; ex = x+2; ey = y+5;
        /*eslint-disable */
        [
                              [x  ,y+1],
                    [x-1,y+2],[x  ,y+2],[x+1,y+2],
          [x-2,y+3],[x-1,y+3],[x  ,y+3],[x+1,y+3],[x+2,y+3],
                    [x-1,y+4],[x  ,y+4],[x+1,y+4],
                              [x  ,y+5]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
        map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
        todo.push({direction: 'south',x,y: y+6});
        todo.push({direction: 'west',x: x-3,y: y+3});
        todo.push({direction: 'east',x: x+3,y: y+3});
      }else if(roomDirection==='west' && rw){
        if(!map.isRect({
          x1:x-6,y1:y-3,x2:x,y2:y+3,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x-5; ex = x-1; sy = y-2; ey = y+2;
        /*eslint-disable */
        [
                              [x-3,y-2],
                    [x-4,y-1],[x-3,y-1],[x-2,y-1],
          [x-5,y  ],[x-4,y  ],[x-3,y  ],[x-2,y  ],[x-1,y  ],
                    [x-4,y+1],[x-3,y+1],[x-2,y+1],
                              [x-3,y+2]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
        map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
        todo.push({direction: 'north',x: x-3,y: y-3});
        todo.push({direction: 'west',x: x-6,y});
        todo.push({direction: 'south',x: x-3,y: y+3});
      } //end if
    }else if(roomSize===4){
      if(roomDirection==='north' && rn){
        if(Math.floor(Math.random()*2)===0){
          if(!map.isRect({
            x1:x-2,y1:y-5,x2:x+3,y2:y,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x-1; ex = x+2; sy = y-4; ey = y-1;
          /*eslint-disable */
          [
                      [x,y-4],[x+1,y-4],
            [x-1,y-3],[x,y-3],[x+1,y-3],[x+2,y-3],
            [x-1,y-2],[x,y-2],[x+1,y-2],[x+2,y-2],
                      [x,y-1],[x+1,y-1]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
          map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
          if(Math.random()<0.5){ //50% chance
            todo.push({direction: 'east',x: x+3,y: y-2});
          }else{
            todo.push({direction: 'east',x: x+3,y: y-3});
          } //end if
          if(Math.random()<0.5){ //50% chance
            todo.push({direction: 'west',x: x-2,y: y-2});
          }else{
            todo.push({direction: 'west',x: x-2,y: y-3});
          } //end if
          if(Math.random()<0.5){ //50% chance
            todo.push({direction: 'north',x,y: y-5});
          }else{
            todo.push({direction: 'north',x: x+1,y: y-5});
          } //end if
        }else{
          if(!map.isRect({
            x1:x-3,y1:y-5,x2:x+2,y2:y,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x-2; sy = y-4; ex = x+1; ey= y-1;
          /*eslint-disable */
          [
                      [x-1,y-4],[x,y-4],
            [x-2,y-3],[x-1,y-3],[x,y-3],[x+1,y-3],
            [x-2,y-2],[x-1,y-2],[x,y-2],[x+1,y-2],
                      [x-1,y-1],[x,y-1]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
          map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'east',x: x+2,y: y-2});
          }else{
            todo.push({direction: 'east',x: x+2,y: y-3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'west',x: x-3,y: y-2});
          }else{
            todo.push({direction: 'west',x: x-3,y: y-3});
          }
          if(Math.random()<0.5){
            todo.push({direction: 'north',x: x-1,y: y-5});
          }else{
            todo.push({direction: 'north',x,y: y-5});
          } //end if
        } //end if
      }else if(roomDirection==='east' && re){
        if(Math.random()<0.5){
          if(!map.isRect({
            x1:x,y1:y-2,x2:x+5,y2:y+3,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x+1; ex = x+4; sy = y-1; ey = y+2;
          /*eslint-disable */
          [
                      [x+2,y-1],[x+3,y-1],
            [x+1,y  ],[x+2,y  ],[x+3,y  ],[x+4,y  ],
            [x+1,y+1],[x+2,y+1],[x+3,y+1],[x+4,y+1],
                      [x+2,y+2],[x+3,y+2]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
          map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'north',x: x+2,y: y-2});
          }else{
            todo.push({direction: 'north',x: x+3,y: y-2});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'east',x: x+5,y});
          }else{
            todo.push({direction: 'east',x: x+5,y: y+1});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'south',x: x+2,y: y+3});
          }else{
            todo.push({direction: 'south',x: x+3,y: y+3});
          } //end if
        }else{
          if(!map.isRect({
            x1:x,y1:y-3,x2:x+5,y2:y+2,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x+1; ex = x+4; sy = y-2; ey = y+1;
          /*eslint-disable */
          [
                      [x+2,y-2],[x+3,y-2],
            [x+1,y-1],[x+2,y-1],[x+3,y-1],[x+4,y-1],
            [x+1,y  ],[x+2,y  ],[x+3,y  ],[x+4,y  ],
                      [x+2,y+1],[x+3,y+1]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
          map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'north',x: x+2,y: y-3});
          }else{
            todo.push({direction: 'north',x: x+3,y: y-3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'east',x: x+5,y: y-1});
          }else{
            todo.push({direction: 'east',x: x+5,y});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'south',x: x+2,y: y+2});
          }else{
            todo.push({direction: 'south',x: x+3,y: y+2});
          } //end if
        } //end if
      }else if(roomDirection==='south' && rs){
        if(Math.floor(Math.random()*2)===0){
          if(!map.isRect({
            x1:x-2,y1:y,x2:x+3,y2:y+5,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x-1; sy = y+1; ex = x+2; ey = y+4;
          /*eslint-disable */
          [
                      [x  ,y+1],[x+1,y+1],
            [x-1,y+2],[x  ,y+2],[x+1,y+2],[x+2,y+2],
            [x-1,y+3],[x  ,y+3],[x+1,y+3],[x+2,y+3],
                      [x  ,y+4],[x+1,y+4]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
          map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'east',x: x+3,y: y+2});
          }else{
            todo.push({direction: 'east',x: x+3,y: y+3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'west',x: x-2,y: y+2});
          }else{
            todo.push({direction: 'west',x: x-2,y: y+3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'south',x,y: y+5});
          }else{
            todo.push({direction: 'south',x: x+1,y: y+5});
          } //end if
        }else{
          if(!map.isRect({
            x1:x-3,y1:y,x2:x+2,y2:y+5,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x-2; sy = y+1; ex = x+1; ey = y+4;
          /*eslint-disable */
          [
                      [x-1,y+1],[x  ,y+1],
            [x-2,y+2],[x-1,y+2],[x  ,y+2],[x+1,y+2],
            [x-2,y+3],[x-1,y+3],[x  ,y+3],[x+1,y+3],
                      [x-1,y+4],[x  ,y+4]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
          map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'east',x: x+2,y: y+2});
          }else{
            todo.push({direction: 'east',x: x+2,y: y+3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'west',x: x-3,y: y+2});
          }else{
            todo.push({direction: 'west',x: x-3,y: y+3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'south',x: x-1,y: y+5});
          }else{
            todo.push({direction: 'south',x,y: y+5});
          } //end if
        } //end if
      }else if(roomDirection==='west' && rw){
        if(Math.random()<0.5){
          if(!map.isRect({
            x1:x-5,y1:y-2,x2:x,y2:y+3,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x-4; sy = y-1; ex = x-1; ey = y+2;
          /*eslint-disable */
          [
                      [x-3,y-1],[x-2,y-1],
            [x-4,y  ],[x-3,y  ],[x-2,y  ],[x-1,y  ],
            [x-4,y+1],[x-3,y+1],[x-2,y+1],[x-1,y+1],
                      [x-3,y+2],[x-2,y+2]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
          map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'north',x: x-2,y: y-2});
          }else{
            todo.push({direction: 'north',x: x-3,y: y-2});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'west',x: x-5,y});
          }else{
            todo.push({direction: 'west',x: x-5,y: y+1});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'south',x: x-2,y: y+3});
          }else{
            todo.push({direction: 'south',x: x-3,y: y+3});
          } //end if
        }else{
          if(!map.isRect({
            x1:x-5,y1:y-3,x2:x,y2:y+2,
            test:sector=>sector.isEmpty()
          })) return false;
          if(drawPathway) map.setDoor({x,y});
          sx = x-4; sy = y-2; ex = x-1; ey = y+1;
          /*eslint-disable */
          [
                      [x-3,y-2],[x-2,y-2],
            [x-4,y-1],[x-3,y-1],[x-2,y-1],[x-1,y-1],
            [x-4,y  ],[x-3,y  ],[x-2,y  ],[x-1,y  ],
                      [x-3,y+1],[x-2,y+1]
          ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
          /*eslint-enable */
          map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
          map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
          if(Math.random()<0.5){
            todo.push({direction: 'north',x: x-2,y: y-3});
          }else{
            todo.push({direction: 'north',x: x-3,y: y-3});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'west',x: x-5,y: y-1});
          }else{
            todo.push({direction: 'west',x: x-5,y});
          } //end if
          if(Math.random()<0.5){
            todo.push({direction: 'south',x: x-2,y: y+2});
          }else{
            todo.push({direction: 'south',x: x-3,y: y+2});
          } //end if
        } //end if
      } //end if
    }else if(roomSize===3){
      if(roomDirection==='north' && rn){
        if(!map.isRect({
          x1:x-2,y1:y-4,x2:x+2,y2:y,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x-1; ex = x+1; sy = y-3; ey = y-1;
        /*eslint-disable */
        [
                    [x,y-3],
          [x-1,y-2],[x,y-2],[x+1,y-2],
                    [x,y-1]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
        map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
        todo.push({direction: 'east',x: x+2,y: y-2});
        todo.push({direction: 'west',x: x-2,y: y-2});
        todo.push({direction: 'north',x,y: y-4});
      }else if(roomDirection==='east' && re){
        if(!map.isRect({
          x1:x,y1:y-2,x2:x+4,y2:y+2,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x+1; ex = x+3; sy = y-1; ey = y+1;
        /*eslint-disable */
        [
                    [x+2,y-1],
          [x+1,y  ],[x+2,y  ],[x+3,y  ],
                    [x+2,y+1]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
        map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
        todo.push({direction: 'east',x: x+4,y});
        todo.push({direction: 'north',x: x+2,y: y-2});
        todo.push({direction: 'south',x: x+2,y: y+2});
      }else if(roomDirection==='south' && rs){
        if(!map.isRect({
          x1:x-2,y1:y,x2:x+2,y2:y+4,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x-1; ex = x+1; sy = y+1; ey = y+3;
        /*eslint-disable */
        [
                    [x  ,y+1],
          [x-1,y+2],[x  ,y+2],[x+1,y+2],
                    [x  ,y+3]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
        map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
        todo.push({direction: 'east',x: x+2,y: y+2});
        todo.push({direction: 'west',x: x-2,y: y+2});
        todo.push({direction: 'south',x,y: y+4});
      }else if(roomDirection==='west' && rw){
        if(!map.isRect({
          x1:x-4,y1:y-2,x2:x,y2:y+2,
          test:sector=>sector.isEmpty()
        })) return false;
        if(drawPathway) map.setDoor({x,y});
        sx = x-3; sy = y-1; ex = x-1; ey = y+1;
        /*eslint-disable */
        [
                    [x-2,y-1],
          [x-3,y  ],[x-2,y  ],[x-1,y  ],
                    [x-2,y+1]
        ].forEach(arr=> drawSpecialty(arr[0],arr[1],sx,sy,ex,ey,type));
        /*eslint-enable */
        map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
        map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
        todo.push({direction: 'west',x: x-4,y});
        todo.push({direction: 'north',x: x-2,y: y-2});
        todo.push({direction: 'south',x: x-2,y: y+2});
      } //end if
    }else if(roomDirection==='north' && rn){
      sx=x-Math.floor(r);
      ex=x+Math.ceil(r);
      sy=y-roomSize;
      ey=y;
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      if(drawPathway) map.setDoor({x,y});
      for(i=sx;i<ex;i++){
        for(j=sy;j<ey;j++){
          const cx = sx+(ex-sx)/2, //center x float
                cy = sy+(ey-sy)/2, //center y float
                w = Math.abs(i-cx), //comparison width
                h = Math.abs(j-cy), //comparison height
                sa1 = 0.5+(ex-sx)/2, // semi-axis 1
                sa2 = 0.5+(ey-sy)/2, // semi-axis 2
                hypotenuse = Math.sqrt(Math.pow(w,2)+Math.pow(h,2)),
                theta = Math.asin(h / hypotenuse),
                p1 = Math.pow(sa1,2)*Math.pow(Math.sin(theta),2),
                p2 = Math.pow(sa2,2)*Math.pow(Math.cos(theta),2),
                foci = (sa1*sa2)/Math.sqrt(p1+p2);

          if(hypotenuse<foci){
            drawSpecialty(i,j,sx,sy,ex,ey,type);
          } //end if
        } //end for
      } //end for
      map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
      map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
      todo.push({direction: 'north',x,y: y-roomSize-1});
      todo.push({direction: 'west',x: x-Math.floor(r)+1,y: y-Math.floor(r)-1});
      todo.push({direction: 'east',x: x+Math.floor(r)-1,y: y-Math.floor(r)-1});
    }else if(roomDirection==='east' && re){
      sx=x+1;ex=x+roomSize;
      sy=y-Math.floor(r);
      ey=y+Math.ceil(r);
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      if(drawPathway) map.setDoor({x,y});
      for(i=sx;i<=ex;i++){
        for(j=sy;j<ey;j++){
          const cx = sx+(ex-sx)/2, //center x float
                cy = sy+(ey-sy)/2, //center y float
                w = Math.abs(i-cx), //comparison width
                h = Math.abs(j-cy), //comparison height
                sa1 = 0.5+(ex-sx)/2, // semi-axis 1
                sa2 = 0.5+(ey-sy)/2, // semi-axis 2
                hypotenuse = Math.sqrt(Math.pow(w,2)+Math.pow(h,2)),
                theta = Math.asin(h / hypotenuse),
                p1 = Math.pow(sa1,2)*Math.pow(Math.sin(theta),2),
                p2 = Math.pow(sa2,2)*Math.pow(Math.cos(theta),2),
                foci = (sa1*sa2)/Math.sqrt(p1+p2);

          if(hypotenuse<foci){
            drawSpecialty(i,j,sx,sy,ex,ey,type);
          } //end if
        } //end for
      } //end for
      map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
      map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
      todo.push({direction: 'east',x: x+roomSize,y});
      todo.push({direction: 'north',x: x+Math.ceil(r),y: y-(r)|0-1});
      todo.push({direction: 'south',x: x+Math.ceil(r),y: y+Math.ceil(r)-1});
    }else if(roomDirection==='south' && rs){
      sx=x-Math.floor(r);
      ex=x+Math.ceil(r);
      sy=y+1;
      ey=y+roomSize;
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      if(drawPathway) map.setDoor({x,y});
      for(i=sx;i<ex;i++){
        for(j=sy;j<=ey;j++){
          const cx = sx+(ex-sx)/2, //center x float
                cy = sy+(ey-sy)/2, //center y float
                w = Math.abs(i-cx), //comparison width
                h = Math.abs(j-cy), //comparison height
                sa1 = 0.5+(ex-sx)/2, // semi-axis 1
                sa2 = 0.5+(ey-sy)/2, // semi-axis 2
                hypotenuse = Math.sqrt(Math.pow(w,2)+Math.pow(h,2)),
                theta = Math.asin(h / hypotenuse),
                p1 = Math.pow(sa1,2)*Math.pow(Math.sin(theta),2),
                p2 = Math.pow(sa2,2)*Math.pow(Math.cos(theta),2),
                foci = (sa1*sa2)/Math.sqrt(p1+p2);

          if(hypotenuse<foci){
            drawSpecialty(i,j,sx,sy,ex,ey,type);
          } //end if
        } //end for
      } //end for
      map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
      map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
      todo.push({direction: 'south',x,y: y+roomSize+1});
      todo.push({direction: 'west',x: x-(r)|0-1,y: y+Math.ceil(r)});
      todo.push({direction: 'east',x: x+Math.ceil(r),y: y+Math.ceil(r)});
    }else if(roomDirection==='west' && rw){
      sx=x-roomSize;
      ex=x;
      sy=y-Math.floor(r);
      ey=y+Math.ceil(r);
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      if(drawPathway) map.setDoor({x,y});
      for(i=sx;i<ex;i++){
        for(j=sy;j<ey;j++){
          const cx = sx+(ex-sx)/2, //center x float
                cy = sy+(ey-sy)/2, //center y float
                w = Math.abs(i-cx), //comparison width
                h = Math.abs(j-cy), //comparison height
                sa1 = 0.5+(ex-sx)/2, // semi-axis 1
                sa2 = 0.5+(ey-sy)/2, // semi-axis 2
                hypotenuse = Math.sqrt(Math.pow(w,2)+Math.pow(h,2)),
                theta = Math.asin(h / hypotenuse),
                p1 = Math.pow(sa1,2)*Math.pow(Math.sin(theta),2),
                p2 = Math.pow(sa2,2)*Math.pow(Math.cos(theta),2),
                foci = (sa1*sa2)/Math.sqrt(p1+p2);

          if(hypotenuse<foci){
            drawSpecialty(i,j,sx,sy,ex,ey,type);
          } //end if
        } //end for
      } //end for
      map.setFloor({x: x-1,y}); //we enforce floors on etiher side of doors
      map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
      todo.push({direction: 'west',x: x-roomSize-1,y});
      todo.push({direction: 'north',x: x-(r)|0-1,y: y-(r)|0-1});
      todo.push({direction: 'south',x: x-(r)|0-1,y: y+Math.ceil(r)});
    }else{
      return false; //went off side of map
    } //end if
    return true;
  } //end buildSphereRoom()

  // Given a specified x and y coordinate, roomsize, direction and type
  // we will draw a square room.
  //eslint-disable-next-line complexity
  function buildSquareRoom(x,y,roomSize,roomDirection,drawPathway,type){
    const r = roomSize / 2,
          lx = x-(r|0)-1>=0,
          ly = y-(r|0)-1>=0,
          rn = lx && x+Math.ceil(r)+1<size&&y-roomSize-1>=0,
          re = ly && y+Math.ceil(r)+1<size&&x+roomSize+1<size,
          rs = lx && x+Math.ceil(r)+1<size&&y+roomSize+1<size,
          rw = ly && y+Math.ceil(r)+1<size&&x-roomSize-1>=0;

    let i,j,sx,sy,ex,ey;

    if(roomDirection==='north' && rn){
      sx=x-Math.floor(r);
      ex=x+Math.ceil(r);
      sy=y-roomSize;
      ey=y-1;
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      for(i=sx;i<=ex;i++){
        for(j=sy;j<=ey;j++){
          drawSpecialty(i,j,sx,sy,ex,ey,type);
        } //end for
      } //end for
      if(drawPathway) map.setDoor({x,y});
      map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
      map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
      todo.push({direction: 'north',x,y: sy-1});
      todo.push({direction: 'west',x: sx-1,y: sy+(r|0)});
      todo.push({direction: 'east',x: ex+1,y: sy+(r|0)});
    }else if(roomDirection==='east' && re){
      sx=x+1;
      ex=x+roomSize;
      sy=y-Math.floor(r);
      ey=y+Math.ceil(r);
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      for(i=sx;i<=ex;i++){
        for(j=sy;j<=ey;j++){
          drawSpecialty(i,j,sx,sy,ex,ey,type);
        } //end for
      } //end for
      if(drawPathway) map.setDoor({x,y});
      map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
      map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
      todo.push({direction: 'east',x: ex+1,y});
      todo.push({direction: 'north',x: sx+(r|0),y: sy-1});
      todo.push({direction: 'south',x: sx+(r|0),y: ey+1});
    }else if(roomDirection==='south' && rs){
      sx=x-Math.floor(r);
      ex=x+Math.ceil(r);
      sy=y+1;
      ey=y+roomSize;
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      for(i=sx;i<=ex;i++){
        for(j=sy;j<=ey;j++){
          drawSpecialty(i,j,sx,sy,ex,ey,type);
        } //end for
      } //end for
      if(drawPathway) map.setDoor({x,y});
      map.setFloor({x,y: y-1}); //we enforce floors on either side of doors
      map.setFloor({x,y: y+1}); //we enforce floors on either side of doors
      todo.push({direction: 'south',x,y: ey+1});
      todo.push({direction: 'west',x: sx-1,y: sy+(r|0)});
      todo.push({direction: 'east',x: ex+1,y: sy+(r|0)});
    }else if(roomDirection==='west' && rw){
      sx=x-roomSize;
      ex=x-1;
      sy=y-Math.floor(r);
      ey=y+Math.ceil(r);
      if(!map.isRect({
        x1:sx-1,y1:sy-1,x2:ex+1,y2:ey+1,
        test:sector=>sector.isEmpty()
      })) return false;
      for(i=sx;i<=ex;i++){
        for(j=sy;j<=ey;j++){
          drawSpecialty(i,j,sx,sy,ex,ey,type);
        } //end for
      } //end for
      if(drawPathway) map.setDoor({x,y});
      map.setFloor({x: x-1,y}); //we enforce floors on either side of doors
      map.setFloor({x: x+1,y}); //we enforce floors on either side of doors
      todo.push({direction: 'west',x: sx-1,y});
      todo.push({direction: 'north',x: sx+(r|0),y: sy-1});
      todo.push({direction: 'south',x: sx+(r|0),y: ey+1});
    } //end if
    return true;
  } //end buildSquareRoom()
} //end function
