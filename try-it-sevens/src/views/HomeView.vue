<!-- src/views/HomeView.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'
import GamesList from '@/components/GamesList.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import Sponsors from '@/components/Sponsors.vue'
import FollowUs from '@/components/FollowUs.vue'
import { useGamesStore } from '@/stores/games'
import { useScoreboardStore } from '@/stores/scoreboard'

const router = useRouter()
const gamesStore = useGamesStore()
const scoreboardStore = useScoreboardStore()

const selectedGender = ref('Male')
const selectedType   = ref('Elite')

const currentGames  = ref([])
const upcomingGames = ref([])
const previousGames = ref([])

function classifyGames() {
  const now = new Date()

  // only the games matching gender/type
  const list = gamesStore.list.filter(g =>
    g.gender === selectedGender.value &&
    (g.type   || 'All') === (selectedType.value || 'All')
  )

  currentGames.value = []
  upcomingGames.value = []
  previousGames.value = []

  for (const g of list) {
    // g.kickoffTime is the full ISO timestamp e.g. "2025-05-07T18:00:00.000Z"
    const kickoff = new Date(g.kickoffTime)
    const diff    = (kickoff - now) / 60000  // minutes difference

    if (diff >= -5 && diff <= 20) {
      currentGames.value.push(g)
    }
    else if (diff > 20) {
      upcomingGames.value.push(g)
    }
    else {
      previousGames.value.push(g)
    }
  }
}

async function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type

  // re-fetch only this category’s games & scoreboard
  await gamesStore.fetchGames({ gender, type })
  await scoreboardStore.fetchByCategory(gender, type)
  classifyGames()
}

function goTo(section) {
  router.push({ path: '/games', hash: `#${section}` })
}

let timer
onMounted(async () => {
  // initial load
  await gamesStore.fetchGames({ gender: selectedGender.value, type: selectedType.value })
  await scoreboardStore.fetchByCategory(selectedGender.value, selectedType.value)
  classifyGames()

  // re-run classification every minute to keep "Current" up-to-date
  timer = setInterval(classifyGames, 60_000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <main class="wrapper pt-20 space-y-10">
    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />

    <ScoreboardPreview :rows="scoreboardStore.table" />

    <template v-if="currentGames.length">
      <GamesList :games="currentGames" title="Current Games" highlightSecond />
      <div class="flex justify-center gap-4">
        <button @click="goTo('upcoming')" class="btn">View Upcoming</button>
        <button @click="goTo('previous')" class="btn">View Previous</button>
      </div>
    </template>

    <template v-else-if="upcomingGames.length">
      <GamesList :games="upcomingGames" title="Upcoming Games" highlightSecond />
      <div class="flex justify-center">
        <button @click="goTo('previous')" class="btn">View Previous</button>
      </div>
    </template>

    <template v-else>
      <GamesList :games="previousGames" title="Previous Games" highlightSecond />
    </template>

    <MapDisplay />
    <Sponsors />
    <FollowUs />
  </main>
</template>
