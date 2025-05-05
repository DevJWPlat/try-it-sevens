import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useScoreboardStore = defineStore('scoreboard', () => {
  const table = ref([])

  async function fetchByCategory(gender, type) {
    const teamType = type || 'default'

    const { data: teams, error: teamErr } = await supabase
    .from('teams')
    .select('id, name')

    const { data: scores, error: scoreErr } = await supabase
      .from('scoreboard')
      .select('*')
      .eq('gender', gender)
      .eq('type', teamType)

    if (teamErr || scoreErr) {
      console.error('Scoreboard fetch error:', teamErr || scoreErr)
      table.value = []
      return
    }

    // Create a map of scores by team_id
    const scoreMap = Object.fromEntries(
      scores.map(s => [s.team_id, s])
    )

    // Return merged data: every team guaranteed a row
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
