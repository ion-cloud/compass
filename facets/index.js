import {meander} from './meander';

// can either import a specific facet with 
// import {meander} from './facets/';
// or you can choose randomly using the facets index
// import {facets} from './facets/';
// const randomFacet = facets[Math.random()*facets.length|0].generator;
export const facets = [
  {name: 'meander', generator: meander}
];
export {meander};
