import {normalSquare,normalCircle} from './normal';
import {islandSquare,islandCircle} from './island';
import {islandWalkwaysSquare,islandWalkwaysCircle} from './islandWalkways';
import {waterPoolSquare,waterPoolCircle} from './waterPool';
import {pillarSquare,pillarCircle} from './pillar';
import {prefab} from './prefab';

export const rooms = [
  normalSquare,normalCircle,
  islandSquare,islandCircle,
  islandWalkwaysSquare,islandWalkwaysCircle,
  waterPoolSquare,waterPoolCircle,
  pillarSquare,pillarCircle,
  prefab
];
