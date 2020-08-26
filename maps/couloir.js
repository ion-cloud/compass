import {fillRect} from '../tools/fillRect';
import {Noise} from '../Noise';
import {clipOrphaned} from '../tools/clipOrphaned';

export function couloir({map}){
  const noise = new Noise();

  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = noise.simplex2(sector.x/map.width*5,sector.y/map.height*5);

      if(n<0.05&&Math.random()<0.1){
        sector.setFloorSpecial();
      }else if(n<0.05&&Math.random()<0.95){
        sector.setFloor();
      }else if(n<0.05){
        sector.setWallSpecial();
      }else if(n<0.2||Math.random()<0.2){
        sector.setWallSpecial();
      }else{
        sector.setWall();
      } //end if
    }
  });

  // clip all non-walkable parts of the map away
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isEmpty(),
    onFailure: sector=> sector.setWall()
  });
} //end function
