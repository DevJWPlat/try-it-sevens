// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase }            from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: supabase.auth.user()
  }),

  getters: {
    loggedIn: state => !!state.user,
    role:     state => state.user?.role
  },

  actions: {
    /**
     * Log in by username + password
     */
    async signIn(username, password) {
      // 1) look up the email for that username
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('username', username)
        .single()

      if (profErr || !profile) {
        throw new Error('Unknown username')
      }

      // 2) fetch the auth user record (includes their email)
      //    Note: supabase.auth.api.getUser is only available server-side.
      //    Instead we'll call signIn() with a magic link to their email—BUT:
      //    Supabase JS client doesn’t let us signIn with user_id. We *must* know their email.
      //    So you can instead store `email` in your profiles table as well:
      //    profiles(email, username, user_id)
      //
      //    Then:
      // const { data: prof, error } = await supabase
      //    .from('profiles')
      //    .select('email')
      //    .eq('username', username)
      //    .single()
      //
      //    let email = prof.email

      // For simplicity let’s assume your profiles table also has `email`
      const { data: prof2, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single()

      if (error || !prof2?.email) {
        throw new Error('Unable to retrieve email for that username')
      }

      const { user, error: authErr } = await supabase.auth.signIn({
        email:    prof2.email,
        password
      })

      if (authErr) throw authErr
      this.user = user
      return user
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})
