<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  games: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  highlightSecond: {
    type: Boolean,
    default: false
  }
})

function formatTime(t) {
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <section v-if="games.length" class="space-y-4">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <div
      v-for="(g, i) in games"
      :key="i"
      :class="[
        'rounded-lg p-4 shadow',
        highlightSecond && i === 1 ? 'bg-blue-100' : 'bg-white'
      ]"
    >
      <div class="text-center">
        <RouterLink :to="`/team/${g.teamA}`" class="text-blue-600 font-semibold hover:underline">
          {{ g.teamA }}
        </RouterLink>
        <span class="mx-2">{{ g.scoreA ?? 0 }} : {{ g.scoreB ?? 0 }}</span>
        <RouterLink :to="`/team/${g.teamB}`" class="text-blue-600 font-semibold hover:underline">
          {{ g.teamB }}
        </RouterLink>
      </div>
      <p class="text-sm mt-2">
        Kickoff: {{ formatTime(g.kickoffTime) }} | Pitch: {{ g.pitch }}
      </p>
      <p class="text-sm mt-2">
        Date: {{ g.date }}
      </p>
    </div>
  </section>
</template>