export function isTouching({
  x1=0,y1=0,x2=0,y2=0
}={}){
  if(
    x1===x2&&y1===y2||
    x1===x2&&y1===y2-1||
    x1===x2&&y1===y2+1||
    x1===x2-1&&y1===y2||
    x1===x2+1&&y1===y2||
    x1===x2-1&&y1===y2-1||
    x1===x2+1&&y1===y2-1||
    x1===x2+1&&y1===y2+1||
    x1===x2-1&&y1===y2-1
  ){
    return true;
  } //end if
  return false;
} //end isTouching()
