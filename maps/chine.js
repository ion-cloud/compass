import {surroundSectors} from '../tools/surroundSectors';
import {ExistenceMap} from '../ExistenceMap';
import {clipOrphaned} from '../tools/clipOrphaned';
import {fillRect} from '../tools/fillRect';

function getChineLocation({map}={}){
  const size = Math.min(map.width,map.height);

  return Math.floor(size/4+Math.random()*(size/2));
} //end getChineLocation()

// eslint-disable-next-line complexity
export function chine({map}){
  const xy = Math.random()<0.5,
        xQuarter = map.width/4, xHalf = xQuarter*2, x3Quarters = xQuarter*3,
        yQuarter = map.height/4, yHalf = yQuarter*2, y3Quarters = yQuarter*3,
        chineLocation = getChineLocation({map}),
        s = 8; //waterfall size

  let r, //used to hold random variable
      x = xy?0:Math.floor(xQuarter+Math.random()*xHalf),
      y = !xy?0:Math.floor(yQuarter+Math.random()*yHalf),
      d = !x?'east':'south',
      drawnWaterfall = false,
      curLocation = 0;

  const p = d;

  map.setWater({x,y});
  do{
    r = Math.random();

    // determine if we'll move or not
    if(d==='east'&&r<(0.3+(y>y3Quarters?0.3:0))){
      d='northeast';
    }else if(d==='east'&&r<(0.66+(y<yQuarter?0.3:0))){
      d='southeast';
    }else if(d==='northeast'&&r<(0.75+(y<yQuarter?-0.35:0))&&p==='east'){
      d='east';
    }else if(d==='southeast'&&r<(0.75+(y>y3Quarters?-0.35:0))&&p==='east'){
      d='east';
    }else if(d==='south'&&r<(0.33+(x>x3Quarters?0.3:0))){
      d='southwest'
    }else if(d==='south'&&r<(0.66+(x<xQuarter?0.3:0))){
      d='southeast'
    }else if(d==='southeast'&&r<(0.75+(x>x3Quarters?-0.35:0))&&p==='south'){
      d='south';
    }else if(d==='southwest'&&r<(0.75+(x<xQuarter?-0.35:0))&&p==='south'){
      d='south';
    } //end if

    // now apply the movement, if it's diagonal we'll move vertically
    // then horizontally
    /* eslint-disable no-unused-expressions */
    if(d==='northeast'){
      y--; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
      x++; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
    }else if(d==='east'){
      x++; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
    }else if(d==='southeast'){
      y++; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
      x++; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
    }else if(d==='south'){
      y++; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
    }else if(d==='southwest'){
      y++; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
      x--; !map.isWaterSpecial({x,y})&&map.setWater({x,y});
    }else{
      console.log('err',d);
    } //end if
    /* eslint-enable no-unused-expressions */

    // now if we're in the center of the map and the waterfall hasn't been
    // drawn then we can do that now
    if(!drawnWaterfall&&curLocation===chineLocation){
      const r = Math.floor(s/2), //radius
            sx = x-r, //start x
            ex = x+r, //end x
            sy = y-r, //start y
            ey = y+r, //end y
            cx = sx+(ex-sx)/2, //center x float
            cy = sy+(ey-sy)/2, //center y float
            sa1 = (ex-sx)/2, //semi-axis 1
            sa2 = (ey-sy)/2; //semi-axis 2

      let hypotenuse, theta, foci, p1, p2;

      for(let j=sy;j<ey;j++){
        for(let i=sx;i<ex;i++){
          hypotenuse = Math.sqrt(Math.pow(i-cx,2)+Math.pow(j-cy,2));
          theta = Math.asin(Math.abs(j-cy)/hypotenuse);
          p1 = Math.pow(sa1,2)*Math.pow(Math.sin(theta),2);
          p2 = Math.pow(sa2,2)*Math.pow(Math.cos(theta),2);
          foci = (sa1*sa2)/Math.sqrt(p1+p2);
          if(hypotenuse<foci/4*3) map.setWaterSpecial({x: i,y: j});
          if(hypotenuse<foci&&hypotenuse>foci/4*3&&Math.random()<0.4) map.setWater({x: i,y: j});
          if(hypotenuse>foci/2&&hypotenuse<foci/4*3&&Math.random()<0.8) map.setWater({x: i,y: j});
          if(hypotenuse<foci&&Math.random()<0.4) map.setWater({x: i,y: j});
          if(i===x&&j===y) map.setWaterSpecial({x:i,y:j});
        } //end for
      } //end for
      drawnWaterfall=true;
    } //end if
    curLocation++;
  }while(x!==map.width-1&&y!==map.height-1);
  // now close everything not close enough to river
  const river = new ExistenceMap();

  fillRect({
    map,
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    onDraw(sector){
      const {x,y} = sector;

      if(sector.isWater()||sector.isWaterSpecial()){
        river.set(sector);
        return; //short-circuit
      } //end if
      if(Math.random()<0.1){
        sector.setWallSpecial();
      }else if(Math.random()<0.4){
        sector.setWall();
      } //end if
    }
  });

  surroundSectors({
    map,sectors:river,size:2,
    onDraw(sector){
      if(sector.isWater()||sector.isWaterSpecial()) return;
      if(Math.random()<0.9) sector.setFloor();
    }
  });

  // now that we've represented the map fully, lets find the largest walkable
  // space and fill in all the rest
  clipOrphaned({
    map,
    onTest: sector=> sector.isEmpty()||sector.isWalkable(),
    onFailure: sector=> sector.setWallSpecial(),
    onSuccess: sector=>{
      if(sector.isEmpty()) sector.setFloor();
    }
  });

  // lastly lets find all floor that's near water and give it a large chance
  // to be a corridor (sand)
  map.sectors.getAll().forEach(sector=>{
    if(sector.isWater()) return; //leave water alone
    const x = sector.x,y = sector.y;

    if(map.isInbounds({x: x-1,y})&&map.isWater({x: x-1,y})||
       map.isInbounds({x: x+1,y})&&map.isWater({x: x+1,y})||
       map.isInbounds({x,y: y-1})&&map.isWater({x,y: y-1})||
       map.isInbounds({x,y: y+1})&&map.isWater({x,y: y+1})){
      if(Math.random()<0.5) sector.setFloorSpecial();
    } //end if
  });
} //end function
