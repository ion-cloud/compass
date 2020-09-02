import {fillRect} from '../tools/fillRect';
import {drunkenPath} from '../tools/drunkenPath';
import {findPath} from '../tools/findPath';
import {getNeighbors} from '../tools/getNeighbors';
import {getNeighborsHorizontal} from '../tools/getNeighborsHorizontal';
import {getNeighborsVertical} from '../tools/getNeighborsVertical';
import {ExistenceMap} from '../ExistenceMap';
import {shuffle} from '../utilities/shuffle';

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
  constructor({map,x1,x2,y1,y2,parent=null,type=null,root=this}={}){
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
    this.root=root; // root node

    // only the root partition stores all the doors
    if(this.root===this){
      this.doors = new ExistenceMap();
    } //end if
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

        this.left = new Partition({map: this.map,x1,x2: split,y1,y2,parent:this,type:'L',root:this.root});
        this.right = new Partition({map: this.map,x1: split+1,x2,y1,y2,parent:this,type:'R',root:this.root});
      }else{ //can't split horizontally, too small - close nodes
        this.left = {closed: true};
        this.right = {closed: true};
        fillRect({
          map:this.map,x1:this.x1,y1:this.y1,x2:this.x2-1,y2:this.y2-1,
          onDraw:sector=>sector.setFloor()
        });
      } //end if

    // splitting vertically
    }else if(this.height>maxSize){
      const split = r(y1+minSize,y2-minSize,1);

      this.left = new Partition({map:this.map,x1,x2,y1,y2:split,parent:this,type:'L',root:this.root});
      this.right = new Partition({map:this.map,x1,x2,y1:split+1,y2,parent:this,type:'R',root:this.root});
    }else{ //can't split vertically, too small - close nodes
      this.left = {closed: true};
      this.right = {closed: true};
      fillRect({
        map:this.map,x1:this.x1,y1:this.y1,x2:this.x2-1,y2:this.y2-1,
        onDraw:sector=>sector.setFloor()
      });
    } //end if
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
            this.root.doors.set({x:x+1,y});
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
            this.root.doors.set({x,y:y+1});
            created = true;
          } //end if
        } //end while
      } //end if
    }//end if
  }
}

