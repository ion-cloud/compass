export const standardCrypt = {
  name: 'standard crypt',
  options: {
    rooms: [
      {
        name: 'prefab',
        filter: ['caves','afi','lahalusplmen','ewiv','vesaeves','ongi','darashek','biomenaekylsch','haloibimensk','sweth','kerieves','aclam','othremen','shuscho','obisyn','uvesoives','kerocl','darokyl','kerehaloscrb','yflulas','kerohi','iotae','vesisitgh','asynaryn','shangi','halimenoclkyl','wriemeny','alaso','luriechb','kylomenethors','kerosk','menomeniefb','kerirumenph','kyligli','haleikyleicha','alynumen','iehaloth','mamenobm','oryno','daraclistlas','ati'],
        weight: 4,
        sizes: [
          {size: 20, weight: 1}
        ]
      },
      {
        name: 'normal square',
        weight: 16,
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
      }
    ]
  }
};
