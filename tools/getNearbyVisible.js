export function getNearbyVisible({
  map,x,y,includeBoundary=false
}={}){
  const result = [];

  if(!map.isInbounds({x,y})&&includeBoundary){
    if(x===-1&&y===-1&&map.isVisible({x:x+1,y:y+1})){
      result.push('north');result.push('west');
    }else if(x===-1&&y===map.height&&map.isVisible({x:x+1,y:y-1})){
      result.push('south');result.push('west');
    }else if(x===map.width&&y===-1&&map.isVisible({x:x-1,y:y+1})){
      result.push('north');result.push('east');
    }else if(x===map.width&&y===map.height&&map.isVisible({x:x-1,y:y-1})){
      result.push('south');result.push('east');
    }else if(x===-1&&(
      map.isVisible({x:x+1,y:y-1})||
      map.isVisible({x:x+1,y})||
      map.isVisible({x:x+1,y:y+1}))
    ){
      result.push('west');
    }else if(x===map.width&&(
      map.isVisible({x:x-1,y:y-1})||
      map.isVisible({x:x-1,y})||
      map.isVisible({x:x-1,y:y+1}))
    ){
      result.push('east');
    }else if(y===-1&&(
      map.isVisible({x:x-1,y:y+1})||
      map.isVisible({x,y:y+1})||
      map.isVisible({x:x+1,y:y+1}))
    ){
      result.push('north');
    }else if(y===map.height&&(
      map.isVisible({x:x-1,y:y-1})||
      map.isVisible({x,y:y-1})||
      map.isVisible({x:x+1,y:y-1}))
    ){
      result.push('south');
    } //end if
  }else{
    if(map.isVisible({x:x-1,y})) result.push('west');
    if(map.isVisible({x:x+1,y})) result.push('east');
    if(map.isVisible({x,y:y-1})) result.push('north');
    if(map.isVisible({x,y:y+1})) result.push('south');
  } //end if
  return result;
} //end getNearbyVisible()
