import {ExistenceMap} from '../ExistenceMap';
import {iterateNeighbors} from '../tools/iterateNeighbors';
import {iterateRect} from '../tools/iterateRect';
import {clipOrphaned} from '../tools/clipOrphaned';

// the higher the strength the higher the chance of failure
export function amorphousBlob({map,x1=null,y1=null,x2=null,y2=null, onDraw=()=>{}}={}){
  const baseNoise = new ExistenceMap();

  iterateRect({
    x1, y1, x2, y2,
    onEach({x,y}){
      if(Math.random()<0.5) baseNoise.set({x,y});
    }
  });
  const qx = (x2-x1)/4,
        tx = (x2-x1)/3,
        fx = (x2-x1)/5,
        qy = (y2-y1)/4,
        ty = (y2-y1)/2,
        fy = (y2-y1)/5,
        qsx = qx+x1, //quarter start
        tsx = tx+x1, //third start
        fsx = fx+x1, //fifth start
        qsy = qy+y1,
        tsy = ty+y1,
        fsy = fy+y1,
        qex = x2-qx, //quarter end
        tex = x2-tx, //third end
        fex = x2-fx, //fifth end
        qey = y2-qy,
        tey = y2-ty,
        fey = y2-fy;

  for(let i=0;i<4;i++){
    const nextWalls = new ExistenceMap(),
          nextFloors = new ExistenceMap();

    iterateRect({
      x1, y1, x2, y2,
      onEach(sector){
        if(sector.x===x1||sector.x===x2||sector.y===y1||sector.y===y2){
          nextWalls.set(sector);
        }else if(sector.x>fsx&&sector.y>fsy&&sector.x<fex&&sector.y<fey&&Math.random()<0.1){
          nextFloors.set(sector);
        }else if(sector.x>qsx&&sector.y>qsy&&sector.x<qex&&sector.y<qey&&Math.random()<0.3){
          nextFloors.set(sector);
        }else if(sector.x>tsx&&sector.y>tsy&&sector.x<tex&&sector.y<tey&&Math.random()<0.7){
          nextFloors.set(sector);
        }else if(iterateNeighbors({sector,self:true,onTest:s=> baseNoise.get(s)}).length>4){
          nextWalls.set(sector);
        }else{
          nextFloors.set(sector);
        } //end if
      }
    });
    nextFloors.getAll().forEach(({x,y})=> baseNoise.unset({x,y}));
    nextWalls.getAll().forEach(({x,y})=> baseNoise.set({x,y}));
  } //end for
  clipOrphaned({
    map, x1, y1, x2, y2,
    onTest({x,y}){
      return !baseNoise.get({x,y});
    },
    onSuccess(sector){
      onDraw(sector);
    }
  })
} //end meander()
