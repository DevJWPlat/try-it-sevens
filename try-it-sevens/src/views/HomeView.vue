<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'
import GamesList from '@/components/GamesList.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import Sponsors from '@/components/Sponsors.vue'
import FollowUs from '@/components/FollowUs.vue'

const router = useRouter()

const selectedGender = ref('Male')
const selectedType = ref('Elite')

// Table data
const allTables = {
  Male: {
    Elite: [
      { team: 'Tigers', played: 3, points: 9, rank: 1 },
      { team: 'Lions', played: 3, points: 6, rank: 2 },
      { team: 'Bulls', played: 3, points: 3, rank: 3 }
    ],
    Social: [
      { team: 'Otters', played: 3, points: 7, rank: 1 },
      { team: 'Badgers', played: 3, points: 5, rank: 2 }
    ]
  },
  Ladies: {
    default: [
      { team: 'Queens', played: 3, points: 8, rank: 1 },
      { team: 'Stars', played: 3, points: 5, rank: 2 },
      { team: 'Valkyries', played: 3, points: 3, rank: 3 }
    ]
  },
  Juniors: {
    default: [
      { team: 'Mini Tigers', played: 3, points: 6, rank: 1 },
      { team: 'Tiny Bulls', played: 3, points: 4, rank: 2 },
      { team: 'Young Lions', played: 3, points: 2, rank: 3 }
    ]
  }
}

// Game data for HomeView
const allGames = {
  Male: {
    Elite: [
      { teamA: 'Tigers',   teamB: 'Lions',   kickoffTime: '2025-05-02T19:30:00', pitch: 'Pitch 1', scoreA: 7, scoreB: 0 },
      { teamA: 'Bulls',    teamB: 'Wolves',  kickoffTime: '2025-05-02T20:00:00', pitch: 'Pitch 2', scoreA: 0, scoreB: 0 },
      { teamA: 'Jaguars',  teamB: 'Tryit',   kickoffTime: '2025-05-02T21:00:00', pitch: 'Pitch 2', scoreA: 0, scoreB: 0 }
    ],
    Social: [
      { teamA: 'Otters',   teamB: 'Badgers', kickoffTime: '2025-05-02T18:45:00', pitch: 'Pitch 2', scoreA: 0, scoreB: 0 }
    ]
  },
  Ladies: {
    default: [
      { teamA: 'Queens',   teamB: 'Stars',   kickoffTime: '2025-05-02T18:00:00', pitch: 'Pitch 3', scoreA: 0, scoreB: 0 }
    ]
  },
  Juniors: {
    default: [
      { teamA: 'Mini Tigers', teamB: 'Tiny Bulls', kickoffTime: '2025-05-02T17:00:00', pitch: 'Pitch 4', scoreA: 0, scoreB: 0 }
    ]
  }
}

// Calculate rows for scoreboard
const tableRows = computed(() => {
  const gender = selectedGender.value
  const type = selectedType.value || 'default'
  return allTables[gender]?.[type] || []
})

// Game categories
const currentGames  = ref([])
const upcomingGames = ref([])
const previousGames = ref([])

function classifyGames() {
  const now = new Date()
  const games = allGames[selectedGender.value]?.[selectedType.value || 'default'] || []

  currentGames.value = []
  upcomingGames.value = []
  previousGames.value = []

  for (const g of games) {
    const diff = (new Date(g.kickoffTime) - now) / 60000 // minutes
    if (diff >= -5 && diff <= 20)       currentGames.value.push(g)
    else if (diff > 5)                  upcomingGames.value.push(g)
    else if (diff < -20)                previousGames.value.push(g)
  }
}

// Watch for selection changes
watch([selectedGender, selectedType], classifyGames)

// Initial and interval run
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

// Navigation helper
function goTo(section) {
  router.push({ path: '/games', hash: `#${section}` })
}
</script>

<template>
  <main class="wrapper pt-20 space-y-10">
    <!-- Gender Selection -->
    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />

    <!-- Scoreboard Preview -->
    <ScoreboardPreview :rows="tableRows" />

    <!-- Games Section Logic -->
    <template v-if="currentGames.length">
      <GamesList
        :games="currentGames"
        title="Current Games"
        highlightSecond
      />
      <div class="flex justify-center gap-4">
        <button @click="goTo('upcoming')" class="btn">View Upcoming</button>
        <button @click="goTo('previous')" class="btn">View Previous</button>
      </div>
    </template>

    <template v-else-if="upcomingGames.length">
      <GamesList
        :games="upcomingGames"
        title="Upcoming Games"
        highlightSecond
      />
      <div class="flex justify-center">
        <button @click="goTo('previous')" class="btn">View Previous</button>
      </div>
    </template>

    <template v-else>
      <GamesList
        :games="previousGames"
        title="Previous Games"
        highlightSecond
      />
    </template>

    <!-- Map & Sponsors -->
    <MapDisplay />
    <Sponsors />
    <FollowUs />
  </main>
</template>

<style>

</style>
