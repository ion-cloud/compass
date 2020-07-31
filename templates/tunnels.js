export const tunnels = {
  name: 'tunnels',
  options: {
    doors: {
      ignore: 1,
      expand: {
        chance: 1
      }
    },
    rooms: [
      {
        name: 'normal square',
        weight: 8,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 30}
        ]
      },
      {
        name: 'pillar square',
        weight: 8,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 30}
        ]
      },
      {
        name: 'square',
        weight: 2,
        waterChance: 0.5,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'island walkways square',
        weight: 1,
        sizes: [
          {size: 5, weight: 10},{size: 4, weight: 35},
          {size: 3, weight: 70},{size: 2, weight: 100}
        ]
      },
      {
        name: 'pillar circle',
        weight: 10,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 7}
        ]
      },
      {
        name: 'normal circle',
        weight: 10,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20}
        ]
      },
      {
        name: 'island circle',
        weight: 4,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20}
        ]
      },
      {
        name: 'island walkways circle',
        weight: 1,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20}
        ]
      },
      {
        name: 'water pool circle',
        weight: 2,
        sizes: [
          {size: 9, weight: 4},{size: 8, weight: 8},
          {size: 7, weight: 12},{size: 6, weight: 20}
        ]
      }
    ]
  }
}
