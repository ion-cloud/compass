import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {Noise} from '../Noise';

export function mesa({map}){
  const noise = new Noise();

  fillRect({
    map, x1: map.startX, y1: map.startY, x2: map.width-1, y2: map.height-1,
    onDraw(sector){
      const n1 = noise.perlin2(sector.x/map.width*12,sector.y/map.height*10),
            n2 = noise.perlin2(sector.x/map.width*6,sector.y/map.height*6),
            n = (n1+n2)/2;

      if(n<0.05&&Math.random()<0.95){
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
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
