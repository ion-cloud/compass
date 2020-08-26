import {fillRect} from '../tools/fillRect';
import {Noise} from '../Noise';

export function cliffs({map}){
  const noise = new Noise();

  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n1 = noise.perlin2(sector.x/map.width*12,sector.y/map.height*10),
            n1w = 1,
            n2 = noise.perlin2(sector.x/map.width*3,sector.y/map.height*3),
            n2w = 3,
            n = (n1*n1w+n2*n2w)/(n1w+n2w),
            c = noise.perlin2(sector.x/map.width*3,sector.y/map.height*3);

      if(n<0.01){
        sector.setWaterSpecial();
      }else if(n<0.11){
        sector.setWater();
      }else if(n<0.25&&c<0.2&&Math.random()<0.1){
        sector.setWallSpecial();
      }else if(n<0.25&&c<0.2){
        sector.setWall();
      }else if(n<0.18){
        sector.setFloorSpecial();
      }else{
        sector.setFloor();
      } //end if
    }
  });
} //end cliffs()
