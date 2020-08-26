import {fillRect} from './fillRect';
import {findPath} from './findPath';
import {getNeighbors} from '../tools/getNeighbors';

// return a seemingly random path between two points. `wide` will
// have the path be occasionally wider than 1 sector. `onDraw` function
// will be applied to each sector in the path
export function drunkenPath({
  map,x1=0,y1=0,x2=0,y2=0,wide=false,constrain=false,
  onDraw=()=>true,
  onFailureReattempt=()=>{},
  onFailure=()=>{}
}={}){
  const cMap = map.clone(),
        minX = Math.min(x1,x2),
        maxX = Math.max(x1,x2),
        minY = Math.min(y1,y2),
        maxY = Math.max(y1,y2);

  let path;

  // randomly populate noise on a cloned map until there's a viable
  // path from x1,y1 to x2,y2
  fillRect({
    map:cMap,x1,y1,x2,y2,
    onDraw(sector){
      if(
        Math.random()<0.7||
        Math.abs(sector.x-x1)<3&&Math.abs(sector.y-y1)<3||
        Math.abs(sector.x-x2)<3&&Math.abs(sector.y-y2)<3
      ){
        sector.setFloor();
      }else{
        sector.setWall();
      } //end if
    }
  });
  path = findPath({
    x1,y1,x2,y2,map:cMap,
    onTest(sector){
      return sector.isWalkable()&&
        sector.x>=minX&&sector.x<=maxX&&
        sector.y>=minY&&sector.y<=maxY;
    }
  });

  // if the map input didn't allow a path, it's possible there's a failure
  // in such cases lets allow an onFailure function so the caller can handle
  // these cases
  if(!path) path = onFailureReattempt({x1,y1,x2,y2});

  // now we'll onDraw the path between the points
  (path||[]).forEach(sector=>{
    if(wide){
      getNeighbors({
        map,x: sector.x,y: sector.y,orthogonal: false,
        onTest(sector){
          return Math.random()<0.35&&sector.isWalkable();
        }
      }).forEach(sector=> onDraw(map.getSector({x: sector.x,y: sector.y})));
      onDraw(map.getSector({x: sector.x,y: sector.y}));
    }else{
      onDraw(map.getSector({x: sector.x,y: sector.y}));
    } //end if
  });

  if(!path) onFailure({x1,y1,x2,y2});
} // end drunkenPath()
