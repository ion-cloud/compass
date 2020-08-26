import {fillRect} from '../tools/fillRect';
import {Noise} from '../Noise';
import {clipOrphaned} from '../tools/clipOrphaned';

export function marsh({map}){
  const noise = new Noise();

  fillRect({
    map, 
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise.simplex2(sector.x/map.width*2,sector.y/map.height*2))/2;

      if(n<0.15){
        sector.setWaterSpecial();
      }else if(n<0.3&&Math.random()<0.3){
        sector.setWall();
      }else if(n<0.3){
        sector.setWater();
      }else if(Math.random()<n-0.25){
        sector.setWall();
      }else if(n>0.7){
        sector.setFloor();
      }else{
        sector.setFloorSpecial();
      } //end if
    }
  });

  clipOrphaned({
    map, 
    onTest: sector=> sector.isWalkable()||sector.isEmpty(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
