import {ExistenceMap} from '../ExistenceMap';
import {surroundSectors} from '../tools/surroundSectors';
import {clipOrphaned} from '../tools/clipOrphaned';
import {fillRect} from '../tools/fillRect';
import {Noise} from '../Noise';
import {shuffle} from '../utilities/shuffle';
import {drunkenPath} from '../tools/drunkenPath';
import {bresenhamsLine} from '../tools/bresenhamsLine';
import {getNeighbors} from '../tools/getNeighbors';

export function arroyo({map}){
  const d = Math.random()<0.5,
        h = d?2:10,
        v = d?10:2,
        noise = new Noise();

  fillRect({
    map,x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise.simplex2(sector.x/map.width*h,sector.y/map.height*v))/2;

      if(n<0.4&&Math.random()<0.7){
        sector.setWall()
      }else if(n<0.4){
        sector.setFloor();
      }else if(n>0.5&&Math.random()<0.7){
        sector.setWall();
      }else{
        sector.setFloor();
      } //end if
    }
  });

  const terminalPositions = shuffle([
    {
      xmin: 0,
      xmax: 0,
      ymin: Math.floor(map.height/4),
      ymax: Math.floor(map.height/4*3)
    },
    {
      xmin: map.width-1,
      xmax: map.width-1,
      ymin: Math.floor(map.height/4),
      ymax: Math.floor(map.height/4*3)
    },
    {
      xmin: Math.floor(map.width/4),
      xmax: Math.floor(map.width/4*3),
      ymin: 0,
      ymax: 0
    },
    {
      xmin: Math.floor(map.width/4),
      xmax: Math.floor(map.width/4*3),
      ymin: map.height-1,
      ymax: map.height-1
    }
  ]);

  let x,y;

  // get the start position, set water and save it
  ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
  map.setWater({x,y});
  const x1 = x, y1 = y;

  // get the end position, set water
  ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
  map.setWater({x,y});
  const x2 = x, y2 = y, river = new ExistenceMap();

  // now we'll draw the path between the points
  drunkenPath({
    map,x1,y1,
    x2:Math.floor(map.width/2),
    y2:Math.floor(map.height/2),
    wide:true,
    onDraw(sector){
      sector.setFloorSpecial();
      river.set(sector);

      // small chance to venture slightly further
      if(Math.random()<0.5){
        getNeighbors({
          map,x: sector.x, y: sector.y, size: 2,
          onTest(sector){
            return sector.isWalkable()&&
              !sector.isWater()&&!sector.isFloorSpecial();
          }
        }).forEach(sector=>{
          if(Math.random()<0.5){
            sector.setFloorSpecial();
            river.set(sector);
          } //end if
        });
      } //end if
    },

    // sometimes the map doesn't actually have a conducive path between the
    // points. in this case, lets force a path. this isn't preferred as it
    // doesn't look as organic, but it's better then failing
    onFailureReattempt({x1,y1,x2,y2}){
      let path = [];

      bresenhamsLine({
        map,x1,y1,x2,y2,
        onEach({x,y}){
          path.push({x,y});
        }
      });
      return path;
    }
  });
  drunkenPath({
    map,
    x1:Math.floor(map.width/2),
    y1:Math.floor(map.height/2),
    x2,y2,
    wide:true,
    onDraw(sector){
      sector.setFloorSpecial();
      river.set(sector);

      // small chance to venture slightly further
      if(Math.random()<0.5){
        getNeighbors({
          map,
          x: sector.x, y: sector.y, size: 2,
          onTest(sector){
            return sector.isWalkable()&&
              !sector.isWater()&&!sector.isFloorSpecial();
          }
        }).forEach(sector=>{
          if(Math.random()<0.5){
            sector.setFloorSpecial();
            river.set(sector);
          } //end if
        })
      } //end if
    },

    // sometimes the map doesn't actually have a conducive path between the
    // points. in this case, lets force a path. this isn't preferred as it
    // doesn't look as organic, but it's better then failing
    onFailureReattempt({x1,y1,x2,y2}){
      let path = [];

      bresenhamsLine({
        map,x1,y1,x2,y2,
        onEach({x,y}){
          path.push({x,y});
        }
      });
      return path;
    }
  });

  surroundSectors({
    map,sectors:river,size:3,
    onDraw(sector){
      if(sector.isFloorSpecial()) return;
      if(Math.random()<0.97) sector.setFloor();
    }
  });

  // convert gulch to arroyo
  map.sectors.getAll().forEach(sector=>{
    if(sector.isFloorSpecial()){
      sector.setFloor();
    }else if(sector.isFloor()){
      sector.setFloorSpecial();
    }else if(sector.isWall()&&Math.random()<0.3){
      sector.setFloor();
    } //end if
  });

  // now remove unwalkable
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function

function getValidTerminalPoint(map,{xmin,xmax,ymin,ymax}){
  let x, y;

  do{
    x = Math.floor(xmin+Math.random()*(xmax-xmin));
    y = Math.floor(ymin+Math.random()*(ymax-ymin));
  }while(!map.isWalkable({x,y}))
  return {x,y};
} //end getValidTerminalPoint()
