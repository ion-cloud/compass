import {ExistenceMap} from '../ExistenceMap';
import {bresenhamsLine} from '../tools/bresenhamsLine';
import {shuffle} from '../utilities/shuffle';
import {findPath} from '../tools/findPath';
import {getNeighbors} from '../tools/getNeighbors';
import {getTerminalPoints} from '../tools/getTerminalPoints';

// the higher the strength the higher the chance of failure
export function meander({map,strength=9,x1=null,y1=null,x2=null,y2=null}={}){
  const potentialWater=new ExistenceMap(),
        water = new ExistenceMap(),
        floorSpecial = new ExistenceMap();

  if(x1===null||y1===null||x2===null||y2===null){
    ({x1,y1,x2,y2}=getTerminalPoints({
      x1: 0,y1: 0,
      x2: map.width-1,y2: map.height-1,
      forward: false, backward: false //will prevent pruning
    }));
  } //end if
  let attempt = 0,
      path = [];

  do{
    map.reset(); //set all sectors to empty

    // create bresenhams line
    const {line} = bresenhamsLine({
      map,x1,y1,x2,y2,

      // getTerminalPoints will return x1,y1,x2,y2
      onStart: ({state})=>{
        state.line = [];
      },
      onTest: ({x1,y1,x2,y2,state})=>{
        if(!map.isInbounds({x: x1,y: y1})||!map.isInbounds({x: x2,y:y2})){
          return false;
        } //end if
        return true;
      },
      onSuccess: ({x,y,state})=> state.line.push(map.getSector({x,y}))
    });

    // chunk the line
    const chunks = line.reduce((arr,item,i)=>{
      const chunkIndex = Math.floor(i/strength); //9-sized chunks

      if(!arr[chunkIndex]) arr[chunkIndex] = [];
      arr[chunkIndex].push(item);
      return arr;
    },[]);

    // now create a maze on each chunk
    chunks.forEach(chunk=>{
      let x1 = chunk[0].x, y1 = chunk[0].y,
          x2 = chunk[chunk.length-1].x, y2 = chunk[chunk.length-1].y;


      // If the pathing vector is horizontal or vertical completely then
      // the chunks will be super thin, so we'll appropriately make the
      // chunk more of a square and impose it on the center of the line
      // so it can have enough room to actually meander
      if(x2-x1<y2-y1){
        const h = Math.round(((y2-y1)-(x2-x1))/2);

        x1-=h; x2+=h;
        if(x1<0) x1=0;
        if(x2>map.width-1) x2 = map.width-1;
      }else{
        const h = Math.round(((x2-x1)-(y2-y1))/2);

        y1-=h; y2+=h;
        if(y1<0) y1=0;
        if(y2>map.height-1) y2 = map.height-1;
      } //end if

      // we need to make sure that the difference between widths and heights
      // are all even so we can alternate between walls and floors in a maze
      // successfully. Leftovers can just use bresenhams
      if((x2-x1)%2===1&&x2<map.width-1){
        x2++;
     // }else if((x2-x1)%2===1&&x2>0){
        x2--;
      } //end if
      if((y2-y1)%2===1&&y2<map.height-1){
        y2++;
      }else if((y2-y1)%2===1&&y2>0){
        y2--;
      } //end if
      createMaze({
        map,x1,y1,x2,y2,
        sx: chunk[0].x, sy: chunk[0].y,
        ex: chunk[chunk.length-1].x, ey: chunk[chunk.length-1].y
      });
    });

    path = findPath({
      map,
      x1: line[0].x, y1: line[0].y,
      x2: line[line.length-1].x, y2: line[line.length-1].y,
      onTest({x,y}){
        return potentialWater.get({x,y});
      }
    })
    attempt++;
  }while(!path&&attempt<5)
  if(attempt>=5&&!path) throw new Error(`Meander failure: x1(${x1}),y1(${y1}),x2(${x2}),y2(${y2}) must be bad.`);
  path.forEach(sector=>{
    sector.setWater();
    water.set({x:sector.x,y:sector.y});
    getNeighbors({
      map,x: sector.x,y: sector.y,
      onTest(sector){
        return !sector.isWater();
      }
    }).forEach(sector=>{
      if(Math.random()<0.3){
        sector.setFloorSpecial();
        floorSpecial.set({x:sector.x,y:sector.y});
      } //end if
    });
  });

  // we return the sectors that were altered in existence maps so the caller
  // can undo or modify any of the sectors they want, but otherwise know what
  // was changed and to what type
  return {water,floorSpecial};

  function createMaze({map,x1=0,y1=0,x2=8,y2=8}={}){
    const sectors=[],
          directions = [
            {move: {x:-2,y:0}, carve: {x:-1,y:0}}, //west
            {move: {x:2,y:0}, carve: {x:1,y:0}}, //east
            {move: {x:0,y:-2}, carve: {x:0,y:-1}}, //north
            {move: {x:0,y:2}, carve: {x:0,y:1}} //south
          ],
          clone = map.clone();

    let x = x1, y = y1,
        direction, //represents the random chosen direction
        sector=clone.getSector({x,y}) //represents the sector we're testing

    sector.visited = true;
    potentialWater.set({x:sector.x,y:sector.y});
    sectors.push(sector);
    do{
      shuffle(directions); //mutate in-place
      for(let i=0;i<directions.length;i++){
        direction=directions[i];
        if(
          clone.isInbounds({
            x: x+direction.move.x,
            y: y+direction.move.y,
            x1, x2, y1, y2
          })&&
          !clone.getSector({
            x: x+direction.move.x,
            y: y+direction.move.y
          }).visited
        ){
          sector = clone.getSector({
            x: x+direction.carve.x,
            y: y+direction.carve.y
          });
          potentialWater.set({x:sector.x,y:sector.y});
          sector = clone.getSector({
            x: x+direction.move.x,
            y: y+direction.move.y
          });
          sector.visited = true;
          potentialWater.set({x:sector.x,y:sector.y});
          break;
        }
      } //end for
      if(sector){
        ({x,y}=sector);
        sectors.push(sector);
        sector = null;
      }else{
        ({x,y}=sectors.pop());
      } //end if
    }while(x!==x1||y!==y1);
  }
} //end meander()
