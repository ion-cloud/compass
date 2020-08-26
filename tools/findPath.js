import {Heap} from '../Heap';
import {getNeighbors} from './getNeighbors';

// find a path between two points that passes the `onTest` function
// when applied to each sector
export function findPath({
  map,x1=0,y1=0,x2=0,y2=0,orthogonal=false,
  onTest=()=>true,
  computeWeight=sector=>1
}={}){
  const heuristic = (dx, dy) => dx + dy, //manhattan heuristic
        openList = new Heap([],(a,b)=> b.path.f-a.path.f>0),
        abs = Math.abs, //shorten reference
        touched = [], //list of sectors mutated so we can restore them
        SQRT2 = Math.SQRT2; //shorten reference

  if(!map.isInbounds({x:x1,y:y1})||!map.isInbounds({x:x2,y:y2})) return null;
  let node = map.getSector({x: x1,y: y1}); //acquire starting node

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
    const neighbors = getNeighbors({
      map, x: node.x,y: node.y, orthogonal, onTest
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
} //end findPath()
