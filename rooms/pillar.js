import {roomGetUniqueExits} from '../utilities/roomGetUniqueExits';
import {isRect} from '../tools/isRect';
import {fillRect} from '../tools/fillRect';
import {getNeighbors} from '../tools/getNeighbors';

export const pillarSquare = {
  name: 'pillar square',
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
    const width = x2-x1,
          height = y2-y1;

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
        if(width>=4&&height>=4){
          if(
            width%2==1&&
            (
              Math.abs(width/2-(x-x1))<1&&width!==7&&
              Math.abs(height/2-(y-y1))<1&&height!==7||
              (x-x1)==2&&(y-y1)==2||
              (x-x1)==2&&(height-(y-y1))==2||
              (y-y1)==2&&(width-(x-x1))==2||
              (height-(y-y1))==2&&(width-(x-x1))==2
            )
          ){
            return sector.setWall();
          }else if(
            width%2==0&&
            (x-x1)%2==0&&(y-y1)%2==0&&
            width-(x-x1)>1&&height-(y-y1)>1&&
            !(
              width>4&&
              Math.abs(width/2-(x-x1))>2||
              height>4&&
              Math.abs(height/2-(y-y1))>2
            )&&
            !(
              width==8&&Math.abs(width/2-(x-x1))==0&&
              height==8&&Math.abs(height/2-(y-y1))==0
            )
          ) return sector.setWall();
        } //end if
        sector.setFloor();
      }
    });
    return {success:true,exits:roomGetUniqueExits({map,exits,roomDirection})};
  }
};

export const pillarCircle = {
  name: 'pillar circle',
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
    const width = x2-x1,
          height = y2-y1;

    fillRect({
      map,x1,y1,x2,y2,
      onTest:sector=>{
        if(sector.isDoor()){
          failed.push(sector);
          return false;
        } //end if
        const width = Math.abs(sector.x-centerX),
              height = Math.abs(sector.y-centerY),
              halfX = (x2-x1-1.5)/2,
              halfY = (y2-y1-1.5)/2,
              hypotenuse = Math.sqrt(Math.pow(width,2)+Math.pow(height,2)),
              theta = Math.asin(height/hypotenuse),
              p1 = Math.pow(halfX,2)*Math.pow(Math.sin(theta),2),
              p2 = Math.pow(halfY,2)*Math.pow(Math.cos(theta),2),
              foci = (halfX*halfY)/Math.sqrt(p1+p2),
              {x,y} = sector;

        if(x===x1&&y===Math.ceil(y1+halfY)) exits.west.push(sector);
        if(x===x2&&y===Math.ceil(y1+halfY)) exits.east.push(sector);
        if(y===y1&&x===Math.ceil(x1+halfX)) exits.north.push(sector);
        if(y===y2&&x===Math.ceil(x1+halfX)) exits.south.push(sector);
        if(hypotenuse<foci||isNaN(foci)) return true;
        failed.push(sector);
        return false;
      },
      onDraw:sector=>{
        const {x,y} = sector;

        if(width>=4&&height>=4){
          if(
            width%2==1&&width>5&&
            (
              Math.abs(width/2-(x-x1))<1&&width!==7&&
              Math.abs(height/2-(y-y1))<1&&height!==7||
              (x-x1)==2&&(y-y1)==2||
              (x-x1)==2&&(height-(y-y1))==2||
              (y-y1)==2&&(width-(x-x1))==2||
              (height-(y-y1))==2&&(width-(x-x1))==2
            )
          ){
            return sector.setWall();
          }else if(
            width>5&&
            width%2==0&&
            (x-x1)%2==0&&(y-y1)%2==0&&
            width-(x-x1)>1&&height-(y-y1)>1&&
            !(
              width>4&&
              Math.abs(width/2-(x-x1))>2||
              height>4&&
              Math.abs(height/2-(y-y1))>2
            )&&
            !(
              width==8&&Math.abs(width/2-(x-x1))==0&&
              height==8&&Math.abs(height/2-(y-y1))==0
            )
          ) return sector.setWall();
        } //end if
        sector.setFloor();
      }
    });
    failed.forEach(sector=>{
      if(
        sector.isEmpty()&&
        getNeighbors({
          map,sector,test:sector=>sector.isFloor()
        }).length
      ) sector.setWall();
    });
    return {success:true,exits:roomGetUniqueExits({map,exits,roomDirection})};
  }
};
