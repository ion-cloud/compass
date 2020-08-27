export const passages = {
  name: 'passages',
  options: {
    doors: {
      ignore: 1,
      expand: {
        chance: 0.4,
        waterChance: 0.5
      }
    },
    lake: {
      ignoreSand: true,
      minWidth: 16,
      maxWidth: 32,
      minHeight: 16,
      maxHeight: 32,
      minAmount: 1,
      maxAmount: 2
    },
    rooms: [
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
      },
      {
        name: 'circle',
        weight: 8,
        waterChance: 0.5,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'island walkways circle',
        weight: 0.5,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'water pool circle',
        weight: 0.5,
        sizes: [
          {size: 11, weight: 4},{size: 10, weight: 8},
          {size: 9, weight: 12},{size: 8, weight: 16},
          {size: 7, weight: 20},{size: 6, weight: 30},
          {size: 5, weight: 50},{size: 4, weight: 70},
          {size: 3, weight: 100}
        ]
      },
      {
        name: 'island circle',
        weight: 0.5,
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
}
