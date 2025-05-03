// auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,        // the full row from your "users" table
    loggedIn: false,
    role: null,        // e.g. "Super Admin" | "Admin" | "Team Admin"
  }),
  actions: {
    async login(username, password) {
      // fetch the row matching both username & password
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error) {
        throw new Error(error.message || 'Login failed')
      }

      // store it in the Pinia state
      this.user     = data
      this.role     = data.role
      this.loggedIn = true

      // optionally persist to localStorage
      localStorage.setItem('user', JSON.stringify(data))
    },

    logout() {
      this.user     = null
      this.role     = null
      this.loggedIn = false
      localStorage.removeItem('user')
    },

    restore() {
      // call this on app startup to rehydrate from localStorage
      const saved = localStorage.getItem('user')
      if (saved) {
        const data = JSON.parse(saved)
        this.user     = data
        this.role     = data.role
        this.loggedIn = true
      }
    }
  }
})
