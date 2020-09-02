# compass
JavaScript mapping classes and random generation algorithms	JavaScript mapping classes and random generation algorithms

![main example](/examples/example_template.png)
## Table of Contents
- [Setup](#setup)
- [Usage](#usage)
  - [WebGL Canvas](#webgl-canvas)
  - [2d Canvas](#2d-canvas)
- [Examples](#examples)
  - [Templates](#templates)
    - [Template - Ancient Crypt](#template---ancient-crypt)
    - [Template - Basic](#template---basic)
    - [Template - Caverns](#template---caverns)
    - [Template - Crypt Catacombs](#template---crypt-catacombs)
    - [Template - Marsh](#template---marsh)
    - [Template - Passages](#template---passages)
    - [Template - Standard Crypt](#template---standard-crypt)
    - [Template - Tunnels](#template---tunnels)
  - [Basic](#basic)
    - [Clustered Rooms - Default](#clustered-rooms---default)
    - [Clustered Rooms - Small](#clustered-rooms---small)
    - [Clustered Rooms - Large](#clustered-rooms---large)
    - [Clustered Rooms - Long Hallways](#clustered-rooms---long-hallways)
    - [Clustered Rooms - Wild](#clustered-rooms---wild)
    - [Clustered Rooms - Winding](#clustered-rooms-winding)
    - [Diffuse Corridors - Default](#diffuse-corridors---default)
    - [Diffuse Corridors - Catacombs](#diffuse-corridors---catacombs)
    - [Diffuse Corridors - Connected](#diffuse-corridors---connected)
    - [Diffuse Corridors - Deadends](#diffuse-corridors---deadends)
    - [Diffuse Corridors - External](#diffuse-corridors---external)
    - [Diffuse Corridors - Separated](#diffuse-corridors---separated)
    - [Organized Rooms](#organized-rooms)
    - [Patterned Rooms](#patterned-rooms)
  - [Landforms](#landforms)
    - [Alluvial fan](#alluvial-fan)
    - [Arroyo](#arroyo)
    - [Bornhardt](#bornhardt)
    - [Braided Channel](#braided-channel)
    - [Butte](#butte)
    - [Caldera](#caldera)
    - [Caverns](#caverns)
    - [Chine](#chine)
    - [Cliffs](#cliffs)
    - [Couloir](#couloir)
    - [Cuesta](#cuesta)
    - [Draw](#draw)
    - [Hogback](#hogback)
    - [Esker](#esker)
    - [Exhumed River Channel](#exhumed-river-channel)
    - [Fjord](#fjord)
    - [Floodplain](#floodplain)
    - [Glen](#glen)
    - [Gulch](#gulch)
    - [Gully](#gully)
    - [Marsh](#marsh)
    - [Meander](#meander)
    - [Mesa](#mesa)
    - [Mogote](#mogote)
    - [Ravine](#ravine)
    - [Strath](#strath)
    - [Tepui](#tepui)
    - [Turlough](#turlough)
    - [Uvala](#uvala)
    - [Wadi](#wadi)
## Setup
Getting started is as easy as `npm i @ion-cloud/compass --save` and then `importing` the required modules into your app with `import {Map,Sector,maps} from '@ion-cloud/compass'`. 

Please see code example [here](https://github.com/ion-cloud/compass/blob/master/demo/src/index.js).

## Usage
### WebGL Canvas
```
import {EaselWebGL} from '@ion-cloud/easel';
import {Map,maps,BasicWebGLDisplay} from '@ion-cloud/compass';

const easel = new EaselWebGL(),
      map = new Map({width:100,height:100}),
      display = new BasicWebGLDisplay({easel,map}),
      {generator} = maps.find(map=> map.name==='template - basic');

generator({map});
easel.onDraw = function(){ display.draw(); };
easel.redraw();
```
### 2d Canvas
```
import {Easel} from '@ion-cloud/core';
import {Map,maps,BasicDisplay} from '@ion-cloud/compass';

const easel = new Easel(),
      map = new Map({width:100,height:100}),
      display = new BasicDisplay({easel,map}),
      {generator} = maps.find(map=> map.name==='template - basic');

generator({map});
easel.onDraw = function(){ display.draw(); };
easel.redraw();
```
## Examples
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
### Basic
#### Clustered Rooms - Default
![Clustered Rooms](examples/example_clustered_rooms_default.png)
#### Clustered Rooms - Small
![Clustered Rooms](examples/example_clustered_rooms_small.png)
#### Clustered Rooms - Large
![Clustered Rooms](examples/example_clustered_rooms_large.png)
#### Clustered Rooms - Long Hallways
![Clustered Rooms](examples/example_clustered_rooms_long_hallways.png)
#### Clustered Rooms - Wild
![Clustered Rooms](examples/example_clustered_rooms_wild.png)
#### Clustered Rooms - Winding
![Clustered Rooms](examples/example_clustered_rooms_winding.png)
#### Diffuse Corridors - Default
![Diffuse Corridors](examples/example_diffuse_corridors.png)
#### Diffuse Corridors - Catacombs
![Diffuse Corridors](examples/example_diffuse_corridors_catacombs.png)
#### Diffuse Corridors - Connected
![Diffuse Corridors](examples/example_diffuse_corridors_connected.png)
#### Diffuse Corridors - Deadends
![Diffuse Corridors](examples/example_diffuse_corridors_deadends.png)
#### Diffuse Corridors - External
![Diffuse Corridors](examples/example_diffuse_corridors_external.png)
#### Diffuse Corridors - Separated
![Diffuse Corridors](examples/example_diffuse_corridors_separated.png)
#### Organized Rooms
![Organized Rooms](examples/example_organized_rooms.png)
#### Patterned Rooms
![Patterned Rooms](examples/example_patterned_rooms.png)
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
#### Meander
![Meander](examples/example_meander.png)
#### Mesa
![Mesa](examples/example_mesa.png)
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
