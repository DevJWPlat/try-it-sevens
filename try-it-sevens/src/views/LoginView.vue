<!-- src/views/LoginView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const role     = ref('super')    // super | admin | team
const router   = useRouter()

function submitLogin() {
  // TODO: real auth later
  console.log('Login as', role.value, username.value)
  if (role.value === 'super') {
    router.push('/super-admin')
  } else if (role.value === 'admin') {
    router.push('/admin')       // your admin layout
  } else {
    router.push('/team-admin')  // team‐admin stub
  }
}
</script>

<template>
  <main class="wrapper pt-20 flex justify-center">
    <form @submit.prevent="submitLogin" class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4">
      <h1 class="text-2xl font-bold text-center">Login</h1>

      <label class="block">
        <span class="text-sm font-medium">Role</span>
        <select v-model="role" class="mt-1 block w-full border rounded p-2">
          <option value="super">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="team">Team Admin</option>
        </select>
      </label>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        Submit
      </button>
    </form>
  </main>
</template>


<!-- for when we have db access
 
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router   = useRouter()

function submitLogin() {
  // TODO: replace with real auth call
  console.log('Logging in:', username.value, password.value)
  // on success:
  router.push('/admin') 
}
</script>

<template>
  <main class="wrapper pt-20 flex justify-center">
    <form 
      @submit.prevent="submitLogin" 
      class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h1 class="text-2xl font-bold text-center">Login</h1>
      
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        Submit
      </button>
    </form>
  </main>
</template>

<style scoped>
/* any page-specific tweaks */
</style>






-->