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
    <div class="toggle-container">
      <button
        class="gender-btn-main transition"
        :class="{ 'bg-[#96D1F2] text-black': selectedGender === 'Male',
        'text-white': props.selectedGender !== 'Male' }"
        @click="selectGender('Male')"
      >
        Mens
      </button>
      <button
        class="gender-btn-main transition"
        :class="{ 'bg-[#96D1F2] text-black': selectedGender === 'Ladies',
        'text-white': props.selectedGender !== 'Ladies' }"
        @click="selectGender('Ladies')"
      >
        Ladies
      </button>
      <button
        class="gender-btn-main transition"
        :class="{ 'bg-[#96D1F2] text-black': selectedGender === 'Juniors',
        'text-white': props.selectedGender !== 'Juniors' }"
        @click="selectGender('Juniors')"
      >
        Juniors
      </button>
    </div>

    <!-- only for Male -->
    <div v-if="showTypes" class="toggle-container">

      <button
        class="gender-btn-type transition"
        :class="{ 'bg-[#96D1F2] text-black': selectedType === 'Elite',
        'text-white': props.selectedType !== 'Elite' }"
        @click="selectType('Elite')"
      >
        Elite
      </button>
      <button
        class="gender-btn-type transition"
        :class="{ 'bg-[#96D1F2] text-black': selectedType === 'Social',
        'text-white': props.selectedType !== 'Social' }"
        @click="selectType('Social')"
      >
        Social
      </button>
    </div>
  </div>
</template>

<style scoped>
.toggle-container {
  width: 100%;
  padding: 6px;
  background: #231F20;
  border-radius: 16px;
  display: flex;
  gap: 16px;
}

.gender-btn-main {
  cursor: pointer;
  width: calc((100% - 32px) / 3);
  padding: 16px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.gender-btn-type {
  cursor: pointer;
  width: calc((100% - 16px) / 2);
  padding: 8px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
