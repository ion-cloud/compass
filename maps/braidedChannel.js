import {takeRandom} from '../utilities/takeRandom';

export function braidedChannel({map}){
  const water = [],
        directions = [
          'horizontal','vertical','forward','backward'
        ];

  let x1,y1,x2,y2,direction=takeRandom(directions);

  for(let rivers=0;rivers<Math.floor(5+Math.random()*5);rivers++){
    if(direction==='horizontal'){
      x1 = 0;
      x2 = map.width-1;
      y1 = Math.floor(Math.random()*map.height/2+map.height/4);
      y2 = Math.floor(Math.random()*map.height/2+map.height/4);
    }else if(direction==='vertical'){
      x1 = Math.floor(Math.random()*map.width/2+map.width/4);
      x2 = Math.floor(Math.random()*map.width/2+map.width/4);
      y1 = 0;
      y2 = map.height-1;
    }else if(direction==='forward'){
      if(Math.random()<0.5){ // most eastward
        x1 = Math.floor(Math.random()*map.width/4);
        x2 = map.width-1;
        y1 = map.height-1;
        y2 = Math.floor(Math.random()*map.height/4);
      }else{
        x1 = 0;
        x2 = Math.floor(Math.random()*map.width/4+map.width/2);
        y1 = Math.floor(Math.random()*map.height/4+map.height/2);
        y2 = 0;
      } //end if
    }else if(direction==='backward'){
      if(Math.random()<0.5){ //most eastward
        x1 = Math.floor(Math.random()*map.width/4);
        x2 = map.width-1;
        y1 = 0;
        y2 = Math.floor(Math.random()*map.height/4+map.height/2);
      }else{
        x1 = 0;
        x2 = Math.floor(Math.random()*map.width/4+map.width/2);
        y1 = Math.floor(Math.random()*map.height/4);
        y2 = map.height-1;
      } //end if
    } //end if
    map.drunkenPath({
      x1,y1,x2,y2,wide: true,
      draw(sector){
        sector.setWater();
        water.push(sector);
      }
    });
  } //end for

  // now we'll surround water with sand
  const finished = {};

  water.forEach(({x,y})=>{
    map.fillRect({
      x1: x-2, y1: y-2, x2: x+2, y2: y+2,
      test({x,y}){
        return finished[`x${x}y${y}`]===undefined;
      },
      draw(sector){
        const {x,y} = sector;

        finished[`x${x}y${y}`] = true;
        if(sector.isWater()) return;
        const nearWater = map.getNeighbors({
          x,y,test:sector=>sector.isWater(),
          orthogonal: false
        }).length;

        if(nearWater) sector.setFloorSpecial();
      }
    });
  });

  // now we'll generate some noise and populate all non-river data
  const x=['horizontal','forward'].includes(direction)?6:12,
        y=['vertical','backward'].includes(direction)?6:12;

  map.fillRect({
    x1: map.startX, y1: map.startY, x2: map.width, y2: map.height,
    draw(sector){
      const n = (1+map.noise.simplex2(sector.x/map.width*x,sector.y/map.height*y))/2;

      if(n<0.2&&sector.isEmpty()){
        sector.setWallSpecial();
      }else if(n<0.5&&sector.isEmpty()){
        sector.setWall();
      }else if(sector.isEmpty()){
        sector.setFloor();
      } //end if
    }
  });

  map.clipOrphaned({
    test: sector=> sector.isWalkable(),
    failure: sector=> sector.setWallSpecial()
  });
} //end function
