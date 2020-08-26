import {clipOrphaned} from '../tools/clipOrphaned';
import {shuffle} from '../utilities/shuffle';
import {fillRect} from '../tools/fillRect';

export function bornhardt({map}){
  const numberOfBornhardts = Math.floor(2+Math.random()*4),
        sizeOfBornhardts = map.width*map.height/50; //2%

  // first create all the bornhardts
  for(let i=0,x,y,sparks,cSize;i<numberOfBornhardts;i++){
    x = Math.floor(map.width/4+Math.random()*map.width/2);
    y = Math.floor(map.height/4+Math.random()*map.height/2);
    cSize = 0;
    sparks = [];
    do{
      cSize++;
      map.setWallSpecial({x,y});
      if(map.isInbounds({x: x-1,y})&&map.isEmpty({x: x-1,y})){
        sparks.push({x: x-1,y});
      } //end if
      if(map.isInbounds({x: x+1,y})&&map.isEmpty({x: x+1,y})){
        sparks.push({x: x+1,y});
      } //end if
      if(map.isInbounds({x, y: y-1})&&map.isEmpty({x,y: y-1})){
        sparks.push({x,y: y-1});
      } //end if
      if(map.isInbounds({x, y: y+1})&&map.isEmpty({x,y: y+1})){
        sparks.push({x,y: y+1});
      } //end if
      if(sparks.length) ({x,y}=shuffle(sparks).pop());
    }while(cSize<sizeOfBornhardts&&sparks.length)
  } //end for

  // now we'll create a map boundary that's fuzzy to contain
  // the player
  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const {x,y} = sector;

      if(sector.isWallSpecial()) return; //don't override
      const yd = Math.abs(y-map.height/2)/(map.height/2),
            xd = Math.abs(x-map.width/2)/(map.width/2),
            d = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2)),
            r1 = Math.random(),
            r2 = Math.random();

      // d turns it into a circle
      if(r1<d-0.5||r2<0.05) sector.setWall();
    }
  });

  // now that we've represented the map fully, lets
  // find the largest walkable space and fill in all the
  // rest
  clipOrphaned({
    map,
    onTest: sector=> sector.isEmpty(),
    onFailure: sector=> sector.setWallSpecial(),
    onSuccess: sector=>{
      if(Math.random()<0.1){
        sector.setFloorSpecial();
      }else{
        sector.setFloor();
      } //end if
    }
  });
} //end function
