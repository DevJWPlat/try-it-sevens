<script setup>
import { ref, watch, onMounted } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import GamesList from '@/components/GamesList.vue'
import { useGamesStore } from '@/stores/games'


const store = useGamesStore()
const selectedGender = ref('Male')
const selectedType   = ref('Elite')


// const allGames = {
//   Male: {
//     Elite: [
//       {
//         teamA: 'Tigers',
//         teamB: 'Lions',
//         kickoffTime: '2025-05-02T19:30:00',
//         pitch: 'Pitch 1',
//         scoreA: 7,
//         scoreB: 0
//       },
//       {
//         teamA: 'Bulls',
//         teamB: 'Wolves',
//         kickoffTime: '2025-05-02T20:00:00',
//         pitch: 'Pitch 2',
//         scoreA: 0,
//         scoreB: 0
//       },
//       {
//         teamA: 'Jaguars',
//         teamB: 'Tryit',
//         kickoffTime: '2025-05-02T21:00:00',
//         pitch: 'Pitch 2',
//         scoreA: 0,
//         scoreB: 0
//       }
//     ],
//     Social: []
//   },
//   Ladies: { default: [] },
//   Juniors: { default: [] }
// }

watch([selectedGender, selectedType], () => {
  store.fetchByCategory(selectedGender.value, selectedType.value)
})
onMounted(() => {
  store.fetchByCategory(selectedGender.value, selectedType.value)
})

const currentGames  = ref([])
const upcomingGames = ref([])
const previousGames = ref([])

function classifyGames() {
  const now    = new Date()
  const gender = selectedGender.value
  const type   = selectedType.value || 'default'
  const list   = allGames[gender]?.[type] || []

  currentGames.value  = []
  upcomingGames.value = []
  previousGames.value = []

  for (const game of list) {
    const kickoff = new Date(game.kickoffTime)
    const diff    = (kickoff - now) / 60000 // in minutes

    if (diff >= -5 && diff <= 20)      currentGames.value.push(game)
    else if (diff > 5)                 upcomingGames.value.push(game)
    else if (diff < -20)               previousGames.value.push(game)
  }
}

watch([selectedGender, selectedType], classifyGames)

let timer
onMounted(() => {
  classifyGames()
  timer = setInterval(classifyGames, 60000)
})
onUnmounted(() => clearInterval(timer))

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// show “Now” if within a minute
function isNow(time) {
  const diff = (new Date(time) - new Date()) / 1000
  return diff >= -60 && diff <= 60
}
</script>

<template>
  <main class="wrapper pt-20 space-y-10">
    <GenderButtons @updateSelection="handleSelection" />
    <GamesList :games="store.list" title="All Games" highlightSecond />
    <!-- Current Games -->
    <section v-if="currentGames.length" class="space-y-4">
      <h2 class="font-bold">Current Games</h2>
      <div
        v-for="(game, index) in currentGames"
        :key="index"
        :class="['rounded-lg p-4', index === 1 ? 'bg-blue-100' : 'bg-white', 'shadow']"
      >
        <div class="text-center">
          <span class="font-semibold">{{ game.teamA }}</span>
          <span class="mx-2">{{ game.scoreA }} : {{ game.scoreB }}</span>
          <span class="font-semibold">{{ game.teamB }}</span>
        </div>
        <p class="text-sm mt-2">
          Kickoff:
          {{ isNow(game.kickoffTime) ? 'Now' : formatTime(game.kickoffTime) }}
          – {{ game.pitch }}
        </p>
      </div>
    </section>

    <!-- Upcoming Games -->
    <section v-if="upcomingGames.length" class="space-y-4">
      <h2 class="font-bold">Upcoming Games</h2>
      <div
        v-for="(game, index) in upcomingGames"
        :key="index"
        :class="['rounded-lg p-4', index === 1 ? 'bg-blue-100' : 'bg-gray-100', 'shadow']"
      >
        <div class="text-center">
          <span class="font-semibold">{{ game.teamA }}</span>
          <span class="mx-2">0 : 0</span>
          <span class="font-semibold">{{ game.teamB }}</span>
        </div>
        <p class="text-sm mt-2">
          Kickoff: {{ formatTime(game.kickoffTime) }} – {{ game.pitch }}
        </p>
      </div>
    </section>

    <!-- Previous Games -->
    <section v-if="previousGames.length" class="space-y-4">
      <h2 class="font-bold">Previous Games</h2>
      <div
        v-for="(game, index) in previousGames"
        :key="index"
        :class="['rounded-lg p-4', index === 1 ? 'bg-blue-100' : 'bg-gray-200', 'shadow']"
      >
        <div class="text-center">
          <span class="font-semibold">{{ game.teamA }}</span>
          <span class="mx-2">{{ game.scoreA }} : {{ game.scoreB }}</span>
          <span class="font-semibold">{{ game.teamB }}</span>
        </div>
        <p class="text-sm mt-2">
          Kickoff: {{ formatTime(game.kickoffTime) }} – {{ game.pitch }}
        </p>
      </div>
    </section>
  </main>
</template>
