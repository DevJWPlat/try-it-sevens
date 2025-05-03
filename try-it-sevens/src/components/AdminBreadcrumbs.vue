<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

// replicate your pageTitle logic here
const pageTitle = computed(() => {
  if (route.params.team) {
    return String(route.params.team)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  }
  switch (route.path) {
    case '/admin':           return 'Dashboard'
    case '/super-admin':           return 'Dashboard'
    case '/team-admin':           return 'Dashboard'
    case '/admin/accounts':  return 'Accounts'
    case '/admin/teams':     return 'Teams'
    case '/admin/scoreboard':return 'Scoreboard'
    case '/admin/games':     return 'Game Planner'
    case '/admin/sponsors':  return 'Sponsors'
    // add other admin routes if needed
    default:                 return ''
  }
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-4 text-sm">
    <ol class="inline-flex items-center space-x-2">
      <li>
        <RouterLink to="/super-admin" class="text-gray-600 hover:text-gray-800">
          Admin Dashboard
        </RouterLink>
      </li>
      <li>/</li>
      <li class="text-gray-800 font-semibold">
        {{ pageTitle }}
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* optional styling tweaks */
</style>