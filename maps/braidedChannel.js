import {takeRandom} from '../utilities/takeRandom';
import {surroundSectors} from '../tools/surroundSectors';
import {drunkenPath} from '../tools/drunkenPath';
import {fillRect} from '../tools/fillRect';
import {getNeighbors} from '../tools/getNeighbors';
import {Noise} from '../Noise';
import {clipOrphaned} from '../tools/clipOrphaned';
import {ExistenceMap} from '../ExistenceMap';
import {meander} from '../facets/meander';
import {getTerminalPoints} from '../tools/getTerminalPoints';

export function braidedChannel({map}){
  const river = new ExistenceMap(),
        directions = {
          horizontal: false,
          vertical: false,
          forward: false,
          backward: false,
        },
        noise = new Noise(),
        noise2 = new Noise();

  directions[takeRandom(Object.keys(directions))]=true;
  directions.forwardSlant = Math.random()<0.5;
  directions.backwardSlant = directions.forwardSlant;
  for(let rivers=0;rivers<Math.floor(2+Math.random()*2);rivers++){
    const {x1,x2,y1,y2} =getTerminalPoints({
      x1:0,y1:0,x2:map.width-1,y2:map.height-2,...directions
    });

    drunkenPath({
      map,
      x1,y1,x2,y2,wide: true,
      onDraw(sector){
        sector.setWater();
        river.set(sector);
      },
      onFailure({x1,y1,x2,y2}){
        try{
          const {water} = meander({map,x1,y1,x2,y2});

          river.setMany(water);
        }catch(err){
        }
      }
    });
  } //end for

  // draw the full rivers
  const fullRiver = new ExistenceMap();

  surroundSectors({
    map,sectors:river,
    onTest({x,y,originX,originY}){
      return x===originX&&y===originY||Math.random()<0.5;
    },
    onDraw(sector){
      sector.setWater();
      fullRiver.set(sector);
    }
  });

  // now surround the rivers with sand
  surroundSectors({
    map,sectors:fullRiver,size:1,
    onTest({x,y,originX,originY}){
      return !fullRiver.get({x,y})&&Math.random()<0.25;
    },
    onDraw(sector){
      sector.setFloorSpecial();
    }
  });

  // now we'll generate some noise and populate all non-river data
  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      if(sector.isWater()) return;
      const n = (1+noise.simplex2(sector.x/map.width,sector.y/map.height))/2,
            n2 = (1+noise.simplex2(sector.x/map.width*20,sector.y/map.height*20))/2;

      if(n<0.1&&sector.isEmpty()){
        sector.setWallSpecial()
      }else if(n<0.2&&sector.isEmpty()&&Math.random()<0.8){
        sector.setWallSpecial();
      }else if(n<0.3&&sector.isEmpty()){
        sector.setWall();
      }else if(n<0.5&&sector.isEmpty()&&Math.random()<0.8){
        sector.setWall();
      }else if(!sector.isWater()&&n<0.2){
        sector.setWallSpecial();
      }else if(!sector.isWater()&&n<0.5){
        sector.setWall();
      }else if(sector.isEmpty()&&n2<0.1){
        sector.setWallSpecial();
      }else if(sector.isEmpty()&&n2<0.3){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWall()
  });
} //end function
