import {roomGetUniqueExits} from '../utilities/roomGetUniqueExits';

export const islandSquare = {
  name: 'island square',
  fn({map,roomDirection,x1,y1,x2,y2}){
    const exits = {
      north: [],
      south: [],
      east: [],
      west: []
    };

    if(!map.isRect({
      x1,y1,x2,y2,
      hasAll:sector=>{
        const {x,y} = sector;

        return sector.isEmpty()||(sector.isWall()||sector.isDoor())&&(
          x===x1||x===x2||y===y1||y===y2
        );
      }
    })) return {success:false};
    map.fillRect({
      x1,y1,x2,y2,
      draw:sector=>{
        const {x,y} = sector;

        if(sector.isDoor()) return;
        if(x===x1&&y!==y1&&y!==y2) exits.west.push(sector);
        if(x===x2&&y!==y1&&y!==y2) exits.east.push(sector);
        if(y===y1&&x!==x1&&x!==x2) exits.north.push(sector);
        if(y===y2&&x!==x1&&x!==x2) exits.south.push(sector);
        if(x===x1||x===x2||y===y1||y===y2) return sector.setWall();
        const width = x2-x1, height = y2-y1,
              distanceWeight = (
                Math.sqrt(Math.pow(width/2-(x-x1),2)+
                  Math.pow(height/2-(y-y1),2))
                /
                Math.sqrt(Math.pow(width/2,2)+
                  Math.pow(height/2,2))
              );

        if(
          Math.abs(1-distanceWeight)>0.75||
          Math.abs(1-distanceWeight)>0.6&&Math.random()<0.5
        ){
          sector.setWater();
        }else{
          sector.setFloor();
        } //end if
      }
    });
    return {success:true,exits: roomGetUniqueExits({map,exits,roomDirection})};
  }
};

export const islandCircle = {
  name: 'island circle',
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

    if(!map.isRect({
      x1,y1,x2,y2,
      hasAll:sector=>{
        const {x,y} = sector;

        return sector.isEmpty()||(sector.isWall()||sector.isDoor())&&(
          x===x1||x===x2||y===y1||y===y2
        );
      }
    })) return {success:false};
    map.fillRect({
      x1,y1,x2,y2,
      test:sector=>{
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
      draw:sector=>{
        const {x,y} = sector,
              width = x2-x1, height = y2-y1,
              quarterX = width/4, quarterY = height/4,
              distanceWeight = (
                Math.sqrt(Math.pow(width/2-(x-x1),2)+
                  Math.pow(height/2-(y-y1),2))
                /
                Math.sqrt(Math.pow(width/2,2)+
                  Math.pow(height/2,2))
              );

        if(
          Math.abs(1-distanceWeight)>0.75||
          Math.abs(1-distanceWeight)>0.6&&Math.random()<0.5
        ){
          sector.setWater();
        }else{
          sector.setFloor();
        } //end if
      }
    });
    failed.forEach(sector=>{
      if(
        sector.isEmpty()&&
        map.getNeighbors({
          sector,test:sector=>sector.isWalkable()
        }).length
      ) sector.setWall();
    });
    return {success:true,exits: roomGetUniqueExits({map,exits,roomDirection})};
  }
};
