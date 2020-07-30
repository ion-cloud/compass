import {prefabs} from '@ion-cloud/prefabs';

export function roomGetPossiblePrefabs({map}){
  return prefabs.filter(prefab=> prefab.details.width<map.width/2&&prefab.details.height<map.height/2);
} //end roomGetPossiblePrefabs()
