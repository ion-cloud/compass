import {drunkenPath} from '../tools/drunkenPath';
import {getTerminalPoints} from '../tools/getTerminalPoints';
import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';

export function glen({map}){

  (function drawRiver(){
    // draw a bunch of rivers going every which way
    const {x1,y1,x2,y2}= getTerminalPoints({
      x1: 0, y1: 0, x2: map.width-1, y2: map.height-1
    });

    // now draw that river
    drunkenPath({
      map,
      x1,y1,x2,y2,wide: true,
      onDraw(sector){
        sector.setWater();
      },
      onFailure(){
        drawRiver(); //reattempt until we have a success
      }
    });
  })();

  // now close everything not close enough to river
  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      if(!sector.isWater()&&Math.random()<0.4){
        sector.setWall();
      }else if(!sector.isWater()&&Math.random()<0.1){
        sector.setWallSpecial();
      } //end if
    }
  });

  // now that we've represented the map fully, lets find the largest walkable
  // space and fill in all the rest
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isEmpty(),
    onFailure: sector=> sector.setWallSpecial(),
    onSuccess: sector=>{
      if(!sector.isWalkable()) sector.setFloor();
    }
  });

  // lets find all floor that's near water and give it a large chance
  // to be sand
  map.sectors.getAll().forEach(sector=>{
    if(sector.isWater()) return; //leave water alone
    const x = sector.x,y = sector.y;

    if(
      map.isInbounds({x: x-1,y})&&map.isWater({x: x-1,y})||
      map.isInbounds({x: x+1,y})&&map.isWater({x: x+1,y})||
      map.isInbounds({x,y: y-1})&&map.isWater({x,y: y-1})||
      map.isInbounds({x,y: y+1})&&map.isWater({x,y: y+1})
    ){
      if(Math.random()<0.5) sector.setFloorSpecial();
    } //end if
  });
} //end function
