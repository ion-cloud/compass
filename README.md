# compass
JavaScript mapping classes and random generation algorithms	JavaScript mapping classes and random generation algorithms

![main example](/examples/example_template_basic.png)
## Setup
Getting started is as easy as `npm i @ion-cloud/compass --save` and then `importing` the required modules into your app with `import {Map,Sector,maps} from '@ion-cloud/compass'`. 

Please see code example [here](https://github.com/ion-cloud/compass/blob/master/demo/src/index.js).

## Usage
```
import {Easel,Map,Sector,maps} from '@ion-cloud/core';
export const easel = new Easel();

const map = new Map(50,50),
      arroyo = maps.find(map=> map.name==='arroyo');

for(let y=0;y<map.height;y++){
  map.sectors[y]=[];
  for(let x=0;x<map.width;x++){
    map.sectors[y][x]=new Sector({x,y,map});
  } //end for
} //end for
arroyo.generator({map});
easel.onDraw = function(){
  const rh = easel.viewport.h/map.height, rw = easel.viewport.w/map.width;

  map.sectors.forEach((row,y)=>{
    row.forEach((sector,x)=>{
      if(sector.isEmpty()){
        easel.ctx.fillStyle='#000';
      }else if(sector.isRemoved()){
        easel.ctx.fillStyle='#833';
      }else if(sector.isDoor()){
        easel.ctx.fillStyle='#b94';
      }else if(sector.isWallSpecial()){
        easel.ctx.fillStyle='#445';
      }else if(sector.isWall()){
        easel.ctx.fillStyle='#334';
      }else if(sector.isWaterSpecial()){
        easel.ctx.fillStyle='#339';
      }else if(sector.isWater()){
        easel.ctx.fillStyle='#33b';
      }else if(sector.isFloorSpecial()){
        easel.ctx.fillStyle='#563';
      }else if(sector.isFloor()){
        easel.ctx.fillStyle='#373';
      }else{ //unknown
        easel.ctx.fillStyle='#f00';
      } //end if

      // the -0.4 & +0.8 is to remove sub-pixel issues
      // that might cause lines to appear between cells
      easel.ctx.fillRect(x*rw+0.4,y*rh+0.4,rw+0.8,rh+0.8);
    });
  });
};
easel.redraw();
```
## Examples
### Basic
#### Clustered Rooms
![Clustered Rooms](examples/example_clustered_rooms.png)
#### Organized Rooms
![Organized Rooms](examples/example_organized_rooms.png)
#### Patterned Rooms
![Patterned Rooms](examples/example_patterned_rooms.png)
### Templates
#### Template - Ancient Crypt
![Template Ancient Crypt](examples/example_template_ancient_crypt.png)
#### Template - Basic
![Template Basic](examples/example_template_basic.png)
#### Template - Caverns
![Template Caverns](examples/example_template_caverns.png)
#### Template - Crypt Catacombs
![Template Crypt Catacombs](examples/example_template_crypt_catacombs.png)
#### Template - Marsh
![Template Marsh](examples/example_template_marsh.png)
#### Template - Passages
![Template Passages](examples/example_template_passages.png)
#### Template - Standard Crypt
![Template Standard Crypt](examples/example_template_standard_crypt.png)
#### Template - Tunnels
![Template Tunnels](examples/example_template_tunnels.png)
### Landforms
#### Alluvial Fan
![Alluvial Fan](examples/example_alluvial_fan.png)
#### Arroyo
![Arroyo](examples/example_arroyo.png)
#### Bornhardt
![Bornhardt](examples/example_bornhardt.png)
#### Braided Channel
![Braided Channel](examples/example_braided_channel.png)
#### Butte
![Butte](examples/example_butte.png)
#### Caldera
![Caldera](examples/example_caldera.png)
#### Caverns
![Caverns](examples/example_caverns.png)
#### Chine
![Chine](examples/example_chine.png)
#### Cliffs
![Cliffs](examples/example_cliffs.png)
#### Couloir
![Couloir](examples/example_couloir.png)
#### Cuesta
![Cuesta](examples/example_cuesta.png)
#### Draw
![Draw](examples/example_draw.png)
#### Hogback
![Hogback](examples/example_hogback.png)
#### Esker
![Esker](examples/example_esker.png)
#### Exhumed River Channel
![Exhumed River Channel](examples/example_river_channel.png)
#### Fjord
![Fjord](examples/example_fjord.png)
#### Floodplain
![Floodplain](examples/example_floodplain.png)
#### Glen
![Glen](examples/example_glen.png)
#### Gulch
![Gulch](examples/example_gulch.png)
#### Gully
![Gully](examples/example_gully.png)
#### Marsh
![Marsh](examples/example_marsh.png)
#### Mogote
![Mogote](examples/example_mogote.png)
#### Ravine
![Ravine](examples/example_ravine.png)
#### Strath
![Strath](examples/example_strath.png)
#### Tepui
![Tepui](examples/example_tepui.png)
#### Turlough
![Turlough](examples/example_turlough.png)
#### Uvala
![Uvala](examples/example_uvala.png)
#### Wadi
![Wadi](examples/example_wadi.png)