export function patternedRooms({map}){
  const tree = new Partition({map,x1:map.startX+1,x2:map.width-1,y1:map.startY+1,y2:map.height-1});

  tree.connect();

  // now iterate through each room and any room with only two doors will be a hallway
  // as well as an occasional room with more then 2 doors to make it interesting
  const currentRoom = {sectors:[],doors:new ExistenceMap(),unmapped:[]};

  map.sectors.getAll().forEach(sector=>{
    if(sector.isFloor()&&!sector.roomNumber){
      currentRoom.sectors.length = 0;
      currentRoom.doors.reset();
      currentRoom.unmapped.length = 0;
      let testSector = sector;

      map.setRoom({x:testSector.x,y:testSector.y});
      do{
        currentRoom.sectors.push(testSector);
        if(map.isInbounds(testSector,'west')&&!map.getRoom(testSector,'west')){
          if(map.isFloor(testSector,'west')){
            currentRoom.unmapped.push(map.getSector(testSector,'west'));
            map.setRoom({x:testSector.x-1,y:testSector.y});
          }else if(map.isDoor(testSector,'west')){
            currentRoom.doors.set(testSector);
          } //end if
        } //end if
        if(map.isInbounds(testSector,'north')&&!map.getRoom(testSector,'north')){
          if(map.isFloor(testSector,'north')){
            currentRoom.unmapped.push(map.getSector(testSector,'north'));
            map.setRoom({x:testSector.x,y:testSector.y-1});
          }else if(map.isDoor(testSector,'north')){
            currentRoom.doors.set(testSector);
          } //end if
        } //end if
        if(map.isInbounds(testSector,'east')&&!map.getRoom(testSector,'east')){
          if(map.isFloor(testSector,'east')){
            currentRoom.unmapped.push(map.getSector(testSector,'east'));
            map.setRoom({x:testSector.x+1,y:testSector.y});
          }else if(map.isDoor(testSector,'east')){
            currentRoom.doors.set(testSector);
          } //end if
        } //end if
        if(map.isInbounds(testSector,'south')&&!map.getRoom(testSector,'south')){
          if(map.isFloor(testSector,'south')){
            currentRoom.unmapped.push(map.getSector(testSector,'south'));
            map.setRoom({x:testSector.x,y:testSector.y+1});
          }else if(map.isDoor(testSector,'south')){
            currentRoom.doors.set(testSector);
          } //end if
        } //end if
        testSector = currentRoom.unmapped.pop();
      }while(testSector!==undefined);

      const doors = currentRoom.doors.getAll();

      if(doors.length===2||doors.length>2&&Math.random()<0.5){
        const startDoor = map.getSector(doors.shift());

        currentRoom.sectors.forEach(({x,y})=> map.setEmpty({x,y}));
        do{
          const endDoor = map.getSector(doors.shift()),
                [x1,y1,x2,y2] = [startDoor.x,startDoor.y,endDoor.x,endDoor.y];

          if(x1===0||y1===0||x2===0||y2===0) break;
          drunkenPath({
            map,x1,y1,x2,y2,constrain:true,
            onDraw(sector){
              sector.setFloor();
              sector.hallway = true;
            },
            onFailureReattempt({x1,y1,x2,y2}){

              // if we can't make it look random, lets just draw a straight line
              return findPath({map,x1,y1,x2,y2});
            }
          });
        }while(doors.length);
      } //end if
      map.rooms[map.currentRoom]={};
      map.nextRoom();
    } //end if
  });

  // now finally clean up doors. We don't need a door in the middle of a hallway
  map.sectors.getAll()
    .forEach(sector=>{
      if(!sector.isDoor()) return;
      if(
        map.isFloor(sector,'north')&& //north-south hallway
        map.isFloor(sector,'south')&&
        getNeighbors({
          map,sector: map.getSector(sector,'north'),
          orthogonal: false, self: false,
          onTest:sector=> sector.isFloor()
        }).length===1&&
        getNeighbors({
          map,sector: map.getSector(sector,'south'),
          orthogonal: false, self: false,
          onTest:sector=> sector.isFloor()
        }).length===1||
        map.isFloor(sector,'west')&& //west-east hallway
        map.isFloor(sector,'east')&&
        getNeighbors({
          map,sector: map.getSector(sector,'west'),
          orthogonal: false, self: false,
          onTest:sector=> sector.isFloor()
        }).length===1&&
        getNeighbors({
          map,sector: map.getSector(sector,'east'),
          orthogonal: false, self: false,
          onTest: sector=> sector.isFloor()
        }).length===1||
        map.isFloor(sector,'west')&& //west-east connecting hallways
        map.isFloor(sector,'east')&&
        map.getSector(sector,'west').hallway&&
        map.getSector(sector,'east').hallway||
        map.isFloor(sector,'north')&& //north-south connecting hallways
        map.isFloor(sector,'south')&&
        map.getSector(sector,'north').hallway&&
        map.getSector(sector,'south').hallway
      ){
        sector.setFloor();

        // now that we punched a door, lets consolidate the room numbers
        // otherwise when we link rooms later we may link these multiple
        // times and make it look silly
        const todo = getNeighbors({
                map, sector,orthogonal: false, self: false,
                onTest:sector=> sector.isFloor()&&sector.roomNumber
              }),
              startingNode = todo.shift(),
              {roomNumber} = startingNode,
              touched = new ExistenceMap();

        touched.set(startingNode);
        do{
          const currentNode = todo.shift();

          currentNode.roomNumber = roomNumber;
          touched.set(currentNode);
          getNeighbors({
            map, sector: currentNode, orthogonal: false, self: false,
            onTest: sector=> sector.isFloor()&&sector.roomNumber&&!touched.get(sector)
          }).forEach(sector=> todo.push(sector));
        }while(todo.length)
      } //end if
    });

  // now compute room connections on the map now that we have allocated proper rooms
  tree.doors.getAll()
    .forEach(({x,y})=>{
      const [north,south,east,west] = [
        map.getSector({x,y},'north'),
        map.getSector({x,y},'south'),
        map.getSector({x,y},'east'),
        map.getSector({x,y},'west')
      ];

      if(north.isFloor()&&south.isFloor()){
        map.rooms[north.roomNumber][south.roomNumber] = true;
        map.rooms[south.roomNumber][north.roomNumber] = true;
      }else if(east.isFloor()&&west.isFloor()){
        map.rooms[east.roomNumber][west.roomNumber] = true;
        map.rooms[west.roomNumber][east.roomNumber] = true;
      } //end if
    });


  // wallify the map
  map.sectors.getAll().forEach(sector=>{
    if(!sector.isFloor()) return;
    getNeighbors({
      map,x: sector.x,y: sector.y,
      onTest(sector){
        return sector.isEmpty();
      }
    }).forEach(sector=> sector.setWall());
  });

  const doors = new ExistenceMap();

  map.sectors.getAll().forEach(sector=>{
    if(sector.isWall()){
      const rooms = {},
            neighborsWalkable = getNeighbors({
              map, ...sector, orthogonal: false, onTest:sector=> sector.isWalkable()
            }),
            neighborsWallHorizontal = getNeighborsHorizontal({
              map, ...sector, onTest:sector=> sector.isWall()
            }),
            neighborsWallVertical = getNeighborsVertical({
              map, ...sector, onTest:sector=> sector.isWall()
            }),
            list = Object.keys(
              neighborsWalkable.reduce((rooms,sector)=>{
                rooms[sector.roomNumber]=true;
                return rooms;
              },{})
            ),
            neighborsHallway = neighborsWalkable.filter(s=>s.hallway).length;

      if(
        list.length==2&&!map.rooms[list[0]][list[1]]&&neighborsHallway===1&&
        (neighborsWallHorizontal.length===2||neighborsWallVertical.length===2)
      ){
        sector.setDoor();
        doors.set(sector);
        map.rooms[list[0]][list[1]]=true;
      } //end if
    }else if(sector.isDoor()){
      doors.set(sector);
    } //end if
  });

  shuffle(doors.getAll()).forEach(({x,y})=>{
    const sector = map.getSector({x,y});

    if(!sector.isDoor()) return;
    const doorsNearby = getNeighbors({
      map, x, y, size: 2, self: true, onTest:sector=> sector.isDoor()
    });

    if(doorsNearby.length>1) return doorsNearby.forEach(sector=> sector.setFloor());
    const walkableNearby = getNeighbors({
      map, x, y, onTest:sector=> sector.isWalkable()
    });

    if(walkableNearby.length<=1) return sector.setWall();
    const wallsVertical = getNeighborsVertical({
        map, x, y, onTest:sector=> sector.isWall()
      }),
      wallsHorizontal = getNeighborsHorizontal({
        map, x, y, onTest:sector=> sector.isWall()
      });

    if(wallsVertical.length<2&&wallsHorizontal.length<2) sector.setFloor();
  });
} //end patternedRooms()
