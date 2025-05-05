<script setup>
import { ref, onMounted } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import GamesList from '@/components/GamesList.vue'
import { useGamesStore } from '@/stores/games'

const store = useGamesStore()
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

const currentGames  = ref([])
const upcomingGames = ref([])
const previousGames = ref([])

function classifyGames() {
  const now = new Date()
  currentGames.value = []
  upcomingGames.value = []
  previousGames.value = []

  for (const game of store.list) {
    const kickoff = new Date(game.kickoffTime)
    const sameDate = kickoff.toDateString() === now.toDateString()
    const diffMin   = (kickoff - now) / 60000

    // Current: within ±5 minutes and same date
    if (sameDate && Math.abs(diffMin) <= 5) {
      currentGames.value.push(game)

    // Upcoming: not complete and more than 5 minutes until kickoff
    } else if (!game.is_complete && diffMin > 5) {
      upcomingGames.value.push(game)

    // Previous: complete or more than 30 minutes past kickoff
    } else if (game.is_complete || diffMin < -30) {
      previousGames.value.push(game)
    }
  }
}

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
  store.fetchGames({ gender, type }).then(classifyGames)
}

onMounted(() => {
  // Initial load with default filters
  store.fetchGames({ gender: selectedGender.value, type: selectedType.value })
    .then(classifyGames)

  // Re-classify every minute
  setInterval(classifyGames, 60000)
})
</script>


<template>
  <main class="wrapper pt-20 space-y-10">
    <GenderButtons @updateSelection="handleSelection" />

    <GamesList
      v-if="currentGames.length"
      :games="currentGames"
      title="Current Games"
    />
    <GamesList
      v-if="upcomingGames.length"
      :games="upcomingGames"
      title="Upcoming Games"
    />
    <GamesList
      v-if="previousGames.length"
      :games="previousGames"
      title="Previous Games"
    />
  </main>
</template>