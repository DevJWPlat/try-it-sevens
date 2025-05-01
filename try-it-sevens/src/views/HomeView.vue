<script setup>
import { ref, computed } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'
import CurrentGames from '@/components/CurrentGames.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import Sponsors from '@/components/Sponsors.vue'

const selectedGender = ref('Male')
const selectedType = ref('Elite')

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
const currentGamesData = {
  Male: {
    Elite: [
      {
        teamA: 'Tigers',
        teamB: 'Lions',
        kickoff: '12:00',
        pitch: 'Pitch 1'
      }
    ],
    Social: [
      {
        teamA: 'Otters',
        teamB: 'Badgers',
        kickoff: '13:00',
        pitch: 'Pitch 2'
      }
    ]
  },
  Ladies: {
    default: [
      {
        teamA: 'Queens',
        teamB: 'Stars',
        kickoff: '14:00',
        pitch: 'Pitch 3'
      }
    ]
  },
  Juniors: {
    default: [
      {
        teamA: 'Mini Tigers',
        teamB: 'Tiny Bulls',
        kickoff: '15:00',
        pitch: 'Pitch 4'
      }
    ]
  }
}

const tableRows = computed(() => {
  const gender = selectedGender.value
  const type = selectedType.value || 'default'
  return allTables[gender]?.[type] || []
})

const currentGames = computed(() => {
  const gender = selectedGender.value
  const type = selectedType.value || 'default'
  return currentGamesData[gender]?.[type] || []
})

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value = type
}
</script>

<template>
  <main class="wrapper pt-20 space-y-10">
    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />
    <ScoreboardPreview :rows="tableRows" />

    <CurrentGames :games="currentGames" />
    <MapDisplay />
    <Sponsors />
  </main>
</template>
