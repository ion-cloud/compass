// These three constants control the size of the rooms
const minSize = 2;
const maxSize = 8;
const r = (lint,uint)=> Math.floor(Math.random()*(uint-lint))+lint;

// The partition class is essentially a binary tree with tiny controller
// logic to handle partition sizes and closing of partitions that don't
// meet the size requirements. After the tree is constructed, there's a
// connect method that walks up the tree from the bottom nodes recursively
// connecting sister leaves together with hallways.
class Partition{

  // This constructor creates a partitioned map down to the smallest
  // available size. The rooms are constructed with walls. After initialization
  // the connect function is called to build out hallways.
  constructor(map,x1,x2,y1,y2,parent,type){
    this.id=parent?parent.id+type:'@';
    this._closed=false;
    this.map = map;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2; //ordained space
    this.width=x2-x1;
    this.height=y2-y1;
    this.parent=parent||false;
    this.initialize();
  }
  get opened(){
    return this._closed===false;
  }
  get closed(){
    return this._closed===true;
  }
  setClosed(){
    this._closed=true;
  }

  // This creates a left and right child (left/right could be up and down) if there
  // is enough valid space to do so; otherwise, it sets the left and right child
  // as closed nodes
  initialize(){
    const x1 = this.x1, y1 = this.y1, x2 = this.x2, y2 = this.y2;

    // splitting horizontally
    if(this.width>=this.height){
      if(this.width>maxSize){
        const split = r(x1+minSize,x2-minSize,1);

        this.left = new Partition(this.map,x1,split,y1,y2,this,'L');
        this.right = new Partition(this.map,split+1,x2,y1,y2,this,'R');
      }else{ //can't split horizontally, too small - close nodes
        this.left = {closed: true};
        this.right = {closed: true};
        this.fill();
      } //end if

    // splitting vertically
    }else if(this.height>maxSize){
      const split = r(y1+minSize,y2-minSize,1);

      this.left = new Partition(this.map,x1,x2,y1,split,this,'L');
      this.right = new Partition(this.map,x1,x2,split+1,y2,this,'R');
    }else{ //can't split vertically, too small - close nodes
      this.left = {closed: true};
      this.right = {closed: true};
      this.fill();
    } //end if
  }

  // Fill is called when the partition can no longer be broken down into
  // smaller partitions.
  fill(){
    for(let y=this.y1-1;y<=this.y2;y++){
      for(let x=this.x1-1;x<=this.x2;x++){
        if(x===this.x1-1||x===this.x2||y===this.y1-1||y===this.y2){
          this.map.setEmpty({x,y});
        }else{
          this.map.setFloor({x,y});
        } //end if
      } //end for
    } //end for
  }

  //Connect is called after all the partitions are finished. It loops through
  //the partitions and connects all the sisters together that are still living
  //and works it's way up to the root node.
  connect(){
    // Recursively traverse downwards to terminal leafs
    if(this.left.opened) this.left.connect();
    if(this.right.opened) this.right.connect();

    // terminal leafs and upward connect and operate
    if(this.left.opened&&this.right.opened){
      this.left.setClosed();
      this.right.setClosed();

      // horizontal connection
      if(this.left.y1===this.right.y1&&this.left.y2===this.right.y2){
        let created = false;

        while(!created){
          const x=this.left.x2-1, y=r(this.left.y1,this.left.y2+1);

          if(this.map.isFloor({x,y})&&this.map.isFloor({x: x+2,y})){
            this.map.setDoor({x: x+1,y});
            created=true;
          } //end if
        } //end while

      // vertical connection
      }else if(this.left.x1===this.right.x1&&this.left.x2===this.right.x2){
        let created = false;

        while(!created){
          const x=r(this.left.x1,this.left.x2+1), y=this.left.y2-1;

          if(this.map.isFloor({x,y})&&this.map.isFloor({x,y: y+2})){
            this.map.setDoor({x,y: y+1});
            created = true;
          } //end if
        } //end while
      } //end if
    }//end if
  }
}

