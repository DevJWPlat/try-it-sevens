<script setup>
import { ref, computed } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'

// Mocked game data per gender and type
const gamesData = {
  Male: {
    Elite: {
      current: [
        { teamA: 'Sharks', scoreA: 7, teamB: 'Wolves', scoreB: 0, pitch: 'Pitch 1', kickoff: 'Now' },
        { teamA: 'Falcons', scoreA: 0, teamB: 'Rhinos', scoreB: 0, pitch: 'Pitch 2', kickoff: 'Now' },
        { teamA: 'Otters', scoreA: 0, teamB: 'Lions', scoreB: 0, pitch: 'Pitch 3', kickoff: 'Now' }
      ],
      upcoming: [
        { teamA: 'Bulls', scoreA: 0, teamB: 'Tigers', scoreB: 0, pitch: 'Pitch 1', kickoff: '13:00' },
        { teamA: 'Wolves', scoreA: 0, teamB: 'Sharks', scoreB: 0, pitch: 'Pitch 2', kickoff: '13:30' }
      ],
      previous: [
        { teamA: 'Eagles', scoreA: 3, teamB: 'Otters', scoreB: 0, pitch: 'Pitch 1', kickoff: '12:00' },
        { teamA: 'Lions', scoreA: 0, teamB: 'Rhinos', scoreB: 0, pitch: 'Pitch 2', kickoff: '12:30' }
      ]
    },
    Social: { current: [], upcoming: [], previous: [] }
  },
  Ladies: { default: { current: [], upcoming: [], previous: [] } },
  Juniors: { default: { current: [], upcoming: [], previous: [] } }
}

const selectedGender = ref('Male')
const selectedType = ref('Elite')

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value = type
}

const selectedGames = computed(() => {
  const gender = selectedGender.value
  const type = selectedType.value || 'default'
  return gamesData[gender]?.[type] || { current: [], upcoming: [], previous: [] }
})
</script>

<template>
  <main class="wrapper pt-20 space-y-10">
    <GenderButtons @updateSelection="handleSelection" />

    <!-- Current Games -->
    <section v-if="selectedGames.current.length" class="space-y-2">
      <h2 class="text-lg font-semibold">Current Games</h2>
      <div v-for="(game, i) in selectedGames.current" :key="i" class="bg-white shadow p-4 rounded">
        <p class="font-bold">{{ game.teamA }} <span class="text-green-600 text-2xl">{{ game.scoreA }}</span> : <span class="text-red-600 text-2xl">{{ game.scoreB }}</span> {{ game.teamB }}</p>
        <p class="text-sm text-gray-600">Pitch: {{ game.pitch }} | Kickoff: {{ game.kickoff }}</p>
      </div>
    </section>

    <!-- Upcoming Games -->
    <section v-if="selectedGames.upcoming.length" class="space-y-2 bg-blue-50 p-4 rounded">
      <h2 class="text-lg font-semibold">Upcoming Games</h2>
      <div v-for="(game, i) in selectedGames.upcoming" :key="i" class="bg-white shadow p-4 rounded">
        <p class="font-bold">{{ game.teamA }} vs {{ game.teamB }}</p>
        <p class="text-sm text-gray-600">Pitch: {{ game.pitch }} | Kickoff: {{ game.kickoff }}</p>
      </div>
    </section>

    <!-- Previous Games -->
    <section v-if="selectedGames.previous.length" class="space-y-2">
      <h2 class="text-lg font-semibold">Previous Games</h2>
      <div v-for="(game, i) in selectedGames.previous" :key="i" class="bg-white shadow p-4 rounded">
        <p class="font-bold">{{ game.teamA }} <span class="text-green-600">{{ game.scoreA }}</span> : <span class="text-red-600">{{ game.scoreB }}</span> {{ game.teamB }}</p>
        <p class="text-sm text-gray-600">Pitch: {{ game.pitch }} | Kickoff: {{ game.kickoff }}</p>
      </div>
    </section>
  </main>
</template>
