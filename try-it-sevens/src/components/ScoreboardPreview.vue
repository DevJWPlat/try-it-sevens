<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  showButton: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <section class="space-y-4 text-center">
    <h2 class="text-xl font-bold">Scoreboard</h2>
    <div v-if="rows.every(r => r.played === 0)">
      <p class="italic text-gray-500">No scoreboard data available for this category.</p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="px-4 py-2">Team</th>
            <th class="px-4 py-2">Played</th>
            <th class="px-4 py-2">Points</th>
            <th class="px-4 py-2">Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in rows"
            :key="i"
            class="even:bg-gray-50 hover:bg-green-50 transition"
          >
            <td class="px-4 py-2">
              <RouterLink :to="`/team/${row.team}`" class="text-blue-600 hover:underline">
                {{ row.team }}
              </RouterLink>
            </td>
            <td class="px-4 py-2">{{ row.played }}</td>
            <td class="px-4 py-2">{{ row.points }}</td>
            <td class="px-4 py-2">{{ row.rank }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <RouterLink
      v-if="showButton"
      to="/scoreboard"
      class="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full transition"
    >
      See Full Scoreboard
    </RouterLink>
  </section>
</template>
