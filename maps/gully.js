import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {Noise} from '../Noise';

export function gully({map}){
  const d = Math.random()<0.5,
        h = d?2:10,
        v = d?10:2,
        noise = new Noise();

  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise.simplex2(sector.x/map.width*h,sector.y/map.height*v))/2;

      if(n<0.4){
        sector.setFloorSpecial();
      }else if(n>0.5&&Math.random()<0.4){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  // remove all but the largest gully
  clipOrphaned({
    map,
    onTest: sector=> sector.isFloorSpecial(),
    onFailure: sector=> Math.random()<0.4?sector.setWall():sector.setFloor()
  });

  // now remove unwalkable
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
