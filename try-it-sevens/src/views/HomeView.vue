<!-- src/views/HomeView.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'
import GamesList from '@/components/GamesList.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import { useGamesStore } from '@/stores/games'
import { useScoreboardStore } from '@/stores/scoreboard'

const router         = useRouter()
const gamesStore     = useGamesStore()
const scoreboardStore= useScoreboardStore()

const selectedGender = ref('Male')
const selectedType   = ref('Elite')

const currentGames   = ref([])
const upcomingGames  = ref([])
const previousGames  = ref([])

// New: which section is currently shown
const activeSection  = ref('current')

function classifyGames() {
  const now = new Date()

  // filter list by gender/type
  const list = gamesStore.list.filter(g =>
    g.gender === selectedGender.value &&
    (g.type   || 'All') === (selectedType.value || 'All')
  )

  // reset
  currentGames.value  = []
  upcomingGames.value = []
  previousGames.value = []

  // bucket
  for (const g of list) {
    const kickoff = new Date(g.kickoffTime)
    const diff    = (kickoff - now) / 60000

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

  // auto-select the first non-empty
  if (currentGames.value.length) {
    activeSection.value = 'current'
  }
  else if (upcomingGames.value.length) {
    activeSection.value = 'upcoming'
  }
  else {
    activeSection.value = 'previous'
  }
}

async function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type

  await gamesStore.fetchGames({ gender, type })
  await scoreboardStore.fetchByCategory(gender, type)
  classifyGames()
}

function goTo(section) {
  router.push({ path: '/games', hash: `#${section}` })
}

// manual override when clicking toggle buttons
function showCurrent()  { activeSection.value = 'current' }
function showUpcoming() { activeSection.value = 'upcoming' }
function showPrevious() { activeSection.value = 'previous' }

let timer
onMounted(async () => {
  await gamesStore.fetchGames({ gender: selectedGender.value, type: selectedType.value })
  await scoreboardStore.fetchByCategory(selectedGender.value, selectedType.value)
  classifyGames()

  timer = setInterval(classifyGames, 60_000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <main class="wrapper space-y-10">
    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />

    <ScoreboardPreview :rows="scoreboardStore.table" />

    <h2 class="main-sub-heading mb-4">Matches</h2>
    <div class="toggle-container">
      <button
        @click="showCurrent"
        class="matches-btn"
        :class="activeSection==='current' ? 'bg-[#96D1F2] text-black' : 'text-white'"
      >
        Current
      </button>
      <button
        @click="showUpcoming"
        class="matches-btn"
        :class="activeSection==='upcoming' ? 'bg-[#96D1F2] text-black' : 'text-white'"
      >
        Upcoming
      </button>
      <button
        @click="showPrevious"
        class="matches-btn"
        :class="activeSection==='previous' ? 'bg-[#96D1F2] text-black' : 'text-white'"
      >
        Previous
      </button>
    </div>

    <template v-if="activeSection === 'current'">
      <!-- when we have games -->
      <template v-if="currentGames.length">
        <GamesList
          :games="currentGames"
          title="Current Games"
          highlightSecond
        />
        <RouterLink to="/games" class="v-all">View all</RouterLink>
      </template>
    
      <!-- when we have no games -->
      <p v-else class="text-center text-gray-500">
        There are no matches at the moment
      </p>
    </template>
    

    <template v-else-if="activeSection === 'upcoming'">
      <GamesList :games="upcomingGames" title="Upcoming Games" highlightSecond />
      <RouterLink to="/games" class="v-all">View all</RouterLink>
    </template>

    <template v-else>
      <GamesList :games="previousGames" title="Previous Games" highlightSecond />
      <RouterLink to="/games" class="v-all">View all</RouterLink>
    </template>

    <div class="spacer"></div>

    <MapDisplay />

  </main>
</template>

<style scoped>
  .v-all {
    margin: 0 auto;
    background: #231F20;
    padding: 12px 30px;
    color: #96D1F2;
    font-weight: 400;
    letter-spacing: 1px;
    border-radius: 12px;
    width: max-content;
    display: block;
    text-align: center;
  }
</style>
