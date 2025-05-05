<script setup>
import { ref, watch, onMounted } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import ScoreboardPreview from '@/components/ScoreboardPreview.vue'
import { useScoreboardStore } from '@/stores/scoreboard'

const store = useScoreboardStore()
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
  store.fetchByCategory(gender, type)
}

watch([selectedGender, selectedType], async () => {
  if (selectedGender.value && selectedType.value) {
    await store.fetchByCategory(selectedGender.value, selectedType.value)
  }
})


onMounted(async () => {
  if (selectedGender.value && selectedType.value) {
    await store.fetchByCategory(selectedGender.value, selectedType.value)
  }
})

</script>

<template>
  <main class="wrapper pt-24 space-y-10">
    <GenderButtons @updateSelection="handleSelection" />
    <ScoreboardPreview :rows="store.table" :showButton="false" />
  </main>
</template>
