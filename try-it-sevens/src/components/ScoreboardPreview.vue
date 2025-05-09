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
    <h2 class="main-sub-heading">Scoreboard</h2>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="px-4 py-2">Rank</th>
            <th class="px-4 py-2">Team</th>
            <th class="px-4 py-2">Played</th>
            <th class="px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in rows"
            :key="i"
            class="even:bg-gray-50 hover:bg-green-50 transition"
          >
          <td class="px-4 py-2">{{ row.rank }}</td>
            <td class="px-4 py-2">
              <RouterLink :to="`/team/${row.team}`" class="text-blue-600 hover:underline">
                {{ row.team }}
              </RouterLink>
            </td>
            <td class="px-4 py-2">{{ row.played }}</td>
            <td class="px-4 py-2">{{ row.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
