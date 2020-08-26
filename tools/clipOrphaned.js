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

  // we have to start by removing _cs if they exist because
  // we run this function more than once
  map.sectors.getAll().forEach(sector=>{
    sector._c = 0;
  });
  map.sectors.getAll().forEach(sector=>{
    if(onTest(sector)&&!sector._c){
      locStats.cur++; locStats.val = 1; //init new room
      let {x,y} = sector,
          newLoc = {x,y,id: locStats.cur},
          s;

      do{
        ({x,y}=newLoc);
        s = map.getSector({x,y},'west');
        if(map.isInbounds(s)&&!s._c&&onTest(s)){
          unmapped.push(s);
          s._c=-1;
        } //end if
        s = map.getSector({x,y},'north');
        if(map.isInbounds(s)&&!s._c&&onTest(s)){
          unmapped.push(s);
          s._c=-1;
        } //end if
        s = map.getSector({x,y},'east');
        if(map.isInbounds(s)&&!s._c&&onTest(s)){
          unmapped.push(s);
          s._c=-1;
        } //end if
        s = map.getSector({x,y},'south');
        if(map.isInbounds(s)&&!s._c&&onTest(s)){
          unmapped.push(s);
          s._c=-1;
        } //end if
        s = map.getSector({x,y});
        s._c=locStats.cur;
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
    if(onTest(sector)&&sector._c!==locStats.num){
      onFailure(sector);
    }else if(onTest(sector)&&sector._c===locStats.num){
      onSuccess(sector);
    }else{
      onHardFailure(sector);
    } //end if
  });
} //end surroundSectors()
