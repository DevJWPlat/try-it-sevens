import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useGamesStore = defineStore('games', {
  state: () => ({
    list: []
  }),
  actions: {
    async fetchByCategory(gender, type = 'default') {
      const { data, error } = await supabase
        .from('games')
        .select(`*, team_a:team_a_id(name, logo_url), team_b:team_b_id(name, logo_url)`)
        .eq('gender', gender)
        .eq('type', type)
        .order('kickoff_time', { ascending: true })

      if (error) throw error
      this.list = data
    }
  }
})
