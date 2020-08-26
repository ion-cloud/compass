import {shuffle} from '../utilities/shuffle';
import {getNeighbors} from '../tools/getNeighbors';
import {findPath} from '../tools/findPath';
import {fillRect} from '../tools/fillRect';
import {isRect} from '../tools/isRect';
import {fillRoom} from '../tools/fillRoom';
import {clipOrphaned} from '../tools/clipOrphaned';

const hallwayLengthMean = 5;
const hallwayLengthSigma = 1.4; //standard deviation = sigma
const directions = ['north','south','east','west'];

function getTargetCoordinates({x,y,direction,length,w=0,h=0}){
  const r = Math.random()<0.5?1:-1;

  let result;

  if(direction==='north'){
    result = {x: x+r*w,y: y-(length||h)};
  }else if(direction==='south'){
    result = {x: x+r*w,y: y+(length||h)};
  }else if(direction==='east'){
    result = {x: x+(length||w),y: y+r*h};
  }else if(direction==='west'){
    result = {x: x-(length||w),y: y+r*h};
  } //end if
  return result;
} //end getTargetCoordinates()

export function clusteredRooms({
  map,x1=map.startX,y1=map.startY,x2=map.width,y2=map.height,
  minRoomSize=3,maxRoomSize=5,emptyWeight=3,floorWeight=1,otherWeight=20,
  hallwayLengthMean=8,hallwayLengthSigma=1.4 //standard deviation
}={}){
  const nodes = [],
        width = x2-x1,
        height = y2-y1,
        requiredRooms = width*height/Math.pow(maxRoomSize,2)/2;

  let x=x1+Math.floor(Math.random()*width/2)+Math.floor(width/4),
      y=y1+Math.floor(Math.random()*height/2)+Math.floor(height/4),
      leafs = [], direction, target, path, rooms = 0;

  nodes.push({x,y,direction: 'north'});
  nodes.push({x,y,direction: 'south'});
  nodes.push({x,y,direction: 'east'});
  nodes.push({x,y,direction: 'west'});
  shuffle(nodes);
  do{
    if(!direction){
      ({x,y,direction}=nodes.pop());
    }else if(
      path&&path.length&&path.every(sector=>{
        return sector.isEmpty()&&map.isInbounds({
          x: sector.x, y: sector.y, x1:x1+2,y1:y1+2,x2:x2-2,y2:y2-2
        });
      })
    ){
      ({x,y}=target);
      nodes.push({x,y,direction: 'north'});
      nodes.push({x,y,direction: 'south'});
      nodes.push({x,y,direction: 'east'});
      nodes.push({x,y,direction: 'west'});
      path.forEach(sector=> sector.isEmpty()?sector.setFloorSpecial():null);
      shuffle(nodes);
      rooms += buildRooms(path.map(({x,y})=>({x,y})));
      leafs = [].concat(
        leafs,
        ...path.map(({x,y})=>({x,y}))
          .map(({x,y})=>{
            return directions.map(direction=> ({x,y,direction}))
          })
      );
      path.length=0;
      continue;
    }else if(nodes.length){
      ({x,y,direction}=nodes.pop());
    }else if(leafs.length){
      ({x,y,direction}=leafs.pop());
    }//end if
    length = getHallwayLength();
    target = getTargetCoordinates({x,y,direction,length});
    path = findPath({
      map,
      x1:x,y1:y,x2:target.x,y2:target.y,
      computeWeight:sector=>sector.isEmpty()?emptyWeight:sector.isFloorSpecial()?floorWeight:otherWeight
    });
    if(path) path.shift(); // remove the starting point
  }while(rooms<requiredRooms&&(nodes.length||leafs.length))

  // before we quantify a failure, we need to ensure that all walkable
  // floor is accessible
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isDoor(),
    onFailure: sector=> sector.setEmpty()
  });

  // clean up and throw the walls around walkables
  removeDeadEnds();
  wallify();

  function buildRooms(path){
    let rooms = 0;

    while(path.length){
      shuffle(path);
      shuffle(directions);
      const [ox,oy] = Object.values(path.pop());

      // sometimes a path has been closed, only try to build if we know
      // we can connect it to a hallway/floor
      // eslint-disable-next-line complexity,curly,no-loop-func
      if(map.isWalkable({x: ox,y: oy})) directions.find(direction=>{

        let result = false,
            x = ox, y = oy; // restore values before last try

        // width, height and target(x,y)
        const w = Math.floor(Math.random()*(maxRoomSize-minRoomSize)+minRoomSize),
              h = Math.floor(Math.random()*(maxRoomSize-minRoomSize)+minRoomSize),
              t = getTargetCoordinates({x,y,direction,w,h});

        if(direction==='north'){
          y-=1; t.y-=1;
          if(x<t.x){
            x-=w/2|0; t.x-=w/2|0;
          }else{
            x+=w/2|0; t.x+=w/2|0;
          } //end if
        }else if(direction==='south'){
          y+=1; t.y+=1;
          if(x<t.x){
            x-=w/2|0; t.x-=w/2|0;
          }else{
            x+=w/2|0; t.x+=w/2|0;
          } //end if
        }else if(direction==='east'){
          x+=1; t.x+=1;
          if(y<t.y){
            y-=h/2|0; t.y-=h/2|0;
          }else{
            y+=h/2|0; t.y+=h/2|0;
          } //end if
        }else if(direction==='west'){
          x-=1; t.x-=1;
          if(y<t.y){
            y-=h/2|0; t.y-=h/2|0;
          }else{
            y+=h/2|0; t.y+=h/2|0;
          } //end if
        } //end if

        // if the area is empty then we can make the room
        if(
          isRect({
            map,
            x1: x, y1: y, x2: t.x, y2: t.y,
            hasAll(sector){
              return sector.isEmpty()&&
                map.isInbounds({
                  x: sector.x, y: sector.y,
                  x1:y1+2, y1:y1+2, x2:x2-2, y2:y2-2
                })
            }
          })
        ){
          fillRoom({
            map,
            x1: x,y1: y,x2: t.x,y2: t.y,
            onFloor(sector){
              sector.setFloor();
            },
            onWall(sector){
              sector.setWall();
            }
          });
          result = true;
          if(direction==='north'&&map.isFloorSpecial({x: Math.floor((x+t.x)/2),y: y+1})){
            map.setDoor({x: Math.floor((x+t.x)/2),y});
          }else if(direction==='north'&&map.isFloorSpecial({x: Math.ceil((x+t.x)/2),y: y+1})){
            map.setDoor({x: Math.ceil((x+t.x)/2),y});
          }else if(direction==='south'&&map.isFloorSpecial({x: Math.floor((x+t.x)/2),y: y-1})){
            map.setDoor({x: Math.floor((x+t.x)/2),y});
          }else if(direction==='south'&&map.isFloorSpecial({x: Math.ceil((x+t.x)/2),y: y-1})){
            map.setDoor({x: Math.ceil((x+t.x)/2),y});
          }else if(direction==='east'&&map.isFloorSpecial({x: x-1,y: Math.floor((y+t.y)/2)})){
            map.setDoor({x,y: Math.floor((y+t.y)/2)});
          }else if(direction==='east'&&map.isFloorSpecial({x: x-1,y: Math.ceil((y+t.y)/2)})){
            map.setDoor({x,y: Math.ceil((y+t.y)/2)});
          }else if(direction==='west'&&map.isFloorSpecial({x: x+1,y: Math.floor((y+t.y)/2)})){
            map.setDoor({x,y: Math.floor((y+t.y)/2)});
          }else if(direction==='west'&&map.isFloorSpecial({x: x+1,y: Math.ceil((y+t.y)/2)})){
            map.setDoor({x,y: Math.ceil((y+t.y)/2)});
          } //end if
          rooms++;
        } //end if
        return result;
      });
    } //end while()
    return rooms;
  } //end buildRoom()

  // We find the end of a hallway and recursively work backwards until
  // we find a door or more than one hallway directional path
  function removeDeadEnds(){
    map.sectors.getAll().forEach(sector=>{
      if(!sector.isFloorSpecial()) return; //short-circuit
      let neighbors = getNeighbors({
        map,
        sector,orthogonal:false,
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
          map,
          sector:current,orthogonal:false,
          onTest:sector=> sector.isFloorSpecial()||sector.isDoor()
        });
      }while(neighbors.length===1)
    });
  }

  // surround the corridors that arent surrounded with walls yet with walls now.
  function wallify(){
    map.sectors.getAll().forEach(sector=>{
      if(!sector.isEmpty()&&!sector.isWall()) return; //short-circuit
      if(
        getNeighbors({
          map,
          sector,orthogonal:true,
          onTest:sector=>sector.isWalkable()
        }).length
      ){
        sector.setWall();
      }else{
        sector.setEmpty();
      } //end if
    });
  } //end wallify()

  // Given a mean and standard deviation, compute a random length
  function getHallwayLength(){
    const X = Math.random()*Math.PI*2,
          Y = Math.random(),
          r = hallwayLengthSigma*Math.sqrt(-2*Math.log(Y)),
          //x = r*Math.cos(X)+hallwayLengthMean,
          y = r*Math.sin(X)+hallwayLengthMean;

    return y|0||1; //we're on a grid, can't have partial/0 hallway lengths
  } //end getHallwayLength()
} //end function
