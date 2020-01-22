import {normalSquare,normalCircle} from './normal';
import {marshSquare,marshCircle} from './marsh';
import {islandSquare,islandCircle} from './island';
import {islandWalkwaysSquare,islandWalkwaysCircle} from './islandWalkways';
import {waterPoolSquare,waterPoolCircle} from './waterPool';

export const rooms = [
  normalSquare,normalCircle,
  marshSquare,marshCircle,
  islandSquare,islandCircle,
  islandWalkwaysSquare,islandWalkwaysCircle,
  waterPoolSquare,waterPoolCircle
];
