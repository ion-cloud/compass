export class ExistenceMap{
  constructor(){
    this.list = {};
  }
  get({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    if(!this.list.hasOwnProperty(key)) return false;
    return true;
  }
  set({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    this.list[key] = true;
  }
  setMany(existenceMap){
    if(!(existenceMap instanceof ExistenceMap)){
      throw new Error('setMany requires an ExistenceMap as parameter');
    }
    Object.keys(existenceMap.list).forEach(key=>{
      this.list[key] = true;
    });
  }
  getAll(){
    return Object.keys(this.list)
      .map(key=>{
        const [,xs,ys] = key.split(/x|y/g);

        return {x:+xs,y:+ys};
      });
  }
  reset(){
    this.list = {};
  }
  clone(){
    return Object.keys(this.list).reduce((sectors,key)=>{
      sectors.list[key] = this.list[key];
    },new ExistenceMap());
  }
}
