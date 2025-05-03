<!-- src/views/admin/ScoreboardView.vue -->
<script setup>
import { ref, reactive, computed } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'

// Selected gender & type
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

// Stubbed data for each category
const allTables = {
  Male: {
    Elite: [
      { team: 'Tigers', played: 3, wins: 3, draws: 0, losses: 0, points: 9 },
      { team: 'Lions',  played: 3, wins: 2, draws: 0, losses: 1, points: 6 },
      { team: 'Bulls',  played: 3, wins: 1, draws: 0, losses: 2, points: 3 },
      { team: 'Wolves', played: 3, wins: 0, draws: 1, losses: 2, points: 1 }
    ],
    Social: [
      { team: 'Otters',  played: 3, wins: 2, draws: 1, losses: 0, points: 7 },
      { team: 'Badgers', played: 3, wins: 1, draws: 1, losses: 1, points: 4 },
      { team: 'Hares',   played: 3, wins: 0, draws: 0, losses: 3, points: 0 }
    ]
  },
  Ladies: {
    default: [
      { team: 'Queens',    played: 3, wins: 3, draws: 0, losses: 0, points: 9 },
      { team: 'Stars',     played: 3, wins: 1, draws: 1, losses: 1, points: 4 },
      { team: 'Valkyries', played: 3, wins: 0, draws: 0, losses: 3, points: 0 }
    ]
  },
  Juniors: {
    default: [
      { team: 'Mini Tigers', played: 3, wins: 2, draws: 0, losses: 1, points: 6 },
      { team: 'Tiny Bulls',  played: 3, wins: 1, draws: 0, losses: 2, points: 3 },
      { team: 'Young Lions', played: 3, wins: 0, draws: 1, losses: 2, points: 1 }
    ]
  }
}

// Pull out the right table
const rows = computed(() => {
  const g = selectedGender.value
  const t = selectedType.value || 'default'
  // deep‐clone so v-model won’t mutate allTables directly
  return JSON.parse(JSON.stringify(allTables[g][t] || []))
})

// are we in “edit mode”?
const isEditing = ref(false)

// start editing
function startEdit() {
  isEditing.value = true
}

// save & exit edit mode
function save() {
  // TODO: persist `rows.value` to your backend
  console.log('Saving scoreboard for', selectedGender.value, selectedType.value, rows.value)
  alert('Scoreboard saved (stub)')
  isEditing.value = false
}

// handle gender/type change
function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
  isEditing.value      = false  // exit edit mode on switch
}
</script>

<template>
  <main class="wrapper pt-20 max-w-md mx-auto space-y-6">
    <!-- pick Male/Ladies/Juniors + Elite/Social -->
    <GenderButtons @updateSelection="handleSelection" />

    <!-- page heading -->
    <h1 class="text-2xl font-bold">Admin Dashboard / Scoreboard</h1>

    <!-- Edit button -->
    <button
      v-if="!isEditing"
      @click="startEdit"
      class="block ml-auto mb-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
    >
      Edit
    </button>

    <!-- scoreboard table -->
    <div class="overflow-x-auto bg-black text-white rounded-lg p-4 shadow-lg">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="px-4 py-2 text-left">Team</th>
            <th class="px-2 py-2">Played</th>
            <th class="px-2 py-2">Wins</th>
            <th class="px-2 py-2">Draws</th>
            <th class="px-2 py-2">Losses</th>
            <th class="px-2 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in rows"
            :key="i"
            class="even:bg-black/80"
          >
            <td class="px-4 py-2 text-left">{{ row.team }}</td>

            <td class="px-2 py-2">
              <template v-if="isEditing">
                <input
                  type="number"
                  v-model.number="row.played"
                  class="w-16 text-black rounded"
                />
              </template>
              <template v-else>{{ row.played }}</template>
            </td>

            <td class="px-2 py-2">
              <template v-if="isEditing">
                <input
                  type="number"
                  v-model.number="row.wins"
                  class="w-16 text-black rounded"
                />
              </template>
              <template v-else>{{ row.wins }}</template>
            </td>

            <td class="px-2 py-2">
              <template v-if="isEditing">
                <input
                  type="number"
                  v-model.number="row.draws"
                  class="w-16 text-black rounded"
                />
              </template>
              <template v-else>{{ row.draws }}</template>
            </td>

            <td class="px-2 py-2">
              <template v-if="isEditing">
                <input
                  type="number"
                  v-model.number="row.losses"
                  class="w-16 text-black rounded"
                />
              </template>
              <template v-else>{{ row.losses }}</template>
            </td>

            <td class="px-2 py-2">
              <template v-if="isEditing">
                <input
                  type="number"
                  v-model.number="row.points"
                  class="w-16 text-black rounded"
                />
              </template>
              <template v-else>{{ row.points }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Save Changes -->
    <button
      v-if="isEditing"
      @click="save"
      class="block w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
    >
      Save Changes
    </button>
  </main>
</template>

<style scoped>
/* white focus ring for inputs */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.5);
}
</style>
