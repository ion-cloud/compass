import {fillRect} from './fillRect';
import {iterateRect} from './iterateRect';
import {WeightMap} from '../WeightMap';

// loop through the entire maps sectors and group them into walkable
// areas based on the `test` function. The largest room will have
// `onSuccess` called on each sector, all smaller rooms will have
// `onFailure` called on each sector, all sectors that didn't pass test
// will have `onHardFailure` called on each sector
export function clipOrphaned({
  map,
  x1=map.startX,y1=map.startY,x2=map.width-1,y2=map.height-1,
  onTest=()=>true,
  onFailure=()=>true,
  onSuccess=()=>true,
  onHardFailure=()=>true
}={}){
  const locStats = {val: 0,cur: 0,num: 0,max: 0},
        unmapped = [],
        state = new WeightMap();

  // we have to start by removing _cs if they exist because
  // we run this function more than once
  iterateRect({x1, y1, x2, y2, onDraw:({x,y})=> state.set({x,y,value:0})});
  iterateRect({
    x1, y1, x2, y2,
    onEach(sector){
      if(onTest(map.getSector(sector))&&!state.get(sector)){
        locStats.cur++; locStats.val = 1; //init new room
        let {x,y} = sector,
            newLoc = {x,y,id: locStats.cur},
            s;

        do{
          ({x,y}=newLoc);
          s = map.getSector({x,y},'west');
          if(map.isInbounds(s)&&!state.get({x:s.x,y:s.y})&&onTest(s)){
            unmapped.push({x:s.x,y:s.y});
            state.set({x:s.x,y:s.y,value:-1});
          } //end if
          s = map.getSector({x,y},'north');
          if(map.isInbounds(s)&&!state.get({x:s.x,y:s.y})&&onTest(s)){
            unmapped.push({x:s.x,y:s.y});
            state.set({x:s.x,y:s.y,value:-1});
          } //end if
          s = map.getSector({x,y},'east');
          if(map.isInbounds(s)&&!state.get({x:s.x,y:s.y})&&onTest(s)){
            unmapped.push({x:s.x,y:s.y});
            state.set({x:s.x,y:s.y,value:-1});
          } //end if
          s = map.getSector({x,y},'south');
          if(map.isInbounds(s)&&!state.get({x:s.x,y:s.y})&&onTest(s)){
            unmapped.push({x:s.x,y:s.y});
            state.set({x:s.x,y:s.y,value:-1});
          } //end if
          s = map.getSector({x,y});
          state.set({x,y,value:locStats.cur});
          locStats.val++;
          if(locStats.val>locStats.max){
            locStats.max=locStats.val;
            locStats.num=locStats.cur;
          } //end manage maximum mass
          newLoc = unmapped.pop();
        }while(newLoc!==undefined)
      } //end if
    }
  })
  fillRect({
    map, x1, y1, x2, y2,
    onDraw(sector){
      if(onTest(sector)&&state.get({x:sector.x,y:sector.y})!==locStats.num){
        onFailure(sector);
      }else if(onTest(sector)&&state.get({x:sector.x,y:sector.y})===locStats.num){
        onSuccess(sector);
      }else{
        onHardFailure(sector);
      } //end if
    }
  });
} //end surroundSectors()
