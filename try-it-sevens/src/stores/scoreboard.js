// src/stores/scoreboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useScoreboardStore = defineStore('scoreboard', () => {
  const table = ref([])

  async function fetchByCategory(gender = 'All', type = 'All') {
    // 1) Fetch only the teams matching the filter
    let teamQuery = supabase
      .from('teams')
      .select('id, name')
      .eq('gender', gender)

    if (gender === 'Male' && type !== 'All') {
      teamQuery = teamQuery.eq('type', type)
    }

    const { data: teams, error: teamErr } = await teamQuery
    if (teamErr) {
      console.error('[scoreboard] team fetch error:', teamErr)
      table.value = []
      return
    }

    // 2) Fetch only the scoreboard rows matching this category **by type**
    let scoreQuery = supabase
      .from('scoreboard')
      .select('*')

    // Male → Elite / Social; Ladies & Juniors → All
    if (gender === 'Male') {
      if (type && type !== 'All') {
        scoreQuery = scoreQuery.eq('type', type)
      }
    } else {
      scoreQuery = scoreQuery.eq('type', 'All')
    }

    const { data: scores, error: scoreErr } = await scoreQuery
    if (scoreErr) {
      console.error('[scoreboard] score fetch error:', scoreErr)
      table.value = []
      return
    }

    // 3) Merge scores into the teams list
    const scoreMap = Object.fromEntries(
      (scores || []).map(s => [s.team_id, s])
    )

    const rows = teams.map(t => {
      const stats = scoreMap[t.id] || {
        played: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        rank: null
      }
      return { team: t.name, ...stats }
    })

    // 4) Competition ranking: ties share a rank, next rank = position index
    rows.sort((a, b) => b.points - a.points)
    let prevPoints = null
    let prevRank   = 0
    rows.forEach((row, idx) => {
      const position = idx + 1
      if (row.points !== prevPoints) {
        prevRank   = position
        prevPoints = row.points
      }
      row.rank = prevRank
    })

    table.value = rows
  }

  return { table, fetchByCategory }
})
