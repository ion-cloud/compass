# compass
JavaScript mapping classes and random generation algorithms	JavaScript mapping classes and random generation algorithms

## Setup
Getting started is as easy as `npm i @ion-cloud/compass --save` and then `importing` the required modules into your app with `import {Map,Sector,maps} from '@ion-cloud/compass'`. 

Please see code example [here](https://github.com/ion-cloud/compass/blob/master/demo/src/index.js).

## Usage
```
import {EaselWebGL} from '@ion-cloud/core';
import {Map,Sector,maps,BasicWebGLDisplay} from '../../index';

const easel = new EaselWebGL(),
      map = new Map({width:100,height:100}),
      display = new BasicWebGLDisplay({easel,map}),
      {generator} = maps.find(map=> map.name==='template - basic');

generator({map});
easel.onDraw = function(){ display.draw(); };
easel.redraw();
```
