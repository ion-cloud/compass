import {Noise} from './Noise';
import {Heap} from './Heap';

export class Map{
  constructor({
    width=50,height=50,sectors=[],noise=new Noise(Math.random())
  }={}){
    this.width = width;
    this.height = height;
    this.noise = noise;
    this.sectors = sectors;
    this.rooms = [];
  }
  getRefmap(){
    return Object.assign({},this.refmap);
  }
  static shuffle(array){
    for(let i = array.length - 1,j; i > 0; i--){
      j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    } //end for
    return array;
  }
  clone(){
    return new Map({
      width: this.width,
      height: this.height,
      noise: this.noise,
      sectors: this.sectors.map(row=>{
        return row.map(sector=>{
          return sector.clone();
        });
      }),
      initialize: false
    });
  }
  reset(){
    this.sectors.forEach(row=>{
      row.forEach(sector=> sector.setEmpty());
    });
  }
  static isTouching({x1=0,y1=0,x2=0,y2=0}={}){
    if(
      x1===x2&&y1===y2||
      x1===x2&&y1===y2-1||
      x1===x2&&y1===y2+1||
      x1===x2-1&&y1===y2||
      x1===x2+1&&y1===y2||
      x1===x2-1&&y1===y2-1||
      x1===x2+1&&y1===y2-1||
      x1===x2+1&&y1===y2+1||
      x1===x2-1&&y1===y2-1
    ){
      return true;
    } //end if
    return false;
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
    return this.sectors[y][x];
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
    return this.isInbounds({x,y})&&this.getSector({x,y}).isSeen();
  }
  isVisible({x=0,y=0}={},direction){
    if(direction) ({x,y} = this.constructor.translate({x,y,direction}));
    return this.isInbounds({x,y})&&this.getSector({x,y}).isVisible();
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

  //eslint-disable-next-line complexity
  getNearbyVisible({x,y,includeBoundary=false}){
    const result = [];

    if(!this.isInbounds({x,y})&&includeBoundary){
      if(x===-1&&y===-1&&this.isVisible({x:x+1,y:y+1})){
        result.push('north');result.push('west');
      }else if(x===-1&&y===this.height&&this.isVisible({x:x+1,y:y-1})){
        result.push('south');result.push('west');
      }else if(x===this.width&&y===-1&&this.isVisible({x:x-1,y:y+1})){
        result.push('north');result.push('east');
      }else if(x===this.width&&y===this.height&&this.isVisible({x:x-1,y:y-1})){
        result.push('south');result.push('east');
      }else if(x===-1&&(
        this.isVisible({x:x+1,y:y-1})||
        this.isVisible({x:x+1,y})||
        this.isVisible({x:x+1,y:y+1}))
      ){
        result.push('west');
      }else if(x===this.width&&(
        this.isVisible({x:x-1,y:y-1})||
        this.isVisible({x:x-1,y})||
        this.isVisible({x:x-1,y:y+1}))
      ){
        result.push('east');
      }else if(y===-1&&(
        this.isVisible({x:x-1,y:y+1})||
        this.isVisible({x,y:y+1})||
        this.isVisible({x:x+1,y:y+1}))
      ){
        result.push('north');
      }else if(y===this.height&&(
        this.isVisible({x:x-1,y:y-1})||
        this.isVisible({x,y:y-1})||
        this.isVisible({x:x+1,y:y-1}))
      ){
        result.push('south');
      } //end if
    }else if(this.isInbounds({x,y})){
      if(this.isVisible({x:x-1,y})) result.push('west');
      if(this.isVisible({x:x+1,y})) result.push('east');
      if(this.isVisible({x,y:y-1})) result.push('north');
      if(this.isVisible({x,y:y+1})) result.push('south');
    } //end if
    return result;
  }

  // uses bresenhams line algorithm to acquire an array of points
  // inclusively between A(x1,y1) and B(x2,y2)
  bresenhamsLine({x1=0,y1=0,x2=0,y2=0}={}){
    const dx = Math.abs(x2-x1), dy = Math.abs(y2-y1),
          sx = x1<x2?1:-1, sy = y1<y2?1:-1,
          path = [this.getSector({x: x1,y: y1})];

    let err = dx-dy, err2; //difference and difference*2

    if(!this.isInbounds({x: x1,y: y1})||!this.isInbounds({x: x2,y: y2})){
      return null;
    } //end if
    while(!(x1===x2&&y1===y2)){
      err2 = 2*err;
      if(err2>-dy){
        err-=dy; x1+=sx; //eslint-disable-line no-param-reassign
      } //end if
      if(err2<dx){
        err+=dx; y1+=sy; //eslint-disable-line no-param-reassign
      } //end if
      path.push(this.getSector({x: x1,y: y1}));
    } //end while()
    return path;
  }

  // return the neighbors of a given sector that pass the `test` function.
  // Can specify whether or not testing of orthogonal, cardinal or the
  // originating sector. `size` will expand to not just nearby sectors
  getNeighbors({
    sector,x=sector.x,y=sector.y,size=1,
    orthogonal=true,cardinal=true,self=false,
    test=()=>true
  }={}){
    const list=[],
          listAdd = loc=>{
            if(this.isInbounds(loc)&&test(this.getSector(loc))){
              list.push(this.getSector(loc));
            } //end if
          };

    for(let cy=y-size;cy<=y+size;cy++){
      for(let cx=x-size;cx<=x+size;cx++){
        if(cx===x&&cy===y&&self){
          listAdd({x: cx, y: cy});
        }else if(cx===x&&cy===y&&!self){
          continue;
        }else if(cx===x&&cardinal||cy===y&&cardinal){ //cardinal
          listAdd({x: cx, y: cy});
        }else if(orthogonal){ //orthogonal
          listAdd({x: cx, y: cy});
        } //end if
      } //end for
    } //end for
    return list;
  }

  // return a seemingly random path between two points. `wide` will
  // have the path be occasionally wider than 1 sector. `draw` function
  // will be applied to each sector in the path
  drunkenPath({
    x1=0,y1=0,x2=0,y2=0,wide=false,draw=()=>true,
    constrain=false
  }={}){
    const map = this.clone(),
          minX = Math.min(x1,x2),
          maxX = Math.max(x1,x2),
          minY = Math.min(y1,y2),
          maxY = Math.max(y1,y2);

    let path;

    // randomly populate noise on a cloned map until there's a viable
    // path from x1,y1 to x2,y2
    do{
      map.sectors.forEach(row=>{

        //eslint-disable-next-line complexity
        row.forEach(sector=>{
          if(
            Math.random()<0.7||
            Math.abs(sector.x-x1)<3&&Math.abs(sector.y-y1)<3||
            Math.abs(sector.x-x2)<3&&Math.abs(sector.y-y2)<3
          ){
            sector.setFloor();
          }else{
            sector.setWall();
          } //end if
        });
      });
      path = map.findPath({
        x1,y1,x2,y2,map,
        test(sector){
          return sector.isWalkable()&&
            sector.x>=minX&&sector.x<=maxX&&
            sector.y>=minY&&sector.y<=maxY;
        }
      });
    }while(path===null)

    // now we'll draw the path between the points
    path.forEach(sector=>{
      if(wide){
        map.getNeighbors({
          x: sector.x,y: sector.y,orthogonal: false,
          test(sector){
            return Math.random()<0.35&&sector.isWalkable();
          }
        }).forEach(sector=> draw(this.getSector({x: sector.x,y: sector.y})));
        draw(this.getSector({x: sector.x,y: sector.y}));
      }else{
        draw(this.getSector({x: sector.x,y: sector.y}));
      } //end if
    });
  }

  // find a path between two points that passes the `test` function when applied
  // to each sector
  findPath({
    x1=0,y1=0,x2=0,y2=0,test=()=>true,map=this,orthogonal=false,
    computeWeight=sector=>1
  }={}){
    const heuristic = (dx, dy) => dx + dy, //manhattan heuristic
          openList = new Heap([],(a,b)=> b.path.f-a.path.f>0),
          abs = Math.abs, //shorten reference
          clone = this.clone(), //so we can mutate it and destroy it when done
          SQRT2 = Math.SQRT2; //shorten reference

    if(!map.isInbounds({x:x1,y:y1})||!map.isInbounds({x:x2,y:y2})) return null;
    let node = clone.getSector({x: x1,y: y1}); //acquire starting node

    // set the g and f value of the start node to be 0
    node.path = {g: 0, f: 0, opened: false, closed: false, parent: null};

    // push the start node into the open list
    openList.push(node);
    node.path.opened = true;

    // while the open list is not empty
    while (openList.length) {

      // pop the position of node which has the minimum f value
      node = openList.pop();
      node.path.closed = true;

      // if reached the end position, construct the path and return it
      if (node.x === x2 && node.y === y2) {
        const path = []; //final path

        // Add all successful nodes to the path array except starting node
        do{
          path.push(map.getSector({x: node.x,y: node.y}));
          node = node.path.parent;
        }while(node.path.parent);
        path.push(map.getSector({x: x1,y: y1})); //add start node

        // pop from list to get path in order
        return path.reverse();
      } //end if

      // get neighbours of the current node
      const neighbors = clone.getNeighbors({
        x: node.x,y: node.y, orthogonal, test
      });

      for (let i = 0, ng; i < neighbors.length; ++i) {
        const neighbor = neighbors[i],
              x = neighbor.x,
              y = neighbor.y;

        // inherit the new path or create the container object
        neighbor.path=neighbor.path||{};

        // get the distance between current node and the neighbor
        // and calculate the next g score
        ng = node.path.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

        // check if the neighbor has not been inspected yet, or
        // can be reached with smaller cost from the current node
        if (!neighbor.path.opened || ng < neighbor.path.g) {
          neighbor.path.g = ng;
          neighbor.path.h = neighbor.path.h || 
            computeWeight(neighbor) * heuristic(abs(x - x2), abs(y - y2));
          neighbor.path.f = neighbor.path.g + neighbor.path.h;
          neighbor.path.parent = node;

          if (!neighbor.path.opened) {
            openList.push(neighbor);
            neighbor.path.opened = true;
          }else{

            // the neighbor can be reached with smaller cost.
            // Since its f value has been updated, we have to
            // update its position in the open list
            openList.updateItem(neighbor);
          } //end if
        } //end if
      } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return null;
  }

  // compute visibility for a 180-degree arc
  // this uses restricted shadowcasting algorithm
  computeRestrictedFOV({
    originX,originY,radius,direction='north',
    isTransparent=()=>{},setVisible=()=>{}
  }={}){
    const directions = {
            north: 0, northeast: 1, east: 2, southeast: 3, south: 4,
            southwest: 5, west: 6, northwest: 7
          },
          octants = [
            [-1, 0, 0, 1],
            [0, -1, 1, 0],
            [0, -1, -1, 0],
            [-1, 0, 0, -1],
            [1, 0, 0, -1],
            [0, 1, -1, 0],
            [0, 1, 1, 0],
            [1, 0, 0, 1]
          ],
          octant1 = (directions[direction]-2+8)%8,
          octant2 = (directions[direction]-1+8)%8,
          octant3 = (directions[direction]+8)%8,
          octant4 = (directions[direction]+1+8)%8;

    setVisible({x:originX,y:originY});
    this.computeRestrictedFOVOctant({
      originX,originY,radius,isTransparent,setVisible,
      octant:octants[(directions[direction]-2+8)%8]
    });
    this.computeRestrictedFOVOctant({
      originX,originY,radius,isTransparent,setVisible,
      octant:octants[(directions[direction]-1+8)%8]
    });
    this.computeRestrictedFOVOctant({
      originX,originY,radius,isTransparent,setVisible,
      octant:octants[(directions[direction]+8)%8]
    });
    this.computeRestrictedFOVOctant({
      originX,originY,radius,isTransparent,setVisible,
      octant:octants[(directions[direction]+1+8)%8]
    });
  }

  computeRestrictedFOVOctant({
    originX,originY,radius,isTransparent,setVisible,octant,
    row=1,visSlopeStart=1.0,visSlopeEnd=0.0
  }={}){
    const [xx,xy,yx,yy] = octant;

    if(visSlopeStart<visSlopeEnd) return;
    for (let i = row; i <= radius; i++) {
      let dx = -i - 1,
          dy = -i,
          blocked = false,
          newStart = 0;

      //'Row' could be column, names here assume octant 0 and would be flipped for half the octants
      while (dx <= 0) {
        dx += 1;

        //Translate from relative coordinates to map coordinates
        let mapX = originX + dx * xx + dy * xy,
            mapY = originY + dx * yx + dy * yy;

        //Range of the row
        let slopeStart = (dx - 0.5) / (dy + 0.5),
            slopeEnd = (dx + 0.5) / (dy - 0.5);

        //Ignore if not yet at left edge of Octant
        if (slopeEnd > visSlopeStart) continue;

        //Done if past right edge
        if (slopeStart < visSlopeEnd) break;

        //If it's in range, it's visible
        if (
          (dx * dx + dy * dy) < (radius * radius) &&
          this.isInbounds({x:mapX,y:mapY})
        ) setVisible({x:mapX,y:mapY});
        if (!blocked) {

          //If tile is a blocking tile, cast around it
          if (
            !this.isInbounds({x:mapX,y:mapY}) ||
            !isTransparent({x:mapX,y:mapY}) && i < radius
          ) {
            blocked = true;
            this.computeRestrictedFOVOctant({
              originX,originY,radius,isTransparent,setVisible,octant,
              row:row+1,visSlopeStart,visSlopeEnd:slopeStart
            })
            newStart = slopeEnd;
          }
        } else {

          //Keep narrowing if scanning across a block
          if (
            !this.isInbounds({x:mapX,y:mapY})||
            !isTransparent({x:mapX,y:mapY})
          ) {
            newStart = slopeEnd;
            continue;
          }

          //Block has ended
          blocked = false;
          visSlopeStart = newStart;
        } //end if
      } //end while
      if (blocked) break;
    } //end for
  } //end computeRestrictedFOVOctant()

  // Use Mingos Restricted Precise Angle Shadowcasting to
  // set new visible sectors
  computeFOV({
    originX,originY,radius,
    isTransparent=()=>{},isVisible=()=>{},setVisible=()=>{}
  }={}){
    setVisible({x:originX,y:originY});

    // southeast
    this.computeFOVOctantY({
      originX,originY,radius,deltaX:1,deltaY:1,
      isTransparent,isVisible,setVisible
    });
    this.computeFOVOctantX({
      originX,originY,radius,deltaX:1,deltaY:1,
      isTransparent,isVisible,setVisible
    });

    // northeast
    this.computeFOVOctantY({
      originX,originY,radius,deltaX:1,deltaY:-1,
      isTransparent,isVisible,setVisible
    });
    this.computeFOVOctantX({
      originX,originY,radius,deltaX:1,deltaY:-1,
      isTransparent,isVisible,setVisible
    });

    // southwest
    this.computeFOVOctantY({
      originX,originY,radius,deltaX:-1,deltaY:1,
      isTransparent,isVisible,setVisible
    });
    this.computeFOVOctantX({
      originX,originY,radius,deltaX:-1,deltaY:1,
      isTransparent,isVisible,setVisible
    });

    // northwest
    this.computeFOVOctantY({
      originX,originY,radius,deltaX:-1,deltaY:-1,
      isTransparent,isVisible,setVisible
    });
    this.computeFOVOctantX({
      originX,originY,radius,deltaX:-1,deltaY:-1,
      isTransparent,isVisible,setVisible
    });
  }
  computeFOVOctantY({
    originX,originY,deltaX,deltaY,radius,
    isTransparent,isVisible,setVisible
  }){
    const minX = Math.max(0,originX-radius),
          minY = Math.max(0,originY-radius),
          maxX = Math.min(this.width-1,originX+radius),
          maxY = Math.min(this.height-1,originY+radius),
          startSlopes = [],
          endSlopes = [];

    for(
      let y=originY+deltaY,
      iteration=1,totalObstacles=0,obstaclesInLastLine=0,
      minSlope=0;
      y>=minY&&y<=maxY;
      y+=deltaY,obstaclesInLastLine=totalObstacles,++iteration
    ){
      const halfSlope = 0.5/iteration;

      for(
        let processedCell = Math.floor(minSlope*iteration+0.5),
        x=originX+(processedCell*deltaX),
        previousEndSlope=-1,
        visible,extended,centreSlope,endSlope;
        processedCell<=iteration&&x>=minX&&x<=maxX;
        x+=deltaX,++processedCell,previousEndSlope=endSlope
      ){
        let visible=true,extended=false,
            centreSlope=processedCell/iteration,
            startSlope=previousEndSlope;

        endSlope=centreSlope+halfSlope;
        if(obstaclesInLastLine>0){
          if(
            !(isVisible({x,y:y-deltaY})&&isTransparent({x,y:y-deltaY}))&&
            !(isVisible({x:x-deltaX,y:y-deltaY})&&isTransparent({x:x-deltaX,y:y-deltaY}))
          ){
            visible = false;
          }else{
            for(let idx=0;idx<obstaclesInLastLine&&visible;++idx){
              if(startSlope>endSlopes[idx]||endSlope<startSlopes[idx]) continue;
              if(isTransparent({x,y})){
                if(centreSlope>startSlopes[idx]&&centreSlope<endSlopes[idx]){
                  visible=false;
                  break;
                } //end if
              }else if(startSlope>=startSlopes[idx]&&endSlope<=endSlopes[idx]){
                visible=false;
                break;
              }else{
                startSlopes[idx]=Math.min(startSlopes[idx],startSlope);
                endSlopes[idx]=Math.max(endSlopes[idx],endSlope);
                extended=true;
              } //end if
            } //end for
          } //end if
        } //end if
        if(visible){
          setVisible({x,y});
          if(!isTransparent({x,y})&&minSlope>=startSlope){
            minSlope = endSlope;
          }else if(!isTransparent({x,y})&&!extended){
            startSlopes[totalObstacles] = startSlope;
            endSlopes[totalObstacles++] = endSlope;
          } //end if
        } //end if
      } //end for
    } //end for
  }
  computeFOVOctantX({
    originX,originY,deltaX,deltaY,radius,
    isTransparent,isVisible,setVisible
  }){
    const minX = Math.max(0,originX-radius),
          minY = Math.max(0,originY-radius),
          maxX = Math.min(this.width-1,originX+radius),
          maxY = Math.min(this.height-1,originY+radius),
          startSlopes = [],
          endSlopes = [];

    for(
      let x=originX+deltaX,
      iteration=1,totalObstacles=0,obstaclesInLastLine=0,
      minSlope=0;
      x>=minX&&x<=maxX;
      x+=deltaX,obstaclesInLastLine=totalObstacles,++iteration
    ){
      const halfSlope = 0.5/iteration;

      for(
        let processedCell = Math.floor(minSlope*iteration+0.5),
        y=originY+(processedCell*deltaY),
        previousEndSlope=-1,
        visible,extended,centreSlope,endSlope;
        processedCell<=iteration&&y>=minY&&y<=maxY;
        y+=deltaY,++processedCell,previousEndSlope=endSlope
      ){
        let visible=true,extended=false,
            centreSlope=processedCell/iteration,
            startSlope=previousEndSlope;

        endSlope=centreSlope+halfSlope;
        if(obstaclesInLastLine>0){
          if(
            !(isVisible({x:x-deltaX,y})&&isTransparent({x:x-deltaX,y}))&&
            !(isVisible({x:x-deltaX,y:y-deltaY})&&isTransparent({x:x-deltaX,y:y-deltaY}))
          ){
            visible = false;
          }else{
            for(let idx=0;idx<obstaclesInLastLine&&visible;++idx){
              if(startSlope>endSlopes[idx]||endSlope<startSlopes[idx]) continue;
              if(isTransparent({x,y})){
                if(centreSlope>startSlopes[idx]&&centreSlope<endSlopes[idx]){
                  visible=false;
                  break;
                } //end if
              }else if(startSlope>=startSlopes[idx]&&endSlope<=endSlopes[idx]){
                visible=false;
                break;
              }else{
                startSlopes[idx]=Math.min(startSlopes[idx],startSlope);
                endSlopes[idx]=Math.max(endSlopes[idx],endSlope);
                extended=true;
              } //end if
            } //end for
          } //end if
        } //end if
        if(visible){
          setVisible({x,y});
          if(!isTransparent({x,y})&&minSlope>=startSlope){
            minSlope = endSlope;
          }else if(!isTransparent({x,y})&&!extended){
            startSlopes[totalObstacles] = startSlope;
            endSlopes[totalObstacles++] = endSlope;
          } //end if
        } //end if
      } //end for
    } //end for
  }

  // test that the entire path passes the specified test function and return
  // boolean
  isPath({path=[],test=()=>true}={}){
    let result = true;

    if(!path.length){
      result = false;
    }else if(!path.slice(1,path.length).every(p=> test(this.getSector(p)))){
      result = false;
    } //end if
    return result;
  }

  // test rect to see if `test(sector)` is true
  isRect({x1=0,y1=0,x2=0,y2=0,test=()=>false}={}){
    const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

    for(let y = y1;y!==y2+dy;y+=dy){
      for(let x = x1;x!==x2+dx;x+=dx){
        if(
          !this.isInbounds({x,y})||
          this.isInbounds({x,y})&&!test(this.getSector({x,y}))
        ){
          return false; //exit early
        } //end if
      } //end for
    } //end for
    return true;
  }

  // fills rect if `test(sector)` return true
  fillRect({x1=0,y1=0,x2=0,y2=0,test=()=>true,draw=()=>false}={}){
    const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

    for(let y = y1;y!==y2+dy;y+=dy){
      for(let x = x1;x!==x2+dx;x+=dx){
        if(this.isInbounds({x,y})&&test(this.getSector({x,y}))){
          draw(this.getSector({x,y}));
        } //end if
      } //end for
    } //end for
    return true;
  }

  // can pass in a wall and floor draw function, or just a generic draw
  // function to merely fill the entire area with something. `test` is
  // also optional, it will test the sector before passing to draw fn's
  fillRoom({
    x1=0,y1=0,x2=0,y2=0,
    draw=false,test=()=>true,wall=()=>true,floor=()=>true
  }={}){
    const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

    for(let y = y1;y!==y2+dy;y+=dy){
      for(let x = x1;x!==x2+dx;x+=dx){
        if(!this.isInbounds({x,y})){
          continue;
        }else if(typeof draw === 'function'){
          if(test(this.getSector({x,y}))) draw(this.getSector({x,y}));
        }else if(y===y1||y===y2||x===x1||x===x2){
          if(test(this.getSector({x,y}))) wall(this.getSector({x,y}));
        }else if(test(this.getSector({x,y}))){
          floor(this.getSector({x,y}));
        } //end if
      } //end for
    } //end for
  }

  // get start and ending coordinates given a boundary box that will
  // touch two separate edges
  static getTerminalPoints({
    x1=0,y1=0,x2=0,y2=0,horizontal=true,vertical=true,
    forward=true,backward=true
  }={}){
    const directionTypes = [];

    let direction=Math.random();

    // acquire the direction, forward and backward are diagonals
    if(horizontal) directionTypes.push('horizontal');
    if(vertical) directionTypes.push('vertical');
    if(forward) directionTypes.push('forward');
    if(backward) directionTypes.push('backward');
    direction = directionTypes[Math.floor(Math.random()*directionTypes.length)];

    // based on the direction randomly compute terminal points
    if(direction==='horizontal'){
      return {
        x1,
        x2,
        y1: Math.floor(Math.random()*y2/2+y2/4),
        y2: Math.floor(Math.random()*y2/2+y2/4)
      };
    }else if(direction==='vertical'){
      return {
        x1: Math.floor(Math.random()*x2/2+x2/4),
        x2: Math.floor(Math.random()*x2/2+x2/4),
        y1,
        y2
      };
    }else if(direction==='forward'){
      if(Math.random()<0.5){ // most eastward
        return {
          x1: Math.floor(Math.random()*x2/4),
          x2,
          y1: y2,
          y2: Math.floor(Math.random()*y2/4)
        };
      } //end if
      return {
        x1,
        x2: Math.floor(Math.random()*x2/4+x2/2),
        y1: Math.floor(Math.random()*y2/4+y2/2),
        y2
      };
    }else if(direction==='backward'){
      if(Math.random()<0.5){ //most eastward
        return {
          x1: Math.floor(Math.random()*x2/4),
          x2,
          y1,
          y2: Math.floor(Math.random()*y2/4+y2/2)
        };
      } //end if
      return {
        x1,
        x2: Math.floor(Math.random()*x2/4+x2/2),
        y1: Math.floor(Math.random()*y2/4),
        y2
      };
    } //end if
    return null;
  }

  // loop through the entire maps sectors and group them into walkable
  // areas based on the `test` function. The largest room will have
  // `success` called on each sector, all smaller rooms will have
  // `failure` called on each sector, all sectors that didn't pass test
  // will have `hardFailure` called on each sector
  clipOrphaned({
    test=()=>true,failure=()=>true,success=()=>true,
    hardFailure=()=>true
  }={}){
    const locStats = {val: 0,cur: 0,num: 0,max: 0},
          unmapped = [];

    // we have to start by removing roomNumbers if they exist because
    // we run this function more than once
    this.sectors.forEach(row=>{

      //eslint-disable-next-line no-return-assign
      row.forEach(sector=> sector.roomNumber = 0);
    });
    this.sectors.forEach((row,sectorY)=>{
      row.forEach((sector,sectorX)=>{
        if(test(sector)&&!sector.roomNumber){
          locStats.cur++; locStats.val = 1; //init new room
          let newLoc = {x:sectorX,y:sectorY,id: locStats.cur},
              x, y;

          do{
            ({x,y}=newLoc);
            if(
              this.isInbounds({x: x-1,y})&&!this.getRoom({x: x-1,y})&&
              test(this.getSector({x: x-1,y}))
            ){
              unmapped.push({x: x-1, y});
              this.setRoom({x: x-1,y,id: -1});
            } //end if
            if(
              this.isInbounds({x,y: y-1})&&!this.getRoom({x,y: y-1})&&
              test(this.getSector({x,y: y-1}))
            ){
              unmapped.push({x,y: y-1});
              this.setRoom({x,y: y-1,id: -1});
            } //end if
            if(
              this.isInbounds({x: x+1,y})&&!this.getRoom({x: x+1,y})&&
              test(this.getSector({x: x+1,y}))
            ){
              unmapped.push({x: x+1, y});
              this.setRoom({x: x+1,y,id: -1});
            } //end if
            if(
              this.isInbounds({x,y: y+1})&&!this.getRoom({x,y: y+1})&&
              test(this.getSector({x,y: y+1}))
            ){
              unmapped.push({x,y: y+1});
              this.setRoom({x,y: y+1,id: -1});
            } //end if
            this.setRoom({x,y,id: locStats.cur});
            locStats.val++;
            if(locStats.val>locStats.max){
              locStats.max=locStats.val;
              locStats.num=locStats.cur;
            } //end manage maximum mass
            newLoc = unmapped.pop();
          }while(newLoc!==undefined)
        } //end if
      });
    });
    this.sectors.forEach(row=>{
      row.forEach(sector=>{
        if(test(sector)&&sector.roomNumber!==locStats.num){
          failure(sector);
        }else if(test(sector)&&sector.roomNumber===locStats.num){
          success(sector);
        }else if(hardFailure){
          hardFailure(sector);
        } //end if
      });
    });
  }
}



