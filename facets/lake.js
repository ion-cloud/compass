import {amorphousBlob} from '../tools/amorphousBlob';
import {surroundSectors} from '../tools/surroundSectors';
import {isRect} from '../tools/isRect';
import {ExistenceMap} from '../ExistenceMap';

export function lake({
  map,x1=null,y1=null,x2=null,y2=null,
  wall=true,sand=true,deepWater=true,
  sandSize=1,deepWaterDistance=2,deepWaterBuffer=0.7,
  onTestWater=()=>true,
  onDrawWater=sector=> sector.setWater(),
  onDrawWaterSpecial=sector=> sector.setWaterSpecial(),
  onTestSand=()=>true,
  onDrawSand=sector=> sector.setFloorSpecial(),
  onTestWall=()=>true,
  onDrawWall=sector=> sector.setWall()
}={}){
  const lake = new ExistenceMap(),
        padding = wall&&sand?2:wall||sand?1:0,
        water = new ExistenceMap();

  amorphousBlob({
    map, x1: x1+padding, x2: x2-padding, y1: y1+padding, y2: y2-padding,
    onDraw(sector){
      if(onTestWater(sector)){
        onDrawWater(sector);
        water.set(sector);
        lake.set(sector);
      } //end if
    }
  });

  if(deepWater){
    water.getAll().forEach(({x,y})=>{
      if(
        isRect({
          map,x1:x-deepWaterDistance,
          y1:y-deepWaterDistance,
          x2:x+deepWaterDistance,
          y2:y+deepWaterDistance,
          hasAll:s=>water.get(s)||Math.random()<deepWaterBuffer
        })
      ){
        onDrawWaterSpecial(map.getSector({x,y}))
      } //end if
    });
  } //end if
  if(sand){
    surroundSectors({
      map,sectors:lake,size:sandSize,
      onTest({x,y}){
        return !lake.get({x,y})&&onTestSand(map.getSector({x,y}));
      },
      onDraw(sector){
        onDrawSand(sector);
        lake.set(sector);
      }
    });
  } //end if
  if(wall){
    surroundSectors({
      map,sectors:lake,
      onTest({x,y}){
        return !lake.get({x,y})&&onTestWall(map.getSector({x,y}));
      },
      onDraw(sector){
        onDrawWall(sector);
        lake.set(sector);
      }
    });
  } //end if
} //end lake()
