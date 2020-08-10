import {Sector} from './Sector';

export class SectorMap{
  constructor(){
    this.list = {};
  }
  get({x=0,y=0}={}){
    const key = `x${x}y${y}`;

    if(!this.list.hasOwnProperty(key)) this.list[key] = new Sector({x,y});
    return this.list[key];
  }
  getAll(){
    const sectors = Object.keys(this.list).map(key=> this.list[key]);
    return sectors;
  }
  reset(){
    this.list = {};
  }
  clone(){
    return Object.keys(this.list).reduce((sectors,key)=>{
      sectors.list[key] = this.list[key].clone();
      return sectors;
    },new SectorMap());
  }
}
