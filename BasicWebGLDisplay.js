const l0 = 0.0, l1 = 0.12, l2 = 0.18, l3 = 0.32, l4 = 1.0, //shade levels
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
        void: [l4,l4,l4,l4],
        default: [l4,l0,l0,l4]
      },
      colorHandler = {
        get: function(target, prop, receiver) {
          if(!target.hasOwnProperty(prop)) return target.default;
          return target[prop];
        }
      },
      colorProxy = new Proxy(colors, colorHandler);

export class BasicWebGLDisplay{
  constructor({map,easel}){
    this.map = map;
    this.easel = easel;
  }
  draw(){
    const h = 1/(this.map.height-1),
          w = 1/(this.map.width-1),
          todo = {};

    // create a map of all sector type rects
    this.map.sectors.getAll().forEach(sector=>{
      const {x,y,category} = sector;

      if(!todo[category]) todo[category] = {color: colorProxy[category],rects:[]};
      todo[category].rects.push({x:x/this.map.width,y:y/this.map.height,w,h});
    })

    // for each sector type, draw it with a single vbo through webgl
    Object
      .keys(todo)
      .forEach(key=>{
        this.easel.fillMultiRect({rects:todo[key].rects,c:todo[key].color})
      });
  }
}
