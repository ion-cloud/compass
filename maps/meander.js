import {Noise} from '../Noise';
import {ExistenceMap} from '../ExistenceMap';
import {meander as river} from '../facets/';
import {surroundSectors} from '../facets/';
import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';

export function meander({map,x1=null,y1=null,x2=null,y2=null}={}){
  let water;

  // meanders have a greater chance of failing hte higher the strength of
  // the windiness. if we fail to find a good meander, allow it to fail
  // gracefully
  try{
    river({map,strength:9});
  }catch(err){
  }

  // now we'll make the rest of the map look good
  const noise1 = new Noise(),
        noise2 = new Noise();

  fillRect({
    map, x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise1.simplex2(sector.x/map.width*8,sector.y/map.height*8))/2,
            n2 = (1+noise2.simplex2(sector.x/map.width*4,sector.y/map.height*4))/2;

      if(n<0.2&&sector.isFloorSpecial()){
        sector.setWall();
      }else if(n<0.2&&!sector.isWater()){
        sector.setWallSpecial();
      }else if(n<0.5&&!sector.isWater()){
        sector.setWall();
      }else if(n>0.8&&n2<0.2){
        sector.setWaterSpecial();
      }else if(n>0.7&&n2<0.3){
        sector.setWater();
      }else if(sector.isEmpty()&&Math.random()<0.2){
        sector.setFloorSpecial();
      }else if(sector.isEmpty()){
        sector.setFloor();
      } //end if
    }
  });

  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
