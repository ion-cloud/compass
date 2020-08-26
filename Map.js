import {Noise} from './Noise';
import {SectorMap} from './SectorMap';

export class Map{
  constructor({
    width=50,height=50,startX=0,startY=0,
    sectors=new SectorMap({map:this})
  }={}){
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
    this.sectors = sectors;
    this.rooms = [];
  }
  clone(){
    return new Map({
      width: this.width,
      height: this.height,
      sectors: this.sectors.clone(),
      initialize: false
    });
  }
  reset(){
    this.sectors.reset();
    this.rooms.length = 0;
  }

  // translate allows a {x,y} point to be translated to a touching sector
  // before an operation. All functions that operate on a point are supported
  // Before:
  //   map.isFloor({x: sector.x+1, y: sector.y})
  // After:
  //   map.isFloor(sector,'east');
  static translate({x=0,y=0,direction}={}){
    if(direction==='north'){
      return {x,y:y-1};
    }else if(direction==='northeast'){
      return {x:x+1,y:y-1};
    }else if(direction==='east'){
      return {x:x+1,y};
    }else if(direction==='southeast'){
      return {x:x+1,y:y+1};
    }else if(direction==='south'){
      return {x,y:y+1};
    }else if(direction==='southwest'){
      return {x:x-1,y:y+1};
    }else if(direction==='west'){
      return {x:x-1,y};
    }else if(direction==='northwest'){
      return {x:x-1,y:y-1};
    } //end if
    return {x,y};
  }
  getSector({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.sectors.get({x,y});
  }

  // test to make sure the points are within bounds of the map
  // and optionally (and additionally) between a min/max x/y
  isInbounds({
    x=0,y=0,x1=0,y1=0,x2=this.width-1,y2=this.height-1
  }={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return x>=x1&&x<=x2&&y>=y1&&y<=y2&&
      x>=0&&y>=0&&x<=this.width-1&&y<=this.height-1;
  }
  getColors({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).getColors();
  }
  isEmpty({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isEmpty();
  }
  setEmpty({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setEmpty();
  }
  isVoid({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isVoid();
  }
  setVoid({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setVoid();
  }
  isFloor({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isFloor();
  }
  setFloor({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setFloor();
  }
  isFloorSpecial({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isFloorSpecial();
  }
  setFloorSpecial({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setFloorSpecial();
  }
  isWall({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isWall();
  }
  setWall({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setWall();
  }
  isWallSpecial({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isWallSpecial();
  }
  setWallSpecial({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setWallSpecial();
  }
  isWater({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isWater();
  }
  setWater({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setWater();
  }
  isWaterSpecial({x=0,y=0},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isWaterSpecial();
  }
  setWaterSpecial({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setWaterSpecial();
  }
  isWindow({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isWindow();
  }
  setWindow({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).setWindow();
  }
  isDoor({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isDoor();
  }
  isDoorClosed({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isDoorClosed();
  }
  isDoorOpen({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isDoorOpen();
  }
  setDoor({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setDoor();
  }
  setDoorOpen({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setDoorOpen();
  }
  setDoorClosed({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setDoorClosed();
  }
  isRemoved({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isRemoved();
  }
  setRemoved({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setRemoved();
  }

  // isWalkable may change based on door states and other factors, isObstruction
  // will never change and includes windows, walls etc.
  isObstruction({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isObstruction();
  }

  // may change based on door state
  isWalkable({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isWalkable();
  }
  isRoom({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).id>0;
  }
  setRoom({x=0,y=0,id=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).roomNumber = id;
  }
  getRoom({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).roomNumber;
  }
  isSameRoom({x1=0,y1=0,x2=0,y2=0}={}){
    return this.getSector({x: x1,y: y1}).roomNumber===
      this.getSector({x: x2,y: y2}).roomNumber;
  }
  unsetVisible({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).unsetVisible();
  }
  setVisible({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setVisible();
  }
  isSeen({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isSeen();
  }
  isVisible({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isVisible();
  }
  isOccupied({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).isOccupied();
  }
  setOccupied({x=0,y=0,actor=null}={},direction){
    if(this.direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).setOccupied(actor);
  }
  clearOccupied({x=0,y=0}={},direction){
    if(this.direction) ({x,y} = this.constructor.translate({x,y,direction}));
    this.getSector({x,y}).clearOccupied();
  }
  getOccupied({x=0,y=0}={},direction){
    if(this.direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.getSector({x,y}).getOccupied();
  }
}
