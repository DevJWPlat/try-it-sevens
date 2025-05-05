<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
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
    const diff = (kickoff - now) / 60000

    if (diff >= -5 && diff <= 20) currentGames.value.push(game)
    else if (diff > 5) upcomingGames.value.push(game)
    else if (diff < -20) previousGames.value.push(game)
  }
}

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value = type
  store.fetchByCategory(gender, type).then(classifyGames)
}

watch([selectedGender, selectedType], () => {
  store.fetchByCategory(selectedGender.value, selectedType.value).then(classifyGames)
})

onMounted(() => {
  store.fetchByCategory(selectedGender.value, selectedType.value).then(classifyGames)
  setInterval(classifyGames, 60000)
})
</script>

<template>
  <main class="wrapper pt-20 space-y-10">
    <GenderButtons @updateSelection="handleSelection" />
    <GamesList :games="store.list" title="All Games" highlightSecond />

    <GamesList v-if="currentGames.length" :games="currentGames" title="Current Games" />
    <GamesList v-if="upcomingGames.length" :games="upcomingGames" title="Upcoming Games" />
    <GamesList v-if="previousGames.length" :games="previousGames" title="Previous Games" />
  </main>
</template>
