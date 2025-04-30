<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  selectedGender: String,
  selectedType: String
})

const emit = defineEmits(['updateSelection'])

const showTypes = ref(props.selectedGender === 'Male')

// Watch gender to control if type buttons are visible
watch(() => props.selectedGender, (newGender) => {
  showTypes.value = newGender === 'Male'
})

// Emit when gender is selected
function selectGender(gender) {
  const type = gender === 'Male' ? 'Elite' : 'default'
  emit('updateSelection', { gender, type })
}

// Emit when Male type (Elite/Social) is selected
function selectType(type) {
  emit('updateSelection', { gender: props.selectedGender, type })
}
</script>

<template>
  <div class="space-y-4 text-center">
    <div class="flex justify-center gap-4">
      <button
        class="px-4 py-2 rounded-lg text-white transition"
        :class="[
          selectedGender === 'Male' ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
        ]"
        @click="selectGender('Male')"
      >
        Male
      </button>
      <button
        class="px-4 py-2 rounded-lg text-white transition"
        :class="[
          selectedGender === 'Ladies' ? 'bg-pink-600' : 'bg-pink-500 hover:bg-pink-600'
        ]"
        @click="selectGender('Ladies')"
      >
        Ladies
      </button>
      <button
        class="px-4 py-2 rounded-lg text-white transition"
        :class="[
          selectedGender === 'Juniors' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
        ]"
        @click="selectGender('Juniors')"
      >
        Juniors
      </button>
    </div>

    <div v-if="showTypes" class="flex justify-center gap-4">
      <button
        class="px-4 py-2 rounded-lg border text-emerald-500 transition"
        :class="selectedType === 'Elite' ? 'bg-emerald-200 border-emerald-500' : 'hover:bg-emerald-100 border-emerald-300'"
        @click="selectType('Elite')"
      >
        Elite
      </button>
      <button
        class="px-4 py-2 rounded-lg border text-emerald-500 transition"
        :class="selectedType === 'Social' ? 'bg-emerald-200 border-emerald-500' : 'hover:bg-emerald-100 border-emerald-300'"
        @click="selectType('Social')"
      >
        Social
      </button>
    </div>
  </div>
</template>
