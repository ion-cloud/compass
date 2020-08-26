import {Noise} from '../Noise';
import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {getNeighbors} from '../tools/getNeighbors';
import {drunkenPath} from '../tools/drunkenPath';
import {shuffle} from '../utilities/shuffle';

export function exhumedRiverChannel({map}){
  const noise = new Noise(),
        terminalPositions = shuffle([
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

  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise.simplex2(sector.x/map.width*10,sector.y/map.height*10))/2;

      if(n<0.6){
        sector.setFloor();
      }else{
        sector.setWall();
      } //end if
    }
  });
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isEmpty(),
    onFailure: sector=> sector.setWallSpecial()
  });

  let x,y;

  // get the start position, set water and save it
  ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
  map.setWater({x,y});
  const x1 = x, y1 = y;

  // get the end position, set water
  ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
  map.setWater({x,y});
  let x2 = x, y2 = y;

  // now we'll draw the path between the points
  drunkenPath({
    map,
    x1,y1,x2,y2,wide:true,
    onDraw(sector){
      sector.setWater();

      // small chance to venture slightly further
      if(Math.random()<0.5){
        getNeighbors({
          map,
          x: sector.x, y: sector.y, size: 3,
          onTest(sector){
            return sector.isWalkable()&&
              !sector.isWater()&&!sector.isFloorSpecial();
          }
        }).forEach(sector=> Math.random()<0.5?sector.setFloorSpecial():null);
      } //end if
    }
  });

  // 50% chance to have a forked river
  if(Math.random()<0.5){
    ({x,y}=getValidTerminalPoint(map,terminalPositions.pop()));
    map.setWater({x,y});
    x2 = x; y2 = y;

    // now we'll draw the fork of the path
    drunkenPath({
      map,
      x1,y1,x2,y2,wide:true,
      onDraw(sector){
        sector.setWater();

        // small chance to venture slightly further
        if(Math.random()<0.5){
          getNeighbors({
            map,
            x: sector.x, y: sector.y, size: 3,
            onTest(sector){
              return sector.isWalkable()&&
                !sector.isWater()&&!sector.isFloorSpecial();
            }
          }).forEach(sector=> Math.random()<0.5?sector.setFloorSpecial():null);
        } //end if
      }
    });
  } //end if

  // now close everything not close enough to the exhumed channel
  const river = [];

  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      if(sector.isWater()){
        river.push(sector);
        return; //short-circuit
      } //end if
      if(Math.random()<0.1){
        sector.setWallSpecial();
      }else if(Math.random()<0.4){
        sector.setWall();
      } //end if
    }
  });

  const finished = {};

  river.forEach(({x,y})=>{
    fillRect({
      map,
      x1: x-6, y1: y-6, x2: x+6, y2: y+6,
      onTest({x,y}){
        return finished[`x${x}y${y}`]===undefined;
      },
      onDraw(sector){
        const randomNumber = Math.random(),
              {x,y} = sector;

        finished[`x${x}y${y}`] = true;
        if(sector.isWater()){
          sector.setFloorSpecial();
        }else if(randomNumber<0.1){
          sector.setWallSpecial();
        }else if(randomNumber<0.2){
          sector.setWall();
        }else{
          sector.setFloor();
        } //end if
      }
    });
  });

  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isEmpty(),
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
