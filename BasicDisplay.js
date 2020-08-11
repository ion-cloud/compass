const l0 = 0, l1 = 31, l2 = 46, l3 = 82, l4 = 255, //shade levels
      colors = {
        empty: [l0,l0,l0,l4],
        removed: [l3,l2,l0,l4],
        doorClosed: [l3,l2,l0,l4],
        doorOpen: [l3,l2,l0,l4],
        wall: [l1,l1,l1,l4],
        wallSpecial: [l2,l2,l2,l4],
        water: [l2,l2,l3,l4],
        waterSpecial: [l1,l1,l2,l4],
        floor: [l2,l3,l2,l4],
        floorSpecial: [l3,l3,l2,l4],
        window: [l3,l1,l3,l4],
        default: [l4,l0,l0,l4]
      },
      colorHandler = {
        get: function(target, prop, receiver) {
          let color;

          if(!target.hasOwnProperty(prop)){
            color = target.default;
          }else{
            color = target[prop];
          } //end if
          return `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        }
      },
      colorProxy = new Proxy(colors, colorHandler);

export class BasicDisplay{
  constructor({map,easel}){
    this.map = map;
    this.easel = easel;
  }
  draw(){
    const h = this.easel.viewport.h/this.map.height,
          w = this.easel.viewport.w/this.map.width;

    // create a map of all sector type rects
    this.map.sectors.getAll().forEach(sector=>{
      const {x,y,category} = sector,
            color = colorProxy[category];

      this.easel.ctx.fillStyle = color;
      this.easel.ctx.fillRect(x*w,y*h,w,h);
    })
  }
}
