<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGamesStore } from '@/stores/games'
import GenderButtons from '@/components/GenderButtons.vue'
import GamesList from '@/components/GamesList.vue'
import MapDisplay from '@/components/MapDisplay.vue'


const store = useGamesStore()

// Default filter values
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
    if (!g.kickoffTime) {
      upcomingGames.value.push(g)
      continue
    }

    const kickoff = new Date(g.kickoffTime)
    if (isNaN(kickoff)) {
      console.warn('Invalid kickoffTime:', g.kickoffTime)
      continue
    }

    const diffMin = (kickoff - now) / 60000

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

  console.log('handleSelection →', gender, selectedType.value)
  await store.fetchGames({ gender, type: selectedType.value })
  console.log('Games fetched:', store.list)
  classifyGames()
}

onMounted(async () => {
  console.log('onMounted fetching with:', selectedGender.value, selectedType.value)
  await store.fetchGames({ gender: selectedGender.value, type: selectedType.value })
  console.log('Games fetched:', store.list)
  classifyGames()
  setInterval(classifyGames, 60_000)
})

const typeImage = computed(() => {
  if (selectedGender.value === 'Ladies') return ladiesImage

  switch (selectedType.value) {
    case 'Elite': return eliteImage
    case 'Social': return socialImage
    default: return ''
  }
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

    <span class="disclamer">
      <b>Please note:</b> Game times and scores may not update immediately. Our volunteer organisers do their best to keep everything up to date, but there may be delays during busy periods. Thanks for your patience!
    </span>


    <MapDisplay />
  </main>
</template>


<style scoped>
  .disclamer {
    display: block;
    font-size: 14px;
    color: #6e6e6e;
  }
</style>
