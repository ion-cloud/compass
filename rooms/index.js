import {normalSquare,normalCircle} from './normal';
import {marshSquare,marshCircle} from './marsh';
import {islandSquare,islandCircle} from './island';
import {islandWalkwaysSquare,islandWalkwaysCircle} from './islandWalkways';
import {waterPoolSquare,waterPoolCircle} from './waterPool';
import {pillarSquare,pillarCircle} from './pillar';

export const rooms = [
  normalSquare,normalCircle,
  marshSquare,marshCircle,
  islandSquare,islandCircle,
  islandWalkwaysSquare,islandWalkwaysCircle,
  waterPoolSquare,waterPoolCircle,
  pillarSquare,pillarCircle
];
