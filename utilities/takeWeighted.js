// expects array of objects that contain attribute `weight` of type Number
export function takeWeighted(array){
  let weightPool = array.map(c=>c.weight).reduce((p,c)=>p+c),
      randomWeight = Math.random()*weightPool;

  return array.find(option=>{
    let result = false;

    randomWeight-=option.weight;
    if(randomWeight<=0) result = option;
    return result;
  });
} //end takeWeighted()
