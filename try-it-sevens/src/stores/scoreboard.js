// src/stores/scoreboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useScoreboardStore = defineStore('scoreboard', () => {
  const table = ref([])

  async function fetchByCategory(gender = 'All', type = 'All') {
    // 1) Grab every team (so we can filter client-side)
    const { data: allTeams, error: teamErr } = await supabase
      .from('teams')
      .select('id, name, gender, type')
    if (teamErr) {
      console.error('[scoreboard] team fetch error:', teamErr)
      table.value = []
      return
    }

    // 2) Locally pick only the teams for this gender/type
    const teams = allTeams.filter(t => {
      if (t.gender !== gender) return false
      if (gender === 'Male' && type !== 'All' && t.type !== type) return false
      return true
    })

    // 3) Decide which “type” bucket to read from the scoreboard table
    //    (Male → Elite/Social; everyone else → All)
    const scoreType = (gender === 'Male' && type !== 'All')
      ? type
      : 'All'

    // 4) Fetch only the matching scoreboard rows
    const { data: scores, error: scoreErr } = await supabase
      .from('scoreboard')
      .select('team_id, played, points, wins, draws, losses')
      .eq('type', scoreType)
    if (scoreErr) {
      console.error('[scoreboard] score fetch error:', scoreErr)
      table.value = []
      return
    }

    // 5) Merge stats into our filtered teams
    const scoreMap = Object.fromEntries(scores.map(s => [s.team_id, s]))
    const rows = teams.map(t => {
      const stats = scoreMap[t.id] || {
        played: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0
      }
      return {
        team:   t.name,
        ...stats
      }
    })

    // 6) Sort & rank (ties share rank)
    rows.sort((a, b) => b.points - a.points)
    let prevPoints = null, prevRank = 0
    rows.forEach((r, i) => {
      const pos = i + 1
      if (r.points !== prevPoints) {
        prevPoints = r.points
        prevRank   = pos
      }
      r.rank = prevRank
    })

    table.value = rows
  }

  return { table, fetchByCategory }
})
