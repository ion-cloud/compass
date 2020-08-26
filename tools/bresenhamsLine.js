// uses bresenhams line algorithm to acquire an array of points
// inclusively between A(x1,y1) and B(x2,y2)
export function bresenhamsLine({
  x1=0,y1=0,x2=0,y2=0,state={},
  onStart=()=>{},
  onTest=()=>{return true;},
  onSuccess=()=>{},
  onFailure=()=>{},
  onEach=()=>{},
  onFinish=()=>{},
  exitOnFailure=true
}={}){
  const dx = Math.abs(x2 - x1),
        dy = Math.abs(y2 - y1),
        sx = x1 < x2 ? 1 : -1,
        sy = y1 < y2 ? 1 : -1;

  let [x,y] = [x1,y1],
      error = dx - dy,
      error2;

  onStart({x,y,x1,y1,x2,y2,state});
  do{
    onEach({x,y,x1,y1,x2,y2,state});
    if(!state.failing&&onTest({x,y,x1,y1,x2,y2,state})){
      onSuccess({x,y,x1,y1,x2,y2,state});
    }else{
      state.failing = true;
      if(exitOnFailure) state.finished = true;
      onFailure({x,y,x1,y1,x2,y2,state});
    } //end if
    if(x==x2&&y==y2) state.finished = true;
    error2 = 2 * error;
    if(error2 > -dy){ error -= dy; x += sx; }
    if(error2 < dx){ error += dx; y += sy; }
  }while(!state.finished)
  onFinish({x,y,x1,y1,x2,y2,state});
  return state;
} //end bresenhamsLine()
