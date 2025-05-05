// stores/games.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useGamesStore = defineStore('games', () => {
  const list = ref([])

  // Base fetch: filters by gender + type
  async function fetchGames({ gender = 'All', type = 'All' } = {}) {
    let query = supabase
      .from('games')
      .select('*')
      .order('kickoff_time', { ascending: true })

    if (gender !== 'All') query = query.eq('gender', gender)
    if (type   !== 'All') query = query.eq('type',   type)

    const { data: games, error } = await query
    if (error) {
      console.error('fetchGames error:', error)
      list.value = []
      return
    }

    // load teams for name mapping
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
    if (teamsError) console.error('Failed to load teams:', teamsError)

    const teamMap = Object.fromEntries((teams || []).map(t => [t.id, t.name]))

    list.value = (games || []).map(g => ({
      ...g,
      teamA:       teamMap[g.team_a_id] || 'Unknown A',
      teamB:       teamMap[g.team_b_id] || 'Unknown B',
      kickoffTime: g.kickoff_time,
      is_complete: g.is_complete
    }))
  }

  // New: two-param wrapper so HomeView can do fetchByCategory(gender, type)
  async function fetchByCategory(gender = 'All', type = 'All') {
    // force type = 'All' whenever gender !== 'Male'
    if (gender !== 'Male') type = 'All'
    return fetchGames({ gender, type })
  }
  

  return {
    list,
    fetchGames,
    fetchByCategory,
  }
})
