import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {Noise} from '../Noise';

export function turlough({map}){
  const noise = new Noise();

  fillRect({
    map, x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const {x,y} = sector,
            yd = Math.abs(y-map.height/2)/(map.height/2),
            xd = Math.abs(x-map.width/2)/(map.width/2),
            d = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2));

      let n = (1+noise.simplex2(sector.x/map.width*3,sector.y/map.height*3))/2;

      // d turns it into a circle
      n=(n+d)/2;
      if(n<0.2){
        sector.setWaterSpecial();
      }else if(n<0.3){
        sector.setWater();
      }else if(n<0.5){
        sector.setFloorSpecial();
      }else if(n>0.8){
        sector.setWallSpecial();
      }else if(n>0.7){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  // finally we'll clean up unwalkable sections
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
