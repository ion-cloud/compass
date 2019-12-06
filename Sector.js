export class Sector{
  constructor({map,x=0,y=0,actor=null,category='empty'}={}){
    this.map = map;
    this.actor = null;
    this.x = x;
    this.y = y;
    this.category = category;
  }
  clone(){
    return new Sector({
      map: this.map,
      x: this.x,
      y: this.y,
      actor: this.actor,
      category: this.category
    });
  }
  isEmpty(){
    return this.category === 'empty';
  }
  setEmpty(){
    this.category = 'empty';
  }
  isVoid(){
    return this.category === 'void';
  }
  setVoid(){
    this.category = 'void';
  }
  isRemoved(){
    return this.category === 'removed';
  }
  setRemoved(){
    this.category = 'removed';
  }
  setWindow(){
    this.category = 'window';
  }
  isWindow(){
    return this.category === 'window';
  }
  isDoor(){
    return this.category.includes('door');
  }
  isDoorClosed(){
    return this.category==='door-closed';
  }
  isDoorOpen(){
    return this.category === 'door-open';
  }
  setDoor(){
    if(Math.random()<0.5){
      this.category = 'door-open';
    }else{
      this.category = 'door-closed';
    } //end if
  }
  setDoorOpen(){
    this.category = 'door-open';
  }
  setDoorClosed(){
    this.category = 'door-closed';
  }
  isFloor(){
    return this.category === 'floor' || this.category === 'floorSpecial';
  }
  setFloor(){
    this.category = 'floor';
  }
  isFloorSpecial(){
    return this.category === 'floorSpecial';
  }
  setFloorSpecial(){
    this.category = 'floorSpecial';
  }
  isWater(){
    return this.category === 'water' || this.category === 'waterSpecial';
  }
  setWater(){
    this.category = 'water';
  }
  isWaterSpecial(){
    return this.category === 'waterSpecial';
  }
  setWaterSpecial(){
    this.category = 'waterSpecial';
  }
  isWall(){
    return this.category === 'wall' || this.category === 'wallSpecial';
  }
  setWall(){
    this.category = 'wall';
  }
  isWallSpecial(){
    return this.category === 'wallSpecial';
  }
  setWallSpecial(){
    this.category = 'wallSpecial';
  }
  isWalkable(){
    let walkable = false;

    if(this.isFloor()) walkable = true;
    if(this.isFloorSpecial()) walkable = true;
    if(this.isDoorOpen()) walkable = true;
    if(this.isWater()) walkable = true;
    return walkable;
  }
  isSeen(){
    return this.seen;
  }
  isVisible(){
    return this.visible;
  }
  setVisible(){
    this.visible = true;
    this.seen = true;
  }
  unsetVisible(){
    this.visible = false;
  }
  isOccupied(){
    return this.actor?true:false;
  }
  setOccupied(actor){
    this.actor = actor;
  }
  clearOccupied(){
    this.actor = null;
  }
  getOccupied(){
    return this.actor;
  }
}

