import {ExistenceMap} from '../ExistenceMap';
import {fillRect} from '../tools/fillRect';

const exists = new ExistenceMap();

function defaultOnDraw(sector){
  sector.setFloor();
} //end defaultOnDraw();

// sectors must be type ExistenceMap
export function surroundSectors({
  map,sectors,size=1,iterations=1,
  onDraw=sector=>sector.setFloor(),
  onTest=()=>true
}={}){
  sectors.getAll().forEach(({x,y})=>{
    const [originX,originY] = [x,y];

    fillRect({
      map,
      x1: x-size, y1: y-size, x2: x+size, y2: y+size,
      onTest({x,y}){
        return !exists.get({x,y})&&onTest({x,y,originX,originY,size});
      },
      onDraw(sector){
        const {x,y} = sector;

        exists.set({x,y});
        onDraw(sector);
      }
    });
  });
} //end surroundSectors()
