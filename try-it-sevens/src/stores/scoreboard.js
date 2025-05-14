// src/stores/scoreboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useScoreboardStore = defineStore('scoreboard', () => {
  const table = ref([])

  async function fetchByCategory(gender = 'All', type = 'All') {
    // 1) Fetch the correct teams for this gender/type
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
    console.log('[scoreboard] teams →', teams, teamErr)

    // 2) Determine which 'type' to fetch from the scoreboard table
    //    (Male→Elite/Social, everyone else→All)
    const scoreType =
      gender === 'Male' && type !== 'All'
        ? type
        : 'All'
        console.log('[scoreboard] fetching for', { gender, type, scoreType })
    // 3) Fetch only those scoreboard rows
    const { data: scores, error: scoreErr } = await supabase
      .from('scoreboard')
      .select('*')
      .eq('type', scoreType)
      console.log('[scoreboard] scores →', scores, scoreErr)
    if (scoreErr) {
      console.error('[scoreboard] score fetch error:', scoreErr)
      table.value = []
      return
    }

    // 4) Merge scores into the teams list
    const scoreMap = Object.fromEntries(
      (scores || []).map(s => [s.team_id, s])
    )

    const rows = teams.map(t => {
      const stats = scoreMap[t.id] || {
        played: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0
      }
      return {
        team: t.name,
        ...stats
      }
    })

    // 5) Rank (ties share a rank)
    rows.sort((a, b) => b.points - a.points)
    let prevPoints = null
    let prevRank   = 0

    rows.forEach((row, idx) => {
      const position = idx + 1
      if (row.points !== prevPoints) {
        prevPoints = row.points
        prevRank   = position
      }
      row.rank = prevRank
    })

    table.value = rows
  }

  return { table, fetchByCategory }
})
