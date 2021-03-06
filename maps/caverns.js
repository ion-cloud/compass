import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';

// wikipedia.org/wiki/Conway%27s_Game_of_Life
function conwayGameOfLife(map,map2){
  let mooresNeighborhood;

  map.sectors.getAll().forEach(sector=>{
    const {x,y} = sector;

    mooresNeighborhood=getMooresNeighborhood(map,map2,x,y);
    if(map2.isFloor({x,y})){
      if(mooresNeighborhood>=4){
        map.setFloor({x,y});
      }else{
        map.setEmpty({x,y});
      } //end if
    }else if(mooresNeighborhood>=5){
      map.setFloor({x,y});
    }else{
      map.setEmpty({x,y});
    } //end if
  });
} //end conwayGameOfLife()

// it gets the number of living cells nearby.
// living cells to us mean sectors that are floors
function getMooresNeighborhood(map,map2,x,y){
  let result=0;

  if(map.isInbounds({x: x-1,y: y-1})&&map2.isFloor({x: x-1,y: y-1})) result++;
  if(map.isInbounds({x: x-1,y})&&map2.isFloor({x: x-1,y})) result++;
  if(map.isInbounds({x: x-1,y: y+1})&&map2.isFloor({x: x-1,y: y+1})) result++;
  if(map.isInbounds({x,y: y-1})&&map2.isFloor({x,y: y-1})) result++;
  if(map.isInbounds({x,y: y+1})&&map2.isFloor({x,y: y+1})) result++;
  if(map.isInbounds({x: x+1,y: y-1})&&map2.isFloor({x: x+1,y: y-1})) result++;
  if(map.isInbounds({x: x+1,y})&&map2.isFloor({x: x+1,y})) result++;
  if(map.isInbounds({x: x+1,y: y+1})&&map2.isFloor({x: x+1,y: y+1})) result++;
  return result;
} //end testSides()

// Surround all floors traversable with walls
function buildWalls(map){
  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const {x,y} = sector;

      if(x===map.startX||x===map.width-1||y===map.startY||y===map.height-1){
        map.isFloor(sector)&&map.setWall({x,y});
      }else if(sector.isFloor()){
        map.isEmpty({x: x-1,y})&&map.setWall({x: x-1,y});
        map.isEmpty({x: x+1,y})&&map.setWall({x: x+1,y});
        map.isEmpty({x,y: y-1})&&map.setWall({x,y: y-1});
        map.isEmpty({x,y: y+1})&&map.setWall({x,y: y+1});
        map.isEmpty({x: x-1,y: y-1})&&map.setWall({x: x-1,y: y-1});
        map.isEmpty({x: x+1,y: y+1})&&map.setWall({x: x+1,y: y+1});
        map.isEmpty({x: x-1,y: y+1})&&map.setWall({x: x-1,y: y+1});
        map.isEmpty({x: x+1,y: y-1})&& map.setWall({x: x+1,y: y-1});
      } //end if
    }
  });
} //end buildWalls()

export function caverns({map,density=0.55}){
  const map2 = map.clone();

  // Start off by creating the secondary map
  // and generating some noise on the two maps
  for(let y=0;y<map.height;y++){
    for(let x=0;x<map.width;x++){
      map.setEmpty({x,y});
      map2.setEmpty({x,y});
      if(Math.random()<density) map2.setFloor({x,y});
    } //end for
  } //end for
  conwayGameOfLife(map,map2);
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setEmpty()
  })
  buildWalls(map);
  return true;
} //end AGC()
