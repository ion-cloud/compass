import {shuffle} from '../utilities/shuffle';
import {clipOrphaned} from '../tools/clipOrphaned';
import {fillRect} from '../tools/fillRect';
import {getNeighbors} from '../tools/getNeighbors';
import {isRect} from '../tools/isRect';
import {lake} from '../facets/lake';
import {ExistenceMap} from '../ExistenceMap';

export function caldera({map}){
  const width = (map.width-map.startX)/2,
        height = (map.height-map.startY)/2,
        filled = Math.random()<0.5,
        x = Math.floor(Math.random()*(map.width-width)),
        y = Math.floor(Math.random()*(map.height-height));

  // now we'll create a map boundary that's fuzzy to contain
  // the player
  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const {x,y} = sector;

      if(!sector.isEmpty()) return; //don't override
      const yd = Math.abs(y-map.height/2)/(map.height/2),
            xd = Math.abs(x-map.width/2)/(map.width/2),
            d = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2)),
            r1 = Math.random(),
            r2 = Math.random();

      // d turns it into a circle
      if(r1<d-0.5||r2<0.05){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  lake({
    map, x1: x, y1: y, x2: x+width, y2: y+height,
    wall:false, sand: true,
    onTestSand:s=> s.isFloor()&&Math.random()<0.5,
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
} //end function
