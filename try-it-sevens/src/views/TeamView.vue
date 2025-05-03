<!-- src/views/TeamView.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 1) Your master “database” of teams, with logo URL, description, and players
const allTeamsData = {
  Tigers: {
    logo: '/assets/images/tigers-logo.svg',
    description: 'Fierce predators of the sevens pitch!',
    position: '1/6',
    players: [
      { number: 1, name: 'Alice' },
      { number: 2, name: 'Bob' },
      { number: 3, name: 'Charlie' }
    ]
  },
  Lions: {
    logo: '/assets/images/lions-logo.svg',
    description: 'Roaring through every match.',
    position: '2/6',
    players: [
      { number: 4, name: 'Diana' },
      { number: 5, name: 'Evan' }
    ]
  },
  // …and so on for every team…
}

// 2) Grab the team slug from the route
const route = useRoute()
const teamKey = route.params.team  // e.g. "Tigers"

// 3) Look it up
const team = computed(() => allTeamsData[teamKey] || null)
</script>

<template>
  <main class="wrapper pt-20">
    <section v-if="team" class="max-w-md mx-auto space-y-6">
      <!-- Team name header -->
      <h1 class="text-2xl font-bold text-center">{{ teamKey }}</h1>

      <!-- Logo -->
      <div class="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
        <img
          v-if="team.logo"
          :src="team.logo"
          :alt="teamKey + ' logo'"
          class="object-contain w-full h-full"
        />
      </div>

      <!-- Description & Position -->
      <div class="space-y-2 text-gray-700">
        <p><span class="font-semibold">Team Name:</span> {{ teamKey }}</p>
        <p><span class="font-semibold">Description:</span> {{ team.description }}</p>
        <p><span class="font-semibold">Position:</span> {{ team.position }}</p>
      </div>

      <!-- Players Table -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Players</h2>
        <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2">#</th>
              <th class="px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, i) in team.players"
              :key="i"
              class="even:bg-gray-50 hover:bg-green-50 transition"
            >
              <td class="px-4 py-2 font-medium">{{ p.number }}</td>
              <td class="px-4 py-2">{{ p.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else class="text-center py-20 text-gray-500">
      <p>Team “{{ teamKey }}” not found.</p>
    </section>
  </main>
</template>

<style scoped>
/* adjust as desired */
</style>
