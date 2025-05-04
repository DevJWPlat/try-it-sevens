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
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    restore() {
      const saved = localStorage.getItem('user')
      if (saved) {
        this.user = JSON.parse(saved)
      }
    }
  }
})