export function patternedRooms({map}){
  const tree = new Partition(map,1,map.width-1,1,map.height-1);

  tree.connect();

  // now iterate through each room and any room with only two doors will be a hallway
  const currentRoom = {sectors:[],doors:[],unmapped:[]};

  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      if(sector.isFloor()&&!sector.roomNumber){
        currentRoom.sectors.length = 0;
        currentRoom.doors.length = 0;
        currentRoom.unmapped.length = 0;
        let testSector = sector;

        map.setRoom({x:testSector.x,y:testSector.y,id:-1});
        do{
          currentRoom.sectors.push(testSector);
          if(map.isInbounds(testSector,'west')&&!map.getRoom(testSector,'west')){
            if(map.isFloor(testSector,'west')){
              currentRoom.unmapped.push(map.getSector(testSector,'west'));
              map.setRoom({x:testSector.x-1,y:testSector.y,id:-1});
            }else if(map.isDoor(testSector,'west')){
              currentRoom.doors.push(testSector);
            } //end if
          } //end if
          if(map.isInbounds(testSector,'north')&&!map.getRoom(testSector,'north')){
            if(map.isFloor(testSector,'north')){
              currentRoom.unmapped.push(map.getSector(testSector,'north'));
              map.setRoom({x:testSector.x,y:testSector.y-1,id:-1});
            }else if(map.isDoor(testSector,'north')){
              currentRoom.doors.push(testSector);
            } //end if
          } //end if
          if(map.isInbounds(testSector,'east')&&!map.getRoom(testSector,'east')){
            if(map.isFloor(testSector,'east')){
              currentRoom.unmapped.push(map.getSector(testSector,'east'));
              map.setRoom({x:testSector.x+1,y:testSector.y,id:-1});
            }else if(map.isDoor(testSector,'east')){
              currentRoom.doors.push(testSector);
            } //end if
          } //end if
          if(map.isInbounds(testSector,'south')&&!map.getRoom(testSector,'south')){
            if(map.isFloor(testSector,'south')){
              currentRoom.unmapped.push(map.getSector(testSector,'south'));
              map.setRoom({x:testSector.x,y:testSector.y+1,id:-1});
            }else if(map.isDoor(testSector,'south')){
              currentRoom.doors.push(testSector);
            } //end if
          } //end if
          testSector = currentRoom.unmapped.pop();
        }while(testSector!==undefined);

        // it's possible a room could have two of the same door, dedup
        currentRoom.doors = currentRoom.doors
          .filter((o,i,a)=>a.findIndex(t=>(t.x===o.x&&t.y===o.y))===i);

        if(currentRoom.doors.length===2){
          const startDoor = currentRoom.doors.pop(),
                endDoor = currentRoom.doors.pop(),
                [x1,y1,x2,y2] = [startDoor.x,startDoor.y,endDoor.x,endDoor.y];

          currentRoom.sectors.forEach(({x,y})=> map.setEmpty({x,y}));
          map.drunkenPath({
            x1,y1,x2,y2,
            draw(sector){
              if(!sector.isDoor()) sector.setFloor();
            }
          });
        } //end if
      } //end if
    });
  });

  // now finally clean up doors. We don't need a door in the middle of a hallway
  map.sectors.flat().filter(sector=> sector.isDoor())
    .forEach(sector=>{
      let touchingWalls=0;

      if(map.isInbounds(sector,'northwest')&&map.isWall(sector,'northwest')){
        touchingWalls++;
      } //end if
      if(map.isInbounds(sector,'north')&&map.isWall(sector,'north')){
        touchingWalls++;
      } //end if
      if(map.isInbounds(sector,'northeast')&&map.isWall(sector,'northeast')){
        touchingWalls++;
      } ///end if
      if(map.isInbounds(sector,'east')&&map.isWall(sector,'east')){
        touchingWalls++;
      } //end if
      if(map.isInbounds(sector,'southeast')&&map.isWall(sector,'southeast')){
        touchingWalls++;
      } //end if
      if(map.isInbounds(sector,'south')&&map.isWall(sector,'south')){
        touchingWalls++;
      } //end if
      if(map.isInbounds(sector,'southwest')&&map.isWall(sector,'southwest')){
        touchingWalls++;
      } //end if
      if(map.isInbounds(sector,'west')&&map.isWall(sector,'west')){
        touchingWalls++;
      } //end if
      if(touchingWalls>4) sector.setFloor();
    });

  // remove orphaned rooms and sections
  map.clipOrphaned({
    test:sector=> sector.isFloor()||sector.isDoor(),
    failure:sector=> sector.setEmpty()
  });

  // wallify the map
  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      if(!sector.isFloor()) return;
      map.getNeighbors({
        x: sector.x,y: sector.y,
        test(sector){
          return sector.isEmpty();
        }
      }).forEach(sector=> sector.setWall());
    });
  });
} //end patternedRooms()
