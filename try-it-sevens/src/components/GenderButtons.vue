<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedGender: String,
  selectedType:   String,
})

const emit = defineEmits(['updateSelection'])

// only show Elite/Social when Male is selected
const showTypes = computed(() => props.selectedGender === 'Male')

function selectGender(gender) {
  emit('updateSelection', {
    gender,
    // Male → keep existing type if it was Male, or default to 'Elite'
    // Others → force 'All'
    type: gender === 'Male'
      ? (props.selectedGender === 'Male' ? props.selectedType : 'Elite')
      : 'All',
  })
}

function selectType(type) {
  emit('updateSelection', {
    gender: props.selectedGender,
    type,
  })
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

    <!-- only for Male -->
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
