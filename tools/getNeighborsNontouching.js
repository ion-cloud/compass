import {ExistenceMap} from '../ExistenceMap';
import {iterateNeighbors} from './iterateNeighbors';
import {iterateRect} from './iterateRect';

// return all sectors of the same category as the specified sector if
// said sectors are all consecutively touching each other and within
// the threshold of size
export function getNeighborsNontouching({
  map,sector,x=sector.x,y=sector.y,size=1,
  onTest=()=>true
}={}){
  const unmapped = [],
        result = [],
        touched = new ExistenceMap(),
        origin = map.getSector({x,y}),
        {category} = origin,
        x1 = x - size, y1 = y - size,
        x2 = x + size, y2 = y + size;

  unmapped.push(origin);
  do{
    const current = unmapped.shift();

    touched.set(current);
    iterateNeighbors({
      x: current.x, y: current.y,
      onTest(sector){
        if(touched.get(sector)) return false;
        if(sector.x<x1||sector.y<y1||sector.x>x2||sector.y>y2) return false;
        return onTest(map.getSector(sector));
      }
    }).forEach(sector=> unmapped.push(sector));
  }while(unmapped.length)
  iterateRect({
    x1, y1, x2, y2,
    onEach({x,y}){
      if(!touched.get({x,y})) result.push(map.getSector({x,y}));
    }
  });
  return result;
} //end getNeighborsNontouching()
