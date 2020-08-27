export class ExistenceMap{
  constructor(){
    this.list = {};
  }
  get({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    if(!this.list.hasOwnProperty(key)) return false;
    return this.list[key];
  }
  set({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    this.list[key] = true;
  }
  unset({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    this.list[key] = false;
  }
  setMany(existenceMap){
    if(!(existenceMap instanceof ExistenceMap)){
      throw new Error('setMany requires an ExistenceMap as parameter');
    }
    Object.keys(existenceMap.list).forEach(key=>{
      this.list[key] = true;
    });
  }

  // only return those that are truthy
  getAll(){
    const list =  Object.keys(this.list)
      .reduce((array,key)=>{
        if(this.list[key]){
          const [,xs,ys] = key.split(/x|y/g);

          array.push({x:+xs,y:+ys});
        } //end if
        return array;
      },[]);
    return list;
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
