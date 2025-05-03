<script setup>
import { ref, computed } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'

// Default selection
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

// Full scoreboard data
const allTables = {
  Male: {
    Elite: [
      { team: 'Tigers', played: 3, points: 9, rank: 1 },
      { team: 'Lions', played: 3, points: 6, rank: 2 },
      { team: 'Bulls', played: 3, points: 3, rank: 3 },
      { team: 'Sharks', played: 3, points: 2, rank: 4 },
      { team: 'Wolves', played: 3, points: 1, rank: 5 },
      { team: 'Rhinos', played: 3, points: 0, rank: 6 }
    ],
    Social: [
      { team: 'Otters', played: 3, points: 7, rank: 1 },
      { team: 'Badgers', played: 3, points: 5, rank: 2 },
      { team: 'Hawks', played: 3, points: 4, rank: 3 },
      { team: 'Crows', played: 3, points: 3, rank: 4 }
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

// compute only the slice we need
const tableRows = computed(() => {
  const gender = selectedGender.value
  const type   = selectedType.value || 'default'
  return allTables[gender]?.[type] || []
})

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
}
</script>

<template>
  <main class="wrapper pt-24 space-y-10">
    <!-- Gender Selection -->
    <GenderButtons @updateSelection="handleSelection" />

    <!-- Full Table (no button) -->
    <ScoreboardPreview
      :rows="tableRows"
      :showButton="false"
    />
  </main>
</template>
