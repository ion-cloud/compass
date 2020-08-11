import './index.styl';
import {EaselWebGL} from '@ion-cloud/core';
import {Map,maps,BasicWebGLDisplay} from '../../index';

const easel = new EaselWebGL(),
      map = new Map({width:100,height:100}),
      display = new BasicWebGLDisplay({easel,map}),
      {generator} = maps.find(map=> map.name==='clustered rooms');

generator({map});
easel.onDraw = function(){ display.draw(); };
easel.redraw();
