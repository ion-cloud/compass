import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {shuffle} from '../utilities/shuffle';
import {WeightMap} from '../WeightMap';
import {Noise} from '../Noise';

export function mogote({map}){
  const sizeOfMogotes = map.width*map.height/4, //12.5%
        sparks = [],
        noise = new Noise(),
        weights = new WeightMap();

  let cSize = 0,
      x = Math.floor(Math.random()*map.width/4+map.width/8*3),
      y = Math.floor(Math.random()*map.height/4+map.height/8*3);

  do{
    cSize++;
    weights.set({x,y,value:1-cSize/sizeOfMogotes});
    if(!weights.has({x: x-1,y})) sparks.push({x: x-1,y});
    if(!weights.has({x: x+1,y})) sparks.push({x: x+1,y});
    if(!weights.has({x,y: y-1})) sparks.push({x,y: y-1});
    if(!weights.has({x,y: y+1})) sparks.push({x,y: y+1});
    if(sparks.length) ({x,y}=shuffle(sparks).pop());
  }while(cSize<sizeOfMogotes&&sparks.length)

  // now we'll create a map boundary that's fuzzy to contain
  // the player
  fillRect({
    map, x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      if(sector.isWallSpecial()) return; //don't override

      let n = (1+noise.simplex2(sector.x/map.width*3,sector.y/map.height*3))/2,
          n2 = n+weights.get(sector),
          np = (1+noise.simplex2(sector.x/map.width*20,sector.y/map.height*20))/2;

      if(n<0.2&&np>=0.2){
        sector.setWaterSpecial();
      }else if(n<0.2){
        sector.setWater();
      }else if(n<0.3&&np>=0.2){
        sector.setWater();
      }else if(n<0.3){
        sector.setFloorSpecial();
      }else if(n2<0.4&&np>=0.2){
        sector.setFloorSpecial();
      }else if(n2<0.4){
        sector.setFloor();
      }else if(np<0.2){
        sector.setWall();
      }else if(n2<1){
        sector.setFloor();
      }else if(n2<1.2){
        sector.setWall();
      }else{
        sector.setWallSpecial();
      } //end if
    }
  });

  // finally we'll clean up unwalkable sections
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial()
  });
} //end function
