import {getNeighbors} from '../tools/getNeighbors';
import {clipOrphaned} from '../tools/clipOrphaned';
import {fillRect} from '../tools/fillRect';
import {Noise} from '../Noise';

export function uvala({map}){
  const sinkholes = [],
        noise = new Noise();

  fillRect({
    map, x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise.simplex2(sector.x/map.width*12,sector.y/map.height*12))/2;

      if(n<0.06){
        sector.setWaterSpecial();
        sinkholes.push(sector);
      }else if(n>0.75){
        sector.setWallSpecial();
      }else if(n>0.6){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  sinkholes.forEach(sector=>{
    getNeighbors({
      map, x: sector.x, y: sector.y, size: 5,
      onTest(sector){
        return sector.isWalkable();
      }
    }).forEach(sector=>{
      const n = (1+noise.simplex2(sector.x/map.width*12,sector.y/map.height*12))/2;

      if(n<0.1){
        sector.setWater();
      }else if(n<0.2){
        sector.setFloorSpecial();
      }else if(n<0.3&&Math.random()<0.5){
        sector.setFloorSpecial();
      }else if(Math.random()<0.2){
        sector.setFloorSpecial();
      } //end if
    })
  });

  // finally we'll clean up unwalkable sections
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isWater(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
