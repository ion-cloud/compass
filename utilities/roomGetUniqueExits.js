import {shuffle} from './shuffle';

// make sure we don't mark the entry direction as a potential todo,
// as well as make sure that only one exit door per direction leaves
// the room
export function roomGetUniqueExits({map,exits,roomDirection}){
  const uniqueExits = [];

  if(roomDirection!=='south'&&exits.north.length){
    const {x,y} = shuffle(exits.north).shift();

    uniqueExits.push({direction:'north',x,y});
  } //end if
  if(roomDirection!=='west'&&exits.east.length){
    const {x,y} = shuffle(exits.east).shift();

    uniqueExits.push({direction:'east',x,y});
  } //end if
  if(roomDirection!=='north'&&exits.south.length){
    const {x,y} = shuffle(exits.south).shift();

    uniqueExits.push({direction:'south',x,y});
  } //end if
  if(roomDirection!=='east'&&exits.west.length){
    const {x,y} = shuffle(exits.west).shift();

    uniqueExits.push({direction:'west',x,y});
  } //end if
  return uniqueExits;
} //end makeUniqueExit()
