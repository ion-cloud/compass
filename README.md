# compass
JavaScript mapping classes and random generation algorithms	JavaScript mapping classes and random generation algorithms

![main example](/examples/example_template_basic.png)
## Setup
Getting started is as easy as `npm i @ion-cloud/compass --save` and then `importing` the required modules into your app with `import {Map,Sector,maps} from '@ion-cloud/compass'`. 

Please see code example [here](https://github.com/ion-cloud/compass/blob/master/demo/src/index.js).

## Usage
```
import {EaselWebGL} from '@ion-cloud/easel';
import {Map,Sector,maps} from '@ion-cloud/compass';

const easel = new EaselWebGL(),
      map = new Map({width:100,height:100}),
      {generator} = maps.find(map=> map.name==='template - caverns');

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
