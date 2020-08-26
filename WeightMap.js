export class WeightMap{
  constructor(){
    this.list = {};
  }
  get({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    if(!this.list.hasOwnProperty(key)) return null;
    return this.list[key]||0;
  }
  has({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    if(!this.list.hasOwnProperty(key)) return false;
    return true;
  }
  set({x=0,y=0,value=0}={}){
    const key = `x${x}y${y}`;

    this.list[key] = value;
  }
  setMany(weightMap){
    if(!(weightMap instanceof WeightMap)){
      throw new Error('setMany requires a WeightMap as parameter');
    }
    Object.keys(weightMap.list).forEach(key=>{
      this.list[key] = weightMap[key];
    });
  }
  getAll(){
    return Object.keys(this.list)
      .map(key=>{
        const [,xs,ys] = key.split(/x|y/g);

        return {x:+xs,y:+ys,value:this.list[key]};
      });
  }
  reset(){
    this.list = {};
  }
  clone(){
    return Object.keys(this.list).reduce((sectors,key)=>{
      sectors.list[key] = this.list[key];
    },new WeightMap());
  }
}
