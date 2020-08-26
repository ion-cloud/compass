// test that the entire path passes the specified test function
// and return a boolean
export function isPath({
  map,path=[],onTest=()=>true
}={}){
  if(!path.length){
    return false;
  }else if(
    !path
      .slice(1,path.length)
      .every(p=> onTest(map.getSector(p)))
  ){
    return false;
  } //end if
  return true;
} //end isPath()
