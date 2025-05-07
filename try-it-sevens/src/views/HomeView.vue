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
  const games = gamesStore.list.filter(g =>
    g.gender === selectedGender.value &&
    (g.type || 'All') === selectedType.value
  )

  currentGames.value = []
  upcomingGames.value = []
  previousGames.value = []

  for (const g of games) {
    const kickoff = new Date(`${g.date}T${g.kickoff_time}`)
    const diff     = (kickoff - now) / 60000
    if (diff >= -5 && diff <= 20) currentGames.value.push(g)
    else if (diff > 5)            upcomingGames.value.push(g)
    else if (diff < -20)           previousGames.value.push(g)
  }
}

async function handleSelection({ gender, type }) {
  console.log('[handleSelection] selecting →', { gender, type })
  selectedGender.value = gender
  selectedType.value   = type

  try {
    await gamesStore.fetchByCategory(gender, type)
    console.log('[handleSelection] selecting →', { gender, type })
    await scoreboardStore.fetchByCategory(gender, type)
    console.log('[handleSelection] scoreboard fetched →', scoreboardStore.table)
  } catch (err) {
    console.error(err)
  }

  classifyGames()
}

let timer
onMounted(async () => {
  await handleSelection({ gender: selectedGender.value, type: selectedType.value })
  timer = setInterval(classifyGames, 60000)
})
onUnmounted(() => clearInterval(timer))

function goTo(section) {
  router.push({ path: '/games', hash: `#${section}` })
}
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
