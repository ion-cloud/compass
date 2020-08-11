import './index.styl';
import {EaselWebGL} from '@ion-cloud/core';
import {Map,Sector,maps,BasicWebGLDisplay} from '../../index';

const easel = new EaselWebGL(),
      map = new Map({width:100,height:100}),
      display = new BasicWebGLDisplay({easel,map}),
      {generator} = maps.find(map=> map.name==='template - basic');

generator({map});
easel.onDraw = function(){ display.draw(); };
easel.redraw();
