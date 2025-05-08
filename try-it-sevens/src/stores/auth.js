// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {
    loggedIn: state => !!state.user
  },

  actions: {
    login(user) {
      // Normalize access level to lowercase for consistent checks
      if (user.access) {
        user.access = String(user.access).toLowerCase()
      }
      this.user = user
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    restore() {
      const saved = localStorage.getItem('user')
      if (saved) {
        const user = JSON.parse(saved)
        // ensure normalized access
        if (user.access) {
          user.access = String(user.access).toLowerCase()
        }
        this.user = user
      }
    }
  }
})
