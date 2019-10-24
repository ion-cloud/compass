export class Sector{
  constructor({map,x=0,y=0,category='empty',roomNumber=0}={}){
    this.map = map;
    this.x = x;
    this.y = y;
    this.category = category;
    this.type = {}; //holds metadata about the category selected
    this.roomNumber = roomNumber;
  }
  clone(){
    return new Sector({
      map: this.map,
      x: this.x,
      y: this.y,
      category: this.category,
      roomNumber: this.roomNumber
    });
  }
  isEmpty(){
    return this.category === 'empty';
  }
  setEmpty(){
    this.category = 'empty';
    this.type = {};
  }
  isVoid(){
    return this.category === 'void';
  }
  setVoid(){
    this.category = 'void';
    this.type = {};
  }
  isRemoved(){
    return this.category === 'removed';
  }
  setRemoved(){
    this.category = 'removed';
  }
  isDoor(){
    return this.category === 'door';
  }
  isDoorClosed(){
    return this.category === 'door' && !this.doorOpen;
  }
  isDoorOpen(){
    return this.category === 'door' && this.doorOpen;
  }
  setDoor(){
    this.category = 'door';
    this.doorOpen = Math.random()<0.5?true:false; //random
  }
  setDoorOpen(){
    if(this.category==='door') this.doorOpen = true;
  }
  setDoorClosed(){
    if(this.category==='door') this.doorOpen = false;
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
    if(this.isDoor()&&this.isDoorOpen()) walkable = true;
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
}

