import {roomGetUniqueExits} from '../utilities/roomGetUniqueExits';
import {isRect} from '../tools/isRect';
import {fillRect} from '../tools/fillRect';
import {getNeighbors} from '../tools/getNeighbors';

export const islandWalkwaysSquare = {
  name: 'island walkways square',
  fn({map,roomDirection,x1,y1,x2,y2}){
    const exits = {
      north: [],
      south: [],
      east: [],
      west: []
    };

    if(!isRect({
      map,x1,y1,x2,y2,
      hasAll:sector=>{
        const {x,y} = sector;

        return sector.isEmpty()||(sector.isWall()||sector.isDoor())&&(
          x===x1||x===x2||y===y1||y===y2
        );
      }
    })) return {success:false};
    fillRect({
      map,x1,y1,x2,y2,
      onDraw:sector=>{
        const {x,y} = sector;

        if(sector.isDoor()) return;
        if(x===x1&&y!==y1&&y!==y2) exits.west.push(sector);
        if(x===x2&&y!==y1&&y!==y2) exits.east.push(sector);
        if(y===y1&&x!==x1&&x!==x2) exits.north.push(sector);
        if(y===y2&&x!==x1&&x!==x2) exits.south.push(sector);
        if(x===x1||x===x2||y===y1||y===y2) return sector.setWall();
        const midX=(x2-x1)/2, midY= (y2-y1)/2,
              cx = Math.abs(x-x1-midX),
              cy = Math.abs(y-y1-midY),
              rn = Math.random()

        if(
          cx<0.7&&rn<0.75||cx<1.2&&rn<0.35||cx<1.7&&rn<0.15||
          cy<0.7&&rn<0.75||cy<1.2&&rn<0.35||cy<1.7&&rn<0.15
        ){
          sector.setFloor();
        }else{
          sector.setWater();
        } //end if
      }
    });
    return {success:true,exits:roomGetUniqueExits({map,roomDirection,exits})};
  }
};

export const islandWalkwaysCircle = {
  name: 'island walkways circle',
  fn({map,roomDirection,x1,y1,x2,y2}){
    const centerX = x1+(x2-x1)/2,
          centerY = y1+(y2-y1)/2,
          failed = [],
          exits = {
            north: [],
            south: [],
            east: [],
            west: []
          };

    if(!isRect({
      map,x1,y1,x2,y2,
      hasAll:sector=>{
        const {x,y} = sector;

        return sector.isEmpty()||(sector.isWall()||sector.isDoor())&&(
          x===x1||x===x2||y===y1||y===y2
        );
      }
    })) return {success:false};
    fillRect({
      map,x1,y1,x2,y2,
      onTest:sector=>{
        if(sector.isDoor()){
          failed.push(sector);
          return false;
        } //end if
        const {x,y} = sector,
              width = Math.abs(sector.x-centerX),
              height = Math.abs(sector.y-centerY),
              halfX = (x2-x1-1.5)/2,
              halfY = (y2-y1-1.5)/2,
              hypotenuse = Math.sqrt(Math.pow(width,2)+Math.pow(height,2)),
              theta = Math.asin(height/hypotenuse),
              p1 = Math.pow(halfX,2)*Math.pow(Math.sin(theta),2),
              p2 = Math.pow(halfY,2)*Math.pow(Math.cos(theta),2),
              foci = (halfX*halfY)/Math.sqrt(p1+p2);

        if(x===x1&&y===Math.ceil(y1+halfY)) exits.west.push(sector);
        if(x===x2&&y===Math.ceil(y1+halfY)) exits.east.push(sector);
        if(y===y1&&x===Math.ceil(x1+halfX)) exits.north.push(sector);
        if(y===y2&&x===Math.ceil(x1+halfX)) exits.south.push(sector);
        if(hypotenuse<foci||isNaN(foci)) return true;
        failed.push(sector);
        return false;
      },
      onDraw:sector=>{
        const {x,y} = sector,
              midX=(x2-x1)/2, midY= (y2-y1)/2,
              cx = Math.abs(x-x1-midX),
              cy = Math.abs(y-y1-midY),
              rn = Math.random()

        if(
          cx<0.7&&rn<0.75||cx<1.2&&rn<0.35||cx<1.7&&rn<0.15||
          cy<0.7&&rn<0.75||cy<1.2&&rn<0.35||cy<1.7&&rn<0.15
        ){
          sector.setFloor();
        }else{
          sector.setWater();
        } //end if
      }
    });
    failed.forEach(sector=>{
      if(
        sector.isEmpty()&&
        getNeighbors({
          map,sector,onTest:sector=>sector.isWalkable()
        }).length
      ) sector.setWall();
    });
    return {success:true,exits: roomGetUniqueExits({map,roomDirection,exits})};
  }
};
