export const allTables = {
    Male: {
      Elite: [
        { team: 'Tigers', played: 3, points: 9, rank: 1 },
        { team: 'Lions', played: 3, points: 6, rank: 2 },
        { team: 'Bulls', played: 3, points: 3, rank: 3 },
      ],
      Social: [
        { team: 'Otters', played: 3, points: 7, rank: 1 },
        { team: 'Badgers', played: 3, points: 5, rank: 2 },
      ]
    },
    Ladies: {
      default: [
        { team: 'Queens', played: 3, points: 8, rank: 1 },
        { team: 'Stars', played: 3, points: 5, rank: 2 },
        { team: 'Valkyries', played: 3, points: 3, rank: 3 },
      ]
    },
    Juniors: {
      default: [
        { team: 'Mini Tigers', played: 3, points: 6, rank: 1 },
        { team: 'Tiny Bulls', played: 3, points: 4, rank: 2 },
        { team: 'Young Lions', played: 3, points: 2, rank: 3 },
      ]
    }
  }
  
  export const allGames = {
    Male: {
      Elite: [
        {
          teamA: 'Tigers',
          teamB: 'Lions',
          kickoffTime: '2025-05-02T19:30:00',
          pitch: 'Pitch 1',
          scoreA: 7,
          scoreB: 0
        },
        {
          teamA: 'Bulls',
          teamB: 'Wolves',
          kickoffTime: '2025-05-02T20:00:00',
          pitch: 'Pitch 2',
          scoreA: 0,
          scoreB: 0
        },
        {
          teamA: 'Jaguars',
          teamB: 'Tryit',
          kickoffTime: '2025-05-02T21:00:00',
          pitch: 'Pitch 2',
          scoreA: 0,
          scoreB: 0
        }
      ],
      Social: []
    },
    Ladies:    { default: [] },
    Juniors:   { default: [] }
  }
  