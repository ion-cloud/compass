export const ancientCrypt = {
  name: 'ancient crypt',
  options: {
    doors:{
      ignore: 0.6
    },
    rooms: [
      {
        name: 'prefab',
        weight: 1,
        waterChance: 1,
        sizes: [
          {size: 20, weight: 1}
        ]
      },
      {
        name: 'prefab',
        weight: 1,
        waterChance: 0.2,
        sizes: [
          {size: 20, weight: 1}
        ]
      },
      {
        name: 'prefab',
        weight: 1,
        waterChance: 0.5,
        sizes: [
          {size: 20, weight: 1}
        ]
      },
      {
        name: 'normal square',
        weight: 2,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'pillar square',
        weight: 2,
        sizes: [
          {size: 6, weight: 10},{size: 5, weight: 7},
        ]
      },
      {
        name: 'normal square',
        weight: 8,
        waterChance: 0.5,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'island walkways square',
        weight: 2,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'normal circle',
        weight: 3,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'normal circle',
        weight: 8,
        waterChance: 0.5,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'island circle',
        weight: 2,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'island walkways circle',
        weight: 1,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'water pool circle',
        weight: 1,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      }
    ]
  }
};
