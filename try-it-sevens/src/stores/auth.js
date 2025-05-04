// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loggedIn: false
  }),
  actions: {
    /**  
     * Try to pick up an existing session on page‐load  
     */
    async restore() {
      // supabase v2: getSession returns { data: { session }, error }
      const { data: { session }, error } = await supabase.auth.getSession()
      if (!error && session) {
        this.user     = session.user
        this.loggedIn = true
      }
    },

    /**  
     * Our custom “login with username/password”  
     */
    async login(username, password) {
      // pull your user row out of `app_users`
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username)
        .single()

      if (error || !data) {
        throw new Error('Unknown username')
      }
      if (data.password !== password) {
        throw new Error('Incorrect password')
      }

      this.user     = data
      this.loggedIn = true
    },

    logout() {
      this.user     = null
      this.loggedIn = false
    }
  }
})
