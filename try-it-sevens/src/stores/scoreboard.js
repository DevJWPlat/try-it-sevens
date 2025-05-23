// src/stores/scoreboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useScoreboardStore = defineStore('scoreboard', () => {
  const table = ref([])

  async function fetchByCategory(gender = 'All', type = 'All') {
    // 1) Fetch only the teams in this gender/type
    let teamQ = supabase
      .from('teams')
      .select('id, name')
      .eq('gender', gender)

    if (gender === 'Male' && type !== 'All') {
      teamQ = teamQ.eq('type', type)
    }

    const { data: teams, error: teamErr } = await teamQ
    if (teamErr) {
      console.error('[scoreboard] team fetch error:', teamErr)
      table.value = []
      return
    }

    // 2) Decide which scoreboard‐type to pull
    //    - Male + specific subtype ⇒ that subtype (Elite/Social)
    //    - Everyone else ⇒ “All”
    const scoreType = (gender === 'Male' && type !== 'All')
      ? type
      : 'All'

    // 3) Fetch only those scoreboard rows matching both gender & type
    const { data: scores, error: scoreErr } = await supabase
      .from('scoreboard')
      .select('team_id, played, points, wins, draws, losses')
      .eq('gender', gender)
      .eq('type',    scoreType)

    if (scoreErr) {
      console.error('[scoreboard] score fetch error:', scoreErr)
      table.value = []
      return
    }

    // 4) Build a lookup from team_id → stats
    const scoreMap = Object.fromEntries(
      scores.map(s => [s.team_id, s])
    )

    // 5) Merge stats into your filtered teams, defaulting to zero
    const rows = teams.map(t => {
      const stats = scoreMap[t.id] || {
        played: 0,
        points: 0,
        wins:   0,
        draws:  0,
        losses: 0
      }
      return {
        team:   t.name,
        played: stats.played,
        points: stats.points,
        wins:   stats.wins,
        draws:  stats.draws,
        losses: stats.losses
      }
    })

    // 6) Sort by points descending, assign rank (ties share)
    rows.sort((a, b) => b.points - a.points)
    let prevPoints = null
    let prevRank   = 0

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
