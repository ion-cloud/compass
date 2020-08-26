// loop through the entire maps sectors and group them into walkable
// areas based on the `test` function. The largest room will have
// `onSuccess` called on each sector, all smaller rooms will have
// `onFailure` called on each sector, all sectors that didn't pass test
// will have `onHardFailure` called on each sector
export function clipOrphaned({
  map,
  onTest=()=>true,
  onFailure=()=>true,
  onSuccess=()=>true,
  onHardFailure=()=>true
}={}){
  const locStats = {val: 0,cur: 0,num: 0,max: 0},
        unmapped = [];

  // we have to start by removing roomNumbers if they exist because
  // we run this function more than once
  map.sectors.getAll().forEach(sector=>{
    sector.roomNumber = 0;
  });
  map.sectors.getAll().forEach(sector=>{
    const sectorX = sector.x,
          sectorY = sector.y;

    if(onTest(sector)&&!sector.roomNumber){
      locStats.cur++; locStats.val = 1; //init new room
      let newLoc = {x:sectorX,y:sectorY,id: locStats.cur},
          x, y;

      do{
        ({x,y}=newLoc);
        if(
          map.isInbounds({x: x-1,y})&&!map.getRoom({x: x-1,y})&&
          onTest(map.getSector({x: x-1,y}))
        ){
          unmapped.push({x: x-1, y});
          map.setRoom({x: x-1,y,id: -1});
        } //end if
        if(
          map.isInbounds({x,y: y-1})&&!map.getRoom({x,y: y-1})&&
          onTest(map.getSector({x,y: y-1}))
        ){
          unmapped.push({x,y: y-1});
          map.setRoom({x,y: y-1,id: -1});
        } //end if
        if(
          map.isInbounds({x: x+1,y})&&!map.getRoom({x: x+1,y})&&
          onTest(map.getSector({x: x+1,y}))
        ){
          unmapped.push({x: x+1, y});
          map.setRoom({x: x+1,y,id: -1});
        } //end if
        if(
          map.isInbounds({x,y: y+1})&&!map.getRoom({x,y: y+1})&&
          onTest(map.getSector({x,y: y+1}))
        ){
          unmapped.push({x,y: y+1});
          map.setRoom({x,y: y+1,id: -1});
        } //end if
        map.setRoom({x,y,id: locStats.cur});
        locStats.val++;
        if(locStats.val>locStats.max){
          locStats.max=locStats.val;
          locStats.num=locStats.cur;
        } //end manage maximum mass
        newLoc = unmapped.pop();
      }while(newLoc!==undefined)
    } //end if
  });
  map.sectors.getAll().forEach(sector=>{
    if(onTest(sector)&&sector.roomNumber!==locStats.num){
      onFailure(sector);
    }else if(onTest(sector)&&sector.roomNumber===locStats.num){
      onSuccess(sector);
    }else{
      onHardFailure(sector);
    } //end if
  });
} //end surroundSectors()
