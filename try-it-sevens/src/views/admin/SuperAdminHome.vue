<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function go(path) {
  router.push(path)
}

function logout() {
  router.push('/login')
}

function clearAll() {
  if (window.confirm('Are you sure you want to clear all data?')) {
    // TODO: connect to actual clear-all endpoint
    alert('All data cleared (stub).')
  }
}
</script>

<template>
  <main class="wrapper pt-20 max-w-sm mx-auto space-y-6 text-center">
    <h1 class="text-2xl font-bold">Super Admin Dashboard</h1>

    <button
      @click="go('/admin/accounts')"
      class="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      Manage Accounts
    </button>

    <button
      @click="go('/admin/teams')"
      class="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      Manage Teams
    </button>

    <button
      @click="go('/admin/scoreboard')"
      class="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      Edit Scoreboard
    </button>

    <button
      @click="go('/admin/games')"
      class="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      Game Planner
    </button>

    <!-- <button
      @click="go('/admin/sponsors')"
      class="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      Manage Sponsors
    </button> -->

    <hr class="my-4"/>

    <button
      @click="logout"
      class="block w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Log out
    </button>

    <button
      @click="clearAll"
      class="block w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Clear All Data
    </button>
  </main>
</template>

<style scoped>
/* Optional: additional styling here */
</style>
