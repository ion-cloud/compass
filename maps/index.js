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
import {diffuseCorridors} from './diffuseCorridors';
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
import {template} from './template';
import {strath} from './strath';
import {tepui} from './tepui';
import {turlough} from './turlough';
import {uvala} from './uvala';
import {wadi} from './wadi';
import {templates} from '../templates/';

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
  {
    name: 'clustered rooms - wild',
    generator({map,x1,y1,x2,y2}){
      clusteredRooms({
        map,x1,y1,x2,y2,
        emptyWeight:1,floorWeight:2,otherWeight:5,
        hallwayLengthMean:3,hallwayLengthSigma:0.3,
        minRoomSize:2,maxRoomSize:2
      })
    }
  },
  {
    name: 'clustered rooms - winding',
    generator({map,x1,y1,x2,y2}){
      clusteredRooms({
        map,x1,y1,x2,y2,
        emptyWeight:5,floorWeight:4,otherWeight:20,
        hallwayLengthMean:6,hallwayLengthSigma:0.3,
        minRoomSize:3,maxRoomSize:3
      })
    }
  },
  {
    name: 'clustered rooms - large',
    generator({map,x1,y1,x2,y2}){
      clusteredRooms({
        map,x1,y1,x2,y2,
        minRoomSize:3,maxRoomSize:8,
        hallwayLengthMean:8
      })
    }
  },
  {
    name: 'clustered rooms - long hallways',
    generator({map,x1,y1,x2,y2}){
      clusteredRooms({
        map,x1,y1,x2,y2,
        hallwayLengthMean:15
      })
    }
  },
  {
    name: 'clustered rooms - small',
    generator({map,x1,y1,x2,y2}){
      clusteredRooms({
        map,x1,y1,x2,y2,
        minRoomSize:2,maxRoomSize:5,
        hallwayLengthMean:5
      })
    }
  },
  {name: 'couloir', generator: couloir},
  {name: 'cuesta', generator: cuesta},
  {name: 'diffuse corridors', generator: diffuseCorridors},
  {
    name: 'diffuse corridors - connected',
    generator({map,x1,y1,x2,y2}){
      diffuseCorridors({
        map,x1,y1,x2,y2,
        minSize:2,maxSize:5,connected:1
      });
    }
  },
  {
    name: 'diffuse corridors - separated',
    generator({map,x1,y1,x2,y2}){
      diffuseCorridors({
        map,x1,y1,x2,y2,
        minSize:2,maxSize:5,connected:0
      });
    }
  },
  {
    name: 'diffuse corridors - deadends',
    generator({map,x1,y1,x2,y2}){
      diffuseCorridors({
        map,x1,y1,x2,y2,
        minSize:5,maxSize:5,connected:0,
        deadends:true
      });
    }
  },
  {
    name: 'diffuse corridors - catacombs',
    generator({map,x1,y1,x2,y2}){
      diffuseCorridors({
        map,x1,y1,x2,y2,
        minSize:3,maxSize:3,connected:0,
        deadends:true
      });
    }
  },
  {
    name: 'diffuse corridors - external',
    generator({map,x1,y1,x2,y2}){
      diffuseCorridors({
        map,x1,y1,x2,y2,
        minSize:3,maxSize:3,connected:0,
        deadends:false
      });
    }
  },
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
  {name: 'strath', generator: strath},
  {name: 'tepui', generator: tepui},
  {name: 'turlough', generator: turlough},
  {name: 'uvala', generator: uvala},
  {name: 'wadi', generator: wadi},
  {
    name: 'template',
    generator({map}){
      const name = 'basic',
            {options} = templates.find(template=> template.name===name);

      template({map,options,name});
    }
  },
  ...templates.map(({name,options})=>{
    return {
      name: `template - ${name}`,
      generator({map}){
        template({map,options,name});
      }
    };
  })
];
