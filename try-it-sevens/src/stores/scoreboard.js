import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useScoreboardStore = defineStore('scoreboard', () => {
  const table = ref([])

  // Fetch and merge team scores, filtering only by gender
  // src/stores/scoreboard.js
    async function fetchByCategory(gender = 'All', type = 'All') {
      // 0) log everything un-filtered
      const { data: allScores, error: allErr } = await supabase
        .from('scoreboard')
        .select('*')
      console.log('[scoreboard] ALL rows →', allErr || allScores)

      // 1) then your existing filtered query…
      let query = supabase.from('scoreboard').select('*').eq('gender', gender)
      if (gender === 'Male' && type && type !== 'All') {
        query = query.eq('type', type)
      }
      const { data: scores, error: scoreErr } = await query
      console.log('[scoreboard] filtered rows →', scoreErr || scores)




    // 2) Load all teams for name mapping
    const { data: teams, error: teamErr } = await supabase
      .from('teams')
      .select('id, name')

    if (teamErr) {
      console.error('[scoreboard] team fetch error:', teamErr)
      table.value = []
      return
    }

    // 3) Merge scores into full team list
    const scoreMap = Object.fromEntries((scores || []).map(s => [s.team_id, s]))
    table.value = teams.map(t => {
      const stats = scoreMap[t.id] || {
        played: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        rank: null
      }
      return {
        team: t.name,
        ...stats
      }
    })
  }

  return { table, fetchByCategory }
})
