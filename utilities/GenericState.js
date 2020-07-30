export class GenericState{
  constructor(args){
    Object.keys(args).forEach(name=>{
      this[name]=args[name];
    })
  }
}

