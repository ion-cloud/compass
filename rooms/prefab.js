import {roomTranslateCoordinates} from '../utilities/roomTranslateCoordinates';
import {isPrefabEntryDoor} from '../utilities/isPrefabEntryDoor';

const charMap = {
  '.': 'setFloor',
  ',': 'setFloorSpecial',
  '#': 'setWall',
  '%': 'setWallSpecial',
  '~': 'setWater',
  '-': 'setWaterSpecial',
  '*': 'setWindow',
  'x': 'setRemoved',
  '?': 'setEmpty',
  '+': 'setDoor',
  '=': 'setDoor'
};

export const prefab = {
  name: 'prefab',
  fn({map,room,prefab,roomDirection,x,y,x1,y1,x2,y2}){
    const doors = [],
          {width,height} = prefab.details;

    if(!map.isRect({
      x1,y1,x2,y2,
      test:sector=>{
        const {x,y} = sector;

        return sector.isEmpty()||(sector.isWall()||sector.isDoor())&&(
          x===x1||x===x2||y===y1||y===y2
        );
      }
    })) return {success:false};

    // not all prefabs have an entry door at the bottom center, those are
    // allowed in origin prefabs but not regular connected prefab rooms
    if(!isPrefabEntryDoor({prefab})&&room.name!=='prefab origin'){
      return {success:false};
    } //end if

    // draw the prefab
    for(let cy = 0;cy<prefab.details.height;cy++){
      for(let cx = 0;cx<prefab.details.width;cx++){
        if(cx>prefab.data[cy].length-1) break;
        const char = prefab.data[cy][cx];

        let {x,y} = roomTranslateCoordinates({x1,y1,cx,cy,width,height,roomDirection});

        if(char==='+'){
          doors.push({x,y});
        }else if(charMap.hasOwnProperty(char)){
          const randomNumber = Math.random();

          if(
            charMap[char].includes('setFloor')&&
            room.waterChance&&Math.random()<room.waterChance
          ){
            map.setWater({x,y});
          }else if(charMap[char].includes('setFloor')){
            map.setFloor({x,y});
          }else{
            map[charMap[char]]({x,y}); //ignoring 'setEmpty'
          } //end if
        } //end if
      } //end for
    } //end for

    const exits = doors.reduce((exits,{x,y})=>{

      // exit is on map edge, close up wall
      if(x===0||x===map.width-1||y===0||y===map.height-1){
        map.setWall({x,y});
        return exits;
      } //end if

      // gather neighbors that are currently empty
      const neighbors =  map.getNeighbors({
        x,y,orthogonal:false,
        test(sector){
          return sector.isEmpty();
        }
      });

      // if the door is an internal door then we can draw it, but it doesn't
      // constitute a room exit
      if(!neighbors.length){
        map.setDoor({x,y});
        return exits;
      } //end if

      // even though it's a potential exit, it may not be filled so lets set
      // it as a wall for now
      map.setWall({x,y});

      // we only allow one exit, corners may potential reveal two, ignore other
      const neighbor = neighbors.shift();

      const direction = neighbor.x<x?
        'west':neighbor.x>x?
        'east':neighbor.y<y?
        'north':'south';

      return [...exits, {x,y,direction}];
    },[]);

    return {success:true,exits};
  }
};
