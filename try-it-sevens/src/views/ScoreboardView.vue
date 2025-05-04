<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'
import { useScoreboardStore } from '@/stores/scoreboard'

// Default selection
const store = useScoreboardStore()
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

// Full scoreboard data
// 

watch([selectedGender, selectedType], () => {
  store.fetchByCategory(selectedGender.value, selectedType.value)
})

// on page load
onMounted(() => {
  store.fetchByCategory(selectedGender.value, selectedType.value)
})

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
    <ScoreboardPreview :rows="store.table" :showButton="false" />
  </main>
</template>
