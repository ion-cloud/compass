import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {drunkenPath} from '../tools/drunkenPath';
import {Noise} from '../Noise';
import {getNeighbors} from '../tools/getNeighbors';
import {getTerminalPoints} from '../tools/getTerminalPoints';

export function wadi({map}){
  const d = Math.random()<0.5,
        h = d?2:10,
        v = d?10:2,
        noise = new Noise();

  fillRect({
    map, x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const n = (1+noise.simplex2(sector.x/map.width*h,sector.y/map.height*v))/2;

      if(n<0.5&&Math.random()<0.5){
        sector.setWall()
      }else if(n<0.5){
        sector.setFloorSpecial();
      }else if(n>0.6&&Math.random()<0.5){
        sector.setWall();
      }else{
        sector.setFloorSpecial();
      } //end if
    }
  });

  // now remove unwalkable
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial()
  });

  // get the centroid of the open area and use it for center of river
  const walkable = map.sectors.getAll().filter(sector=> sector.isWalkable()),
        centroid = walkable.reduce((p,n)=>{
          return {x: p.x+n.x,y: p.y+n.y};
        },{x: 0, y: 0}),
        x2 = Math.floor(centroid.x/walkable.length),
        y2 = Math.floor(centroid.y/walkable.length);

  (function drawRiverStart(){
    const {x1,y1}= getTerminalPoints({
      map, x1: 0, y1: 0, x2, y2
    });

    drunkenPath({
      map,x1,y1,x2,y2,wide: true,
      onDraw(sector){
        sector.setWater();
        getNeighbors({
          map, x: sector.x,y: sector.y,size: 2,
          onTest(sector){
            return sector.isWalkable()&&!sector.isWater();
          }
        }).forEach(sector=> sector.setFloor());
      },
      onFailure({x1,y1,x2,y2}){
        drawRiverStart(); //reattempt until we get a success
      }
    });
  })();
  (function drawRiverEnd(){
    const {x1,y1}= getTerminalPoints({
      map, x1: map.width-1, y1: map.height-1, x2, y2
    });

    drunkenPath({
      map, x1, y1, x2, y2, wide: true,
      onDraw(sector){
        sector.setWater();
        getNeighbors({
          map, x: sector.x, y: sector.y,size: 2,
          onTest(sector){
            return sector.isWalkable()&&!sector.isWater();
          }
        }).forEach(sector=> sector.setFloor());
      },
      onFailure({x1,y1,x2,y2}){
        drawRiverEnd(); //reattempt until we get a success
      }
    });
  })();
} //end wadi()
