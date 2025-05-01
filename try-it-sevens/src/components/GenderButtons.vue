<script setup>
import { ref, watch, onMounted } from 'vue'
const emit = defineEmits(['updateSelection'])

const selectedGender = ref('Male')      // default on load
const selectedType = ref('Elite')       // default on load
const showTypes = ref(true)             // only for Male

// Emit on changes
watch([selectedGender, selectedType], () => {
  emit('updateSelection', {
    gender: selectedGender.value,
    type: selectedType.value
  })
})

const selectGender = (gender) => {
  selectedGender.value = gender
  showTypes.value = gender === 'Male'
  selectedType.value = showTypes.value ? 'Elite' : 'default'
}

const selectType = (type) => {
  selectedType.value = type
}
</script>

<template>
  <div class="space-y-4 text-center">
    <div class="flex justify-center gap-4">
      <button
        class="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
        :class="{ 'ring-2 ring-white': selectedGender === 'Male' }"
        @click="selectGender('Male')"
      >
        Male
      </button>
      <button
        class="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
        :class="{ 'ring-2 ring-white': selectedGender === 'Ladies' }"
        @click="selectGender('Ladies')"
      >
        Ladies
      </button>
      <button
        class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        :class="{ 'ring-2 ring-white': selectedGender === 'Juniors' }"
        @click="selectGender('Juniors')"
      >
        Juniors
      </button>
    </div>

    <div v-if="showTypes" class="flex justify-center gap-4">
      <button
        class="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-500 hover:bg-emerald-100 transition"
        :class="{ 'bg-emerald-100': selectedType === 'Elite' }"
        @click="selectType('Elite')"
      >
        Elite
      </button>
      <button
        class="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-500 hover:bg-emerald-100 transition"
        :class="{ 'bg-emerald-100': selectedType === 'Social' }"
        @click="selectType('Social')"
      >
        Social
      </button>
    </div>
  </div>
</template>
