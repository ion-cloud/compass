import './index.styl';
import {EaselWebGL} from '@ion-cloud/core';
import {Map,maps,BasicWebGLDisplay} from '../../index';

const easel = new EaselWebGL(),
      map = new Map({width:100,height:100}),
      display = new BasicWebGLDisplay({easel,map}),
      select = document.createElement('select'),
      startingMapName = 'patterned rooms';

easel.onDraw = function(){ display.draw(); };
maps.forEach(map=>{
  const option = document.createElement('option');

  option.value=map.name;
  option.innerText=map.name;
  select.appendChild(option);
});
document.body.appendChild(select);
select.addEventListener('change',function(e){
  drawMap(e.target.value);
});
select.value = startingMapName;
drawMap(startingMapName);

function drawMap(name){
  const {generator} = maps.find(map=>map.name===name);

  map.reset();
  generator({map});
  easel.redraw();
} //end drawMap()
