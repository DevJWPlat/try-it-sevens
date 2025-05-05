// stores/games.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useGamesStore = defineStore('games', () => {
  const list = ref([])

  async function fetchByCategory(gender, type) {
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .eq('gender', gender)
      .eq('type', type || 'default')

    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')

    if (gamesError || teamsError) {
      console.error('Failed to load games or teams:', gamesError || teamsError)
      list.value = []
      return
    }

    const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]))

    list.value = games.map(g => ({
      ...g,
      teamA: teamMap[g.team_a_id] || 'Unknown A',
      teamB: teamMap[g.team_b_id] || 'Unknown B',
      kickoffTime: g.kickoff_time
    }))
  }

  return { list, fetchByCategory }
})
