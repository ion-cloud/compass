import {alluvialFan} from './alluvialFan';
import {arroyo} from './arroyo';
import {bornhardt} from './bornhardt';
import {braidedChannel} from './braidedChannel';
import {butte} from './butte';
import {caldera} from './caldera';
import {caverns} from './caverns';
import {chine} from './chine';
import {cliffs} from './cliffs';
import {clusteredRooms} from './clusteredRooms';
import {couloir} from './couloir';
import {cuesta} from './cuesta';
import {draw} from './draw';
import {esker} from './esker';
import {exhumedRiverChannel} from './exhumedRiverChannel';
import {fjord} from './fjord';
import {floodplain} from './floodplain';
import {glen} from './glen';
import {gulch} from './gulch';
import {gully} from './gully';
import {hogback} from './hogback';
import {marsh} from './marsh';
import {meander} from './meander';
import {mesa} from './mesa';
import {mogote} from './mogote';
import {organizedRooms} from './organizedRooms';
import {patternedRooms} from './patternedRooms';
import {ravine} from './ravine';
import {ruins} from './ruins';
import {strath} from './strath';
import {tepui} from './tepui';
import {turlough} from './turlough';
import {uvala} from './uvala';
import {wadi} from './wadi';

export const maps = [
  {name: 'alluvial fan', generator: alluvialFan},
  {name: 'arroyo', generator: arroyo},
  {name: 'bornhardt', generator: bornhardt},
  {name: 'braided channel', generator: braidedChannel},
  {name: 'butte', generator: butte},
  {name: 'caldera', generator: caldera},
  {name: 'caverns', generator: caverns},
  {name: 'chine', generator: chine},
  {name: 'cliffs', generator: cliffs},
  {name: 'clustered rooms', generator: clusteredRooms},
  {name: 'couloir', generator: couloir},
  {name: 'cuesta', generator: cuesta},
  {name: 'draw', generator: draw},
  {name: 'esker', generator: esker},
  {name: 'exhumed river channel', generator: exhumedRiverChannel},
  {name: 'fjord', generator: fjord},
  {name: 'floodplain', generator: floodplain},
  {name: 'glen', generator: glen},
  {name: 'gulch', generator: gulch},
  {name: 'gully', generator: gully},
  {name: 'hogback', generator: hogback},
  {name: 'marsh', generator: marsh},
  {name: 'meander', generator: meander},
  {name: 'mesa', generator: mesa},
  {name: 'mogote', generator: mogote},
  {name: 'organized rooms', generator: organizedRooms},
  {name: 'patterned rooms', generator: patternedRooms},
  {name: 'ravine', generator: ravine},
  {name: 'ruins', generator: ruins},
  {
    name: 'ruins - standard crypt',
    generator({map}){
      ruins({
        map,
        options:{
          rooms: [
            {
              name: 'normal square',
              weight: 16,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 30}
              ]
            },
            {
              name: 'marsh square',
              weight: 2,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'island walkways square',
              weight: 1,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'normal circle',
              weight: 10,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20}
              ]
            },
            {
              name: 'island circle',
              weight: 4,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20}
              ]
            },
            {
              name: 'island walkways circle',
              weight: 1,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20}
              ]
            },
            {
              name: 'water pool circle',
              weight: 2,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20}
              ]
            }
          ]
        }
      });
    }
  },
  {
    name: 'ruins - ancient crypt',
    generator({map}){
      ruins({
        map,
        options:{
          rooms: [
            {
              name: 'normal square',
              weight: 2,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'marsh square',
              weight: 8,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'island walkways square',
              weight: 2,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'normal circle',
              weight: 3,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'marsh circle',
              weight: 8,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'island circle',
              weight: 2,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'island walkways circle',
              weight: 1,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'water pool circle',
              weight: 1,
              sizes: [
                {size: 9, weight: 4},{size: 8, weight: 8},
                {size: 7, weight: 12},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            }
          ]
        }
      });
    }
  },
  {
    name: 'ruins - crypt catacombs',
    generator({map}){
      ruins({
        map,
        options:{
          rooms: [
            {
              name: 'normal square',
              weight: 8,
              sizes: [
                {size: 6, weight: 10},
                {size: 3, weight: 70},{size: 2, weight: 10}
              ]
            },
            {
              name: 'marsh square',
              weight: 1,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'island walkways square',
              weight: 0.5,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'water pool square',
              weight: 0.5,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            },
            {
              name: 'island square',
              weight: 0.5,
              sizes: [
                {size: 5, weight: 10},{size: 4, weight: 35},
                {size: 3, weight: 70},{size: 2, weight: 100}
              ]
            }
          ]
        }
      });
    }
  },
  {
    name: 'ruins - marshy dredge',
    generator({map}){
      ruins({
        map,
        options:{
          rooms: [
            {
              name: 'marsh square',
              weight: 2,
              sizes: [
                {size: 2, weight: 100}
              ]
            },
            {
              name: 'normal circle',
              weight: 2,
              sizes: [
                {size: 15, weight: 2},{size: 14, weight: 4},
                {size: 13, weight: 6},{size: 12, weight: 8},
                {size: 11, weight: 10},{size: 10, weight: 12},
                {size: 9, weight: 14},{size: 8, weight: 16},
                {size: 7, weight: 18},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'marsh circle',
              weight: 8,
              sizes: [
                {size: 15, weight: 2},{size: 14, weight: 4},
                {size: 13, weight: 6},{size: 12, weight: 8},
                {size: 11, weight: 10},{size: 10, weight: 12},
                {size: 9, weight: 14},{size: 8, weight: 16},
                {size: 7, weight: 18},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'island walkways circle',
              weight: 0.5,
              sizes: [
                {size: 15, weight: 2},{size: 14, weight: 4},
                {size: 13, weight: 6},{size: 12, weight: 8},
                {size: 11, weight: 10},{size: 10, weight: 12},
                {size: 9, weight: 14},{size: 8, weight: 16},
                {size: 7, weight: 18},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'water pool circle',
              weight: 0.5,
              sizes: [
                {size: 15, weight: 2},{size: 14, weight: 4},
                {size: 13, weight: 6},{size: 12, weight: 8},
                {size: 11, weight: 10},{size: 10, weight: 12},
                {size: 9, weight: 14},{size: 8, weight: 16},
                {size: 7, weight: 18},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'island circle',
              weight: 0.5,
              sizes: [
                {size: 15, weight: 2},{size: 14, weight: 4},
                {size: 13, weight: 6},{size: 12, weight: 8},
                {size: 11, weight: 10},{size: 10, weight: 12},
                {size: 9, weight: 14},{size: 8, weight: 16},
                {size: 7, weight: 18},{size: 6, weight: 20},
                {size: 5, weight: 45},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            }
          ]
        }
      });
    }
  },
  {
    name: 'ruins - wide passages',
    generator({map}){
      ruins({
        map,
        options:{
          rooms: [
            {
              name: 'normal circle',
              weight: 2,
              sizes: [
                {size: 15, weight: 4},{size: 13, weight: 6},
                {size: 11, weight: 8},{size: 9, weight: 10},
                {size: 7, weight: 12},{size: 5, weight: 14},
                {size: 3, weight: 16}
              ]
            },
            {
              name: 'marsh circle',
              weight: 8,
              sizes: [
                {size: 15, weight: 4},{size: 13, weight: 6},
                {size: 11, weight: 8},{size: 9, weight: 10},
                {size: 7, weight: 12},{size: 5, weight: 14}
              ]
            },
            {
              name: 'island walkways circle',
              weight: 0.5,
              sizes: [
                {size: 15, weight: 4},{size: 13, weight: 6},
                {size: 11, weight: 8},{size: 9, weight: 10},
                {size: 7, weight: 12},{size: 5, weight: 14}
              ]
            },
            {
              name: 'water pool circle',
              weight: 0.5,
              sizes: [
                {size: 15, weight: 4},{size: 13, weight: 6},
                {size: 11, weight: 8},{size: 9, weight: 10},
                {size: 7, weight: 12},{size: 5, weight: 14}
              ]
            },
            {
              name: 'island circle',
              weight: 0.5,
              sizes: [
                {size: 15, weight: 4},{size: 13, weight: 6},
                {size: 11, weight: 8},{size: 9, weight: 10},
                {size: 7, weight: 12},{size: 5, weight: 14}
              ]
            }
          ]
        }
      });
    }
  },
  {
    name: 'ruins - deep passages',
    generator({map}){
      ruins({
        map,
        options:{
          rooms: [
            {
              name: 'normal circle',
              weight: 8,
              sizes: [
                {size: 11, weight: 4},{size: 10, weight: 8},
                {size: 9, weight: 12},{size: 8, weight: 16},
                {size: 7, weight: 20},{size: 6, weight: 30},
                {size: 5, weight: 50},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'marsh circle',
              weight: 8,
              sizes: [
                {size: 11, weight: 4},{size: 10, weight: 8},
                {size: 9, weight: 12},{size: 8, weight: 16},
                {size: 7, weight: 20},{size: 6, weight: 30},
                {size: 5, weight: 50},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'island walkways circle',
              weight: 0.5,
              sizes: [
                {size: 11, weight: 4},{size: 10, weight: 8},
                {size: 9, weight: 12},{size: 8, weight: 16},
                {size: 7, weight: 20},{size: 6, weight: 30},
                {size: 5, weight: 50},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'water pool circle',
              weight: 0.5,
              sizes: [
                {size: 11, weight: 4},{size: 10, weight: 8},
                {size: 9, weight: 12},{size: 8, weight: 16},
                {size: 7, weight: 20},{size: 6, weight: 30},
                {size: 5, weight: 50},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            },
            {
              name: 'island circle',
              weight: 0.5,
              sizes: [
                {size: 11, weight: 4},{size: 10, weight: 8},
                {size: 9, weight: 12},{size: 8, weight: 16},
                {size: 7, weight: 20},{size: 6, weight: 30},
                {size: 5, weight: 50},{size: 4, weight: 70},
                {size: 3, weight: 100}
              ]
            }
          ]
        }
      });
    }
  },
  {name: 'strath', generator: strath},
  {name: 'tepui', generator: tepui},
  {name: 'turlough', generator: turlough},
  {name: 'uvala', generator: uvala},
  {name: 'wadi', generator: wadi}
];
