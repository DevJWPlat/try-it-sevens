import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useScoreboardStore = defineStore('scoreboard', {
  state: () => ({
    table: []
  }),
  actions: {
    async fetchByCategory(gender, type = 'default') {
      // Assuming your scoreboard table has gender & type columns too
      const { data, error } = await supabase
        .from('scoreboard')
        .select('*, team:team_id(name, logo_url)')
        .eq('gender', gender)
        .eq('type', type)
        .order('rank', { ascending: true })

      if (error) throw error
      this.table = data
    }
  }
})
