export function isPrefabEntryDoor({prefab}){
  const {height,width} = prefab.details;

  return prefab.data[height-1][Math.floor(width/2)]==='+';
} //end isPrefabEntryDoor()
