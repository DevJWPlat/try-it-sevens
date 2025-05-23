<!-- src/views/GamesView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useGamesStore } from '@/stores/games'
import GenderButtons from '@/components/GenderButtons.vue'
import GamesList from '@/components/GamesList.vue'
import MapDisplay from '@/components/MapDisplay.vue'

const store = useGamesStore()

const selectedGender = ref('Male')
const selectedType   = ref('Elite')

const currentGames  = ref([])
const upcomingGames = ref([])
const previousGames = ref([])

function classifyGames() {
  const now = new Date()
  currentGames.value  = []
  upcomingGames.value = []
  previousGames.value = []

  for (const g of store.list) {
    const kickoff = new Date(g.kickoffTime)
    const diffMin  = (kickoff - now) / 60000

    if (diffMin >= -5 && diffMin <= 5) {
      currentGames.value.push(g)
    } else if (diffMin > 5) {
      upcomingGames.value.push(g)
    } else {
      previousGames.value.push(g)
    }
  }
}

async function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = gender === 'Male' ? type : 'All'

  await store.fetchGames({ gender, type: selectedType.value })
  classifyGames()
}

onMounted(async () => {
  await store.fetchGames({ gender: selectedGender.value, type: selectedType.value })
  classifyGames()
  setInterval(classifyGames, 60_000)
})
</script>

<template>
  <main class="wrapper space-y-10">
    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />
    <h2 class="main-sub-heading mb-4">Current games</h2>
    <GamesList
      v-if="currentGames.length"
      :games="currentGames"
      title="Current Games"
    />
    <p v-else class="text-center text-gray-500">
      There are no matches at the moment
    </p>
    <h2 class="main-sub-heading mb-4">Upcoming games</h2>
    <GamesList
      v-if="upcomingGames.length"
      :games="upcomingGames"
      title="Upcoming Games"
    />
    <p v-else class="text-center text-gray-500">
      There are no upcoming matches
    </p>
    <h2 class="main-sub-heading mb-4">Previous games</h2>
    <GamesList
      v-if="previousGames.length"
      :games="previousGames"
      title="Previous Games"
    />
    <p v-else class="text-center text-gray-500">
      No matches have been played yet
    </p>
    <MapDisplay />
  </main>
</template>

