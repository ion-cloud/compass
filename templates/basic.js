export const basic = {
  name: 'basic',
  options: {
    prefabOrigin: true,
    rooms: [
      {
        name: 'marshy prefab',
        weight: 8,
        sizes: [
          {size: 20, weight: 1}
        ]
      },
      {
        name: 'pillar square',
        weight: 3,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'pillar circle',
        weight: 3,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'normal square',
        weight: 13,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'normal circle',
        weight: 8,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      }
    ]
  }
};
