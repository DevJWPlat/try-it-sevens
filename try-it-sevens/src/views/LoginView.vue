<!-- src/views/LoginView.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { supabase }       from '@/lib/supabase'

const auth     = useAuthStore()
const router   = useRouter()
const username = ref('')
const password = ref('')
const error    = ref('')

async function handleSubmit() {
  error.value = ''
  try {
    await auth.login(username.value, password.value)
    router.push('/')                // or wherever
  } catch (e) {
    error.value = e.message
  }
}

async function testFetchAllUsers() {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')

  console.log('SUPABASE TEST:', { data, error })
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
  console.log('DB TEST:', { data, error })
})

</script>

<template>
  <main class="wrapper pt-20 max-w-sm mx-auto space-y-4">
    <h1 class="text-2xl font-bold">Login</h1>
    <p v-if="error" class="text-red-600">{{ error }}</p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <label class="block">
        <span>Username</span>
        <input v-model="username" required class="mt-1 block w-full border rounded p-2" />
      </label>

      <label class="block">
        <span>Password</span>
        <input v-model="password" type="password" required class="mt-1 block w-full border rounded p-2" />
      </label>

      <button type="submit" class="block w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Login
      </button>
    </form>
  </main>
</template>
