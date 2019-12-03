import {Noise} from '../Noise';

// Meander Calculation:
//
// 1. Choose a starting map edge and ending map edge, acquire
// the terminal points based on those edges. Usually this would
// be a random point on those edges. Maybe you'd want to weight
// it so it's predominately in the center, or you could restrict
// it to a certain part.
//
// 2. Create bresenhams line between the terminal points. This
// is called the pathing vector.
//
// 3. Break up the pathing vector into chunks of 9x9 where the
// pathing vector crosses the center. There may be left-over of
// the pathing vector.
//
// 4. For each chunk, perform a recursive maze generation algorithm
// on the chunk. Repeat this step until there is a path from the
// start of the pathing vector within the chunk to the end of the
// pathing vector in the chunk. A* pathing algorithm can be used
// for the pathing.
//
// 5. Merely use bresenhams line to wrap up the extraneous pathing
// vector not covered by chunks, alternatively break up the remaining
// path into the largest odd number and chunk and process it similarly
// to the previous part of the algorithm to make it more consistent.
// Left overs in this optional way would still be filled in with
// bresenhams line.
//
// Recursive Maze Generation:
//
// 1. Choose a starting point in the field.
//
// 2. Randomly choose a wall at that point and carve a passage
// through to the adjacent cell, but only if the adjacent cell
// has not been visited yet. This becomes the new current cell.
//
// 3. All adjacent cells have been visited, back up to the last
// cell that has uncarved walls and repeat.
//
// 4. The algorithm ends when the process has backed all the way
// up to the starting point.
export function meander({map}){
  let path;

  do{
    map.reset(); //set all sectors to empty

    // create bresenhams line
    const line = map.bresenhamsLine(
      map.constructor.getTerminalPoints({
        x1: 0,y1: 0,
        x2: map.width-1,y2: map.height-1,
        forward: false, backward: false //will prevent pruning
      })
    );

    // chunk the line
    const chunks = line.reduce((arr,item,i)=>{
      const chunkIndex = Math.floor(i/9); //9-sized chunks

      if(!arr[chunkIndex]) arr[chunkIndex] = [];
      arr[chunkIndex].push(item);
      return arr;
    },[]);

    // now create a maze on each chunk
    chunks.forEach(chunk=>{
      let x1 = chunk[0].x, y1 = chunk[0].y,
          x2 = chunk[chunk.length-1].x, y2 = chunk[chunk.length-1].y;


      // If the pathing vector is horizontal or vertical completely then
      // the chunks will be super thin, so we'll appropriately make the
      // chunk more of a square and impose it on the center of the line
      // so it can have enough room to actually meander
      if(x2-x1<y2-y1){
        const h = Math.round(((y2-y1)-(x2-x1))/2);

        x1-=h; x2+=h;
        if(x1<0) x1=0;
        if(x2>map.width-1) x2 = map.width-1;
      }else{
        const h = Math.round(((x2-x1)-(y2-y1))/2);

        y1-=h; y2+=h;
        if(y1<0) y1=0;
        if(y2>map.height-1) y2 = map.height-1;
      } //end if

      // we need to make sure that the difference between widths and heights
      // are all even so we can alternate between walls and floors in a maze
      // successfully. Leftovers can just use bresenhams
      if((x2-x1)%2===1&&x2<map.width-1){
        x2++;
      }else if((x2-x1)%2===1&&x2>0){
        x2--;
      } //end if
      if((y2-y1)%2===1&&y2<map.height-1){
        y2++;
      }else if((y2-y1)%2===1&&y2>0){
        y2--;
      } //end if
      createMaze({
        map,x1,y1,x2,y2,
        sx: chunk[0].x, sy: chunk[0].y,
        ex: chunk[chunk.length-1].x, ey: chunk[chunk.length-1].y
      });
    });

    path = map.findPath({
      x1: line[0].x, y1: line[0].y,
      x2: line[line.length-1].x, y2: line[line.length-1].y,
      map,
      test(sector){
        return sector.isWalkable();
      }
    })
  }while(!path)
  path.forEach(sector=>{
    sector.setWater();
    map.getNeighbors({
      x: sector.x,y: sector.y,
      test(sector){
        return !sector.isWater();
      }
    }).forEach(sector=>{
      if(Math.random()<0.3){
        sector.setFloorSpecial()
      } //end if
    });
  });

  // now we'll make the rest of the map look good
  const noise = new Noise();

  map.sectors.forEach(row=>{
    row.forEach(sector=>{
      const n = (1+map.noise.simplex2(sector.x/map.width*8,sector.y/map.height*8))/2,
            n2 = (1+noise.simplex2(sector.x/map.width*4,sector.y/map.height*4))/2;

      if(n<0.2&&!(sector.isWater()||sector.isFloorSpecial())){
        sector.setWallSpecial();
      }else if(n<0.5&&!(sector.isWater()||sector.isFloorSpecial())){
        sector.setWall();
      }else if(n>0.9&&n2<0.3){
        sector.setWaterSpecial();
      }else if(n>0.8&&n2<0.3){
        sector.setWater();
      }else if(sector.isEmpty()&&Math.random()<0.2){
        sector.setFloorSpecial();
      }else if(sector.isEmpty()){
        sector.setFloor();
      }else if(n<0.2&&sector.isWater()){
        sector.setWaterSpecial();
      } //end if
    });
  });

  map.clipOrphaned({
    test: sector=> sector.isWalkable(),
    failure: sector=> sector.setWallSpecial()
  });
} //end function

function createMaze({map,x1=0,y1=0,x2=8,y2=8}={}){
  const sectors=[],
        directions = [
          {move: {x:-2,y:0}, carve: {x:-1,y:0}}, //west
          {move: {x:2,y:0}, carve: {x:1,y:0}}, //east
          {move: {x:0,y:-2}, carve: {x:0,y:-1}}, //north
          {move: {x:0,y:2}, carve: {x:0,y:1}} //south
        ],
        clone = map.clone();

  let x = x1, y = y1,
      direction, //represents the random chosen direction
      sector=clone.getSector({x,y}) //represents the sector we're testing

  sector.visited = true;
  map.setFloor({x: sector.x, y: sector.y}); //start tile is always floor
  sectors.push(sector);
  do{
    clone.constructor.shuffle(directions); //mutate in-place
    for(let i=0;i<directions.length;i++){
      direction=directions[i];
      if(
        clone.isInbounds({
          x: x+direction.move.x,
          y: y+direction.move.y,
          x1, x2, y1, y2
        })&&
        !clone.getSector({
          x: x+direction.move.x,
          y: y+direction.move.y
        }).visited
      ){
        sector = clone.getSector({
          x: x+direction.carve.x,
          y: y+direction.carve.y
        });
        map.setFloor({x: sector.x, y: sector.y});
        sector = clone.getSector({
          x: x+direction.move.x,
          y: y+direction.move.y
        });
        sector.visited = true;
        map.setFloor({x: sector.x, y: sector.y});
        break;
      }
    } //end for
    if(sector){
      ({x,y}=sector);
      sectors.push(sector);
      sector = null;
    }else{
      ({x,y}=sectors.pop());
    } //end if
  }while(x!==x1||y!==y1);
}
