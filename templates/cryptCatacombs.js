export const cryptCatacombs = {
  name: 'crypt catacombs',
  options: {
    prefabOrigin: true,
    doors:{
      ignore: 0.5
    },
    rooms: [
      {
        name: 'normal square',
        weight: 8,
        sizes: [
          {size: 6, weight: 10},
          {size: 3, weight: 70},{size: 2, weight: 10}
        ]
      },
      {
        name: 'pillar square',
        weight: 1,
        sizes: [
          {size: 9, weight: 2},{size: 8, weight: 5},
          {size: 7, weight: 8},{size: 6, weight: 10}
        ]
      },
      {
        name: 'square',
        weight: 1,
        waterChance: 0.5,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'island walkways square',
        weight: 0.5,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'water pool square',
        weight: 0.5,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'island square',
        weight: 0.5,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      }
    ]
  }
};
