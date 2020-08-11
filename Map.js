import {Noise} from './Noise';
import {Heap} from './Heap';
import {SectorMap} from './SectorMap';

export class Map{
  constructor({
    width=50,height=50,startX=0,startY=0,
    sectors=new SectorMap(),noise=new Noise(Math.random())
  }={}){
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
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
      sectors: this.sectors.clone(),
      initialize: false
    });
  }
  reset(){
    this.sectors.reset();
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
  bresenhamsLine({
    x1=0,y1=0,x2=0,y2=0,state={},
    onStart=()=>{},
    onTest=()=>{return true;},
    onSuccess=()=>{},
    onFailure=()=>{},
    onEach=()=>{},
    onFinish=()=>{},
    exitOnFailure=true
  }={}){
    const dx = Math.abs(x2 - x1),
          dy = Math.abs(y2 - y1),
          sx = x1 < x2 ? 1 : -1,
          sy = y1 < y2 ? 1 : -1;

    let [x,y] = [x1,y1],
        error = dx - dy,
        error2;

    onStart({x,y,x1,y1,x2,y2,state});
    do{
      onEach({x,y,x1,y1,x2,y2,state});
      if(!state.failing&&onTest({x,y,x1,y1,x2,y2,state})){
        onSuccess({x,y,x1,y1,x2,y2,state});
      }else{
        state.failing = true;
        if(exitOnFailure) state.finished = true;
        onFailure({x,y,x1,y1,x2,y2,state});
      } //end if
      if(x==x2&&y==y2) state.finished = true;
      error2 = 2 * error;
      if(error2 > -dy){ error -= dy; x += sx; }
      if(error2 < dx){ error += dx; y += sy; }
    }while(!state.finished)
    onFinish({x,y,x1,y1,x2,y2,state});
    return state;
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
    constrain=false,
    onFailureReattempt=()=>{},
    onFailure=()=>{}
  }={}){
    const map = this.clone(),
          minX = Math.min(x1,x2),
          maxX = Math.max(x1,x2),
          minY = Math.min(y1,y2),
          maxY = Math.max(y1,y2);

    let path;

    // randomly populate noise on a cloned map until there's a viable
    // path from x1,y1 to x2,y2
    map.fillRect({
      x1,y1,x2,y2,
      draw(sector){
        if(
          Math.random()<0.7||
          Math.abs(sector.x-x1)<3&&Math.abs(sector.y-y1)<3||
          Math.abs(sector.x-x2)<3&&Math.abs(sector.y-y2)<3
        ){
          sector.setFloor();
        }else{
          sector.setWall();
        } //end if
      }
    });
    path = map.findPath({
      x1,y1,x2,y2,map,
      test(sector){
        return sector.isWalkable()&&
          sector.x>=minX&&sector.x<=maxX&&
          sector.y>=minY&&sector.y<=maxY;
      }
    });

    // if the map input didn't allow a path, it's possible there's a failure
    // in such cases lets allow an onFailure function so the caller can handle
    // these cases
    if(!path) path = onFailureReattempt({x1,y1,x2,y2});

    // now we'll draw the path between the points
    (path||[]).forEach(sector=>{
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

    if(!path) onFailure({x1,y1,x2,y2});
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
          touched = [], //list of sectors mutated so we can restore them
          SQRT2 = Math.SQRT2; //shorten reference

    if(!map.isInbounds({x:x1,y:y1})||!map.isInbounds({x:x2,y:y2})) return null;
    let node = this.getSector({x: x1,y: y1}); //acquire starting node

    // set the g and f value of the start node to be 0
    node.path = {g: 0, f: 0, opened: false, closed: false, parent: null};

    // push the start node into the open list
    touched.push(node);
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
        touched.forEach(sector=> sector.path=null);
        return path.reverse();
      } //end if

      // get neighbours of the current node
      const neighbors = this.getNeighbors({
        x: node.x,y: node.y, orthogonal, test
      });

      for (let i = 0, ng; i < neighbors.length; ++i) {
        const neighbor = neighbors[i],
              x = neighbor.x,
              y = neighbor.y;

        // ensure every neighbor we adjusted is added to touched list
        if(!neighbor.path){
          touched.push(neighbor);
          neighbor.path = {};
        } //end if

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
    touched.forEach(sector=> sector.path=null);
    return null;
  }

  computeFOV({x=null,y=null,...args}={}){
    if(x===null||y===null) throw new Error('computeFOV: x & y required');
    this.computeDirectionalFOV({x,y,direction:'east',...args});
    this.computeDirectionalFOV({x,y,direction:'west',...args});
  }

  // ray-casting permissive
  computeDirectionalFOV({
    x=null,y=null,
    direction='east',
    fieldOfViewDegrees=180,
    fieldOfViewRadians=fieldOfViewDegrees*Math.PI/180,
    radius=8,
    accuracy=0.97, //higher accuracy required for higher radius
    isTransparent=({x,y})=> this.isWalkable({x,y})||this.isEmpty({x,y}),
    setTransparent=({x,y,state})=> state.visible[`${x},${y}`]=true,
    isTranslucent=({x,y})=> this.isWindow({x,y}),
    setTranslucent=({x,y,state})=>{
      if(state.firstWindow){
        state.secondWindow = true;
      } else {
        state.firstWindow = true;
      } //end if
    },
    isOpaque=({x,y,state})=> this.isWall({x,y})||this.isDoorClosed({x,y})||state.secondWindow,
    setVisible=()=>{},
    onStart=({state})=>{ state.visible = {}; },
    onTest=({x,y,state})=>{
      if(!this.isInbounds({x,y})) return false;
      if(isTransparent({x,y,state})) setTransparent({x,y,state});
      if(isTranslucent({x,y,state})) setTranslucent({x,y,state});
      state.visible[`${x},${y}`]=true;
      setVisible({x,y,state});
      if(isOpaque({x,y,state})) return false;
      return true;
    },
    ...args
  }={}){
    if(x===null||y===null) throw new Error('computeDirectionalFOV: x & y required');
    const quadrants = {
            north: -Math.PI,
            east: -Math.PI/2,
            south: Math.PI*2,
            west: Math.PI/2*5,
            northwest: Math.PI/4*3,
            northeast: -3*Math.PI/4,
            southwest: Math.PI/4,
            southeast: -Math.PI/4
          },
          theta = quadrants[direction]; 

    for(
      let sigma = fieldOfViewRadians;
      sigma > 0;
      sigma -= 1 - accuracy
    ){
      const [x1,y1] = [x,y],
            x2 = Math.round(x1 + radius * Math.cos(sigma + theta)),
            y2 = Math.round(y1 + radius * Math.sin(sigma + theta));

      this.bresenhamsLine({x1,y1,x2,y2,onStart,onTest, ...args});
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
  isRect({x1=0,y1=0,x2=0,y2=0,hasAll=()=>true,hasOne=()=>false}={}){
    const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

    for(let y = y1;y!==y2+dy;y+=dy){
      for(let x = x1;x!==x2+dx;x+=dx){
        const sector = this.getSector({x,y});

        if(
          !this.isInbounds(sector)||
          this.isInbounds(sector)&&!hasAll(sector)
        ){
          return false; //exit early
        }else if(this.isInbounds(sector)&&hasOne(sector)){
          return true;
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
        const sector = this.getSector({x,y});

        if(this.isInbounds(sector)&&test(sector)){
          draw(sector);
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
    this.sectors.getAll().forEach(sector=>{
      sector.roomNumber = 0;
    });
    this.sectors.getAll().forEach(sector=>{
      const sectorX = sector.x,
            sectorY = sector.y;

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
    this.sectors.getAll().forEach(sector=>{
      if(test(sector)&&sector.roomNumber!==locStats.num){
        failure(sector);
      }else if(test(sector)&&sector.roomNumber===locStats.num){
        success(sector);
      }else if(hardFailure){
        hardFailure(sector);
      } //end if
    });
  }
}
