import {fillRect} from '../tools/fillRect';
import {clipOrphaned} from '../tools/clipOrphaned';
import {shuffle} from '../utilities/shuffle';

class Spark{
  constructor(map,startNode,endNode,possibleNodes=[]){
    this.map = map; //will need to be able to speakt to map
    this.cx = startNode.x; this.cy = startNode.y;
    this.dx = endNode.x; this.dy = endNode.y;
    this.possible = possibleNodes
    this.process();
  }
  process(){
    let ox,oy, //may have to reset position
        wx,wy; //will need to hold the weight based on d

    this.map.setWater({x: this.cx,y: this.cy});
    do{
      ox = this.cx; oy = this.cy;
      wx = this.cx<this.dx?0.35:-0.35;
      wy = this.cy<this.dy?0.35:-0.35;
      if(Math.random()<0.5){
        this.cx += (Math.random()+wx)<0.5?-1:1;
      }else{
        this.cy += (Math.random()+wy)<0.5?-1:1;
      } //end if

      // allow possibility of river splitting, passing
      // on a possible node
      if(this.possible.length&&Math.random()<0.1){

        //eslint-disable-next-line no-new
        new Spark(this.map,{x: this.cx, y: this.cy},this.possible.pop());
      } //end if

      // if cx and cy isn't within the map we need to reset;
      // otherwise we can draw it
      if(!this.map.isInbounds({x: this.cx,y: this.cy})){
        this.cx = ox; this.cy = oy;
      }else{
        this.map.setWater({x: this.cx,y: this.cy});
      } //end if
    }while(this.cx!==this.dx||this.cy!==this.dy)
    this.map.setWater({x: this.cx,y: this.cy});
  }
}
export function draw({map}){
  const r = Math.random(); //used to detail how many rivers

  // this holds the terminal points for the river(s)
  let t = [
    {
      x: Math.floor(map.width/4+Math.random()*map.width/2),
      y: 0
    },
    {
      x: Math.floor(map.width/4+Math.random()*map.width/2),
      y: map.height-1
    },
    {
      x: 0,
      y: Math.floor(map.height/4+Math.random()*map.height/2)
    },
    {
      x: map.width-1,
      y: Math.floor(map.height/4+Math.random()*map.height/2)
    }
  ];

  // 25% chance to have no split rivers, 25% to have 1, 50% to have 2
  if(r<0.25){
    t = shuffle(t);
    t.length = 2;
  }else if(r<0.85){
    t = shuffle(t);
    t.length = 3;
  }else{
    t = shuffle(t);
  } //end if

  // start the recursive sparks
  // eslint-disable-next-line no-new
  new Spark(map,t.pop(),t.pop(),t);

  // now close everything not close enough to river
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
      x1: x-3, y1: y-3, x2: x+3, y2: y+3,
      onTest({x,y}){
        return finished[`x${x}y${y}`]===undefined;
      },
      onDraw(sector){
        const {x,y} = sector;

        finished[`x${x}y${y}`] = true;
        if(sector.isWater()) return;
        if(Math.random()<0.8) sector.setFloor();
      }
    });
  });

  // now that we've represented the map fully, lets find the largest walkable
  // space and fill in all the rest
  clipOrphaned({
    map,
    onTest: sector=> sector.isWalkable()||sector.isEmpty(),
    onFailure: sector=> sector.setWallSpecial(),
    onSuccess: sector=>{
      if(!sector.isWalkable()) sector.setFloor();
    }
  });

  // lastly lets find all floor that's near water and give it a large chance
  // to be sand
  map.sectors.getAll().forEach(sector=>{
    if(sector.isWater()) return; //leave water alone
    const x = sector.x,y = sector.y;

    if(
      map.isInbounds({x: x-1,y})&&map.isWater({x: x-1,y})||
      map.isInbounds({x: x+1,y})&&map.isWater({x: x+1,y})||
      map.isInbounds({x,y: y-1})&&map.isWater({x,y: y-1})||
      map.isInbounds({x,y: y+1})&&map.isWater({x,y: y+1})
    ){
      if(Math.random()<0.5) sector.setFloorSpecial();
    } //end if
  });
} //end function
