export const marshyDredge = {
  name: 'marshy dredge',
  options: {
    doors:{
      ignore: 1,
      expand:{
        chance: 0.6,
        size: 2,
        waterChance: 0.5
      }
    },
    rooms: [
      {
        name: 'normal',
        weight: 2,
        waterChance: 0.5,
        sizes: [
          {size: 2, weight: 100}
        ]
      },
      {
        name: 'normal',
        weight: 2,
        waterChance: 1,
        sizes: [
          {size: 2, weight: 100}
        ]
      },
      {
        name: 'pillar circle',
        weight: 1,
        sizes: [
          {size: 15, weight: 2},{size: 14, weight: 4},
          {size: 13, weight: 6},{size: 12, weight: 8},
          {size: 11, weight: 10},{size: 10, weight: 12},
          {size: 9, weight: 14},{size: 8, weight: 16}
        ]
      },
      {
        name: 'normal circle',
        weight: 2,
        waterChance: 1,
        sizes: [
          {size: 15, weight: 2},{size: 14, weight: 4},
          {size: 13, weight: 6},{size: 12, weight: 8},
          {size: 11, weight: 10},{size: 10, weight: 12},
          {size: 9, weight: 14},{size: 8, weight: 16},
          {size: 7, weight: 18},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'normal circle',
        weight: 8,
        waterChance: 0.5,
        sizes: [
          {size: 15, weight: 2},{size: 14, weight: 4},
          {size: 13, weight: 6},{size: 12, weight: 8},
          {size: 11, weight: 10},{size: 10, weight: 12},
          {size: 9, weight: 14},{size: 8, weight: 16},
          {size: 7, weight: 18},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'island walkways circle',
        weight: 0.5,
        sizes: [
          {size: 15, weight: 2},{size: 14, weight: 4},
          {size: 13, weight: 6},{size: 12, weight: 8},
          {size: 11, weight: 10},{size: 10, weight: 12},
          {size: 9, weight: 14},{size: 8, weight: 16},
          {size: 7, weight: 18},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'water pool circle',
        weight: 0.5,
        sizes: [
          {size: 15, weight: 2},{size: 14, weight: 4},
          {size: 13, weight: 6},{size: 12, weight: 8},
          {size: 11, weight: 10},{size: 10, weight: 12},
          {size: 9, weight: 14},{size: 8, weight: 16},
          {size: 7, weight: 18},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'island circle',
        weight: 0.5,
        sizes: [
          {size: 15, weight: 2},{size: 14, weight: 4},
          {size: 13, weight: 6},{size: 12, weight: 8},
          {size: 11, weight: 10},{size: 10, weight: 12},
          {size: 9, weight: 14},{size: 8, weight: 16},
          {size: 7, weight: 18},{size: 6, weight: 20},
          {size: 5, weight: 45},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      }
    ]
  }
}
