// test rect to see if `test(sector)` is true
export function isRect({
  map,sector={x:0,y:0},size=1,
  x1=sector.x-size,y1=sector.y-size,
  x2=sector.x+size,y2=sector.y+size,
  hasAll=null,hasOne=null
}={}){
  if(hasAll===null&&hasOne===null) throw new Error('isRect requires hasAll or hasOne');
  if(x1===1&&y1===1) console.log({x1,y1,x2,y2});
  const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

  for(let y = y1;y!==y2+dy;y+=dy){
    for(let x = x1;x!==x2+dx;x+=dx){
      const sector = map.getSector({x,y});

      if(
        !map.isInbounds(sector)||
        hasAll!==null&&
        map.isInbounds(sector)&&!hasAll(sector)
      ){
        return false; //exit early
      }else if(
        hasOne!==null&&
        map.isInbounds(sector)&&hasOne(sector)
      ){
        if(x1===2&&y1===2) console.log('true?');
        return true;
      } //end if
    } //end for
  } //end for
  return hasOne===null;
} //end isRect()
