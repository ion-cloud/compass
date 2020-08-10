import './index.styl';
import {EaselWebGL} from '@ion-cloud/core';
import {Map,Sector,maps} from '../../index';
export const easel = new EaselWebGL();

// Launch application if easel was able to create a canvas,
// if it wasn't then we know canvas isn't supported
const noscript = document.querySelector('noscript');

if(!easel.activated){
  noscript.innerHTML = `
  <p class="browsehappy">
    You are using an outdated browser. Please
    <a href="http://browsehappy.com/"> upgrade your browser</a>
    to improve your experience.
    <span style="color:red;"><br/>Canvas isn't supported in your browser.</span>
  </p>`;
}else{
  noscript.style.display='none';
  const map = new Map({width:100,height:100}),
        {generator} = maps.find(map=> map.name==='wadi');

  generator({map});

  easel.onDraw = function(){
    const h = 1/(map.height-1),
          w = 1/(map.width-1),
          l1 = 0.12,
          l2 = 0.18,
          l3 = 0.32;

    let color;

    map.sectors.getAll().forEach(sector=>{
      const {x,y} = sector;

      if(sector.isEmpty()||sector.isVoid()){
        color = [0.0,0.0,0.0,1.0];
      }else if(sector.isRemoved()){
        color = [l3,l1,l1,1.0];
      }else if(sector.isDoor()){
        color = [l3,l2,0.0,1.0];
      }else if(sector.isWallSpecial()){
        color = [l2,l2,l2,1.0];
      }else if(sector.isWall()){
        color = [l1,l1,l1,1.0];
      }else if(sector.isWaterSpecial()){
        color = [l1,l1,l2,1.0];
      }else if(sector.isWater()){
        color = [l2,l2,l3,1.0];
      }else if(sector.isFloorSpecial()){
        color = [l3,l3,l2,1.0];
      }else if(sector.isFloor()){
        color = [l2,l3,l2,1.0];
      }else{ //unknown
        color = [1.0,0.0,0.0,1.0];
      } //end if
      easel.fillRect({x:x/map.width,y:y/map.height,w,h,c:color});
    });
  };
  easel.redraw();
} //end if
