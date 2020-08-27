export const caverns = {
  name: 'caverns',
  options: {
    doors: {
      ignore: 1,
      expand: {
        chance: 0.7,
        size: 4,
        waterChance: 0.2
      }
    },
    lake: {
      minWidth: 16,
      maxWidth: 32,
      minHeight: 16,
      maxHeight: 32,
      ignoreSand: true,
      amount: 4
    },
    rooms: [
      {
        name: 'normal circle',
        weight: 2,
        sizes: [
          {size: 15, weight: 4},{size: 13, weight: 6},
          {size: 11, weight: 8},{size: 9, weight: 10},
          {size: 7, weight: 12},{size: 5, weight: 14},
          {size: 3, weight: 16}
        ]
      },
      {
        name: 'circle',
        weight: 8,
        waterChance: 0.2,
        sizes: [
          {size: 15, weight: 4},{size: 13, weight: 6},
          {size: 11, weight: 8},{size: 9, weight: 10},
          {size: 7, weight: 12},{size: 5, weight: 14}
        ]
      },
      {
        name: 'island walkways circle',
        weight: 0.5,
        sizes: [
          {size: 15, weight: 4},{size: 13, weight: 6},
          {size: 11, weight: 8},{size: 9, weight: 10},
          {size: 7, weight: 12},{size: 5, weight: 14}
        ]
      },
      {
        name: 'water pool circle',
        weight: 0.5,
        sizes: [
          {size: 15, weight: 4},{size: 13, weight: 6},
          {size: 11, weight: 8},{size: 9, weight: 10},
          {size: 7, weight: 12},{size: 5, weight: 14}
        ]
      },
      {
        name: 'island circle',
        weight: 0.5,
        sizes: [
          {size: 15, weight: 4},{size: 13, weight: 6},
          {size: 11, weight: 8},{size: 9, weight: 10},
          {size: 7, weight: 12},{size: 5, weight: 14}
        ]
      }
    ]
  }
};
