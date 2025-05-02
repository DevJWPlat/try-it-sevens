<script setup>
defineProps({
  games: {
    type: Array,
    default: () => [] 
  }
})
</script>

<template>
  <section class="space-y-4 text-center">
    <h2 class="text-xl font-bold">Current Games</h2>
    <div
      v-for="(game, i) in games"
      :key="i"
      class="border border-gray-300 p-4 rounded-lg shadow-sm"
    >
      <div class="text-lg font-semibold">
        {{ game.teamA }} : {{ game.teamB }}
      </div>
      <div class="text-sm text-gray-600">Kickoff: {{ game.kickoff }}</div>
      <div class="text-sm text-gray-600">Pitch: {{ game.pitch }}</div>
    </div>

    <div class="flex justify-center gap-4 mt-4">
      <button class="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition">
        View Upcoming
      </button>
      <button class="bg-gray-500 text-white px-4 py-1 rounded-full hover:bg-gray-600 transition">
        See Previous
      </button>
    </div>
  </section>
</template>
