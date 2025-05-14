<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth     = useAuthStore()
const router   = useRouter()

const username = ref('')
const password = ref('')
const error    = ref('')

async function login() {
  error.value = ''
  const uname = username.value.trim().toLowerCase()

  const { data, error: err } = await supabase
    .from('app_users')
    .select('*')
    .eq('username', uname)
    .eq('password', password.value)
    .single()

  if (err || !data) {
    error.value = 'Invalid username or password'
    return
  }

  auth.login(data)

  // Determine redirect path based on normalized access level
  const role = String(data.access).toLowerCase()
  let path = '/'
  if (role === 'super')      path = '/super-admin'
  else if (role === 'admin') path = '/admin'
  else if (role === 'team')  path = '/team-admin'

  console.log('Login redirect to', path)
  router.push(path)
}
</script>

<template>
  <main class="wrapper pt-20 max-w-sm mx-auto space-y-4">
    <h1 class="text-2xl font-bold">Login</h1>
    <p v-if="error" class="text-red-600">{{ error }}</p>

    <form @submit.prevent="login" class="space-y-4">
      <label class="block">
        <span>Username</span>
        <input
          v-model="username"
          autocomplete="username"
          required
          class="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label class="block">
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="mt-1 block w-full border rounded p-2"
        />
      </label>

      <button
        type="submit"
        class="custom-button block w-full py-3"
      >
        Login
      </button>
    </form>
  </main>
</template>

<style scoped>
.custom-button {
  background: #231F20;
  padding: 12px 30px;
  color: #96D1F2;
  font-weight: 400;
  letter-spacing: 1px;
  border-radius: 12px;
  width: max-content;
  display: block;
  text-align: center;
  width: 100%;
  transition: all .3s;
}

.custom-button:hover {
  background: #96D1F2;
  color: #231F20;
}
</style>
