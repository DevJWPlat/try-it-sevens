<!-- src/views/admin/GamePlannerView.vue -->
<script setup>
import { ref, reactive, computed } from 'vue'
import GenderButtons from '@/components/GenderButtons.vue'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'

// --- 1) Filters ---
const selectedGender = ref('Male')
const selectedType   = ref('Elite')
function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
}

// --- 2) Your games data (per category) ---
const allGames = reactive({
  Male: {
    Elite: [
      { teamA:'Tigers', teamB:'Lions',  kickoffTime:'2025-05-02T19:30', pitch:1, scoreA:7, scoreB:0 },
      { teamA:'Bulls',  teamB:'Wolves', kickoffTime:'2025-05-02T20:00', pitch:2, scoreA:0, scoreB:0 },
      { teamA:'Jaguars',teamB:'Tryit',  kickoffTime:'2025-05-02T21:00', pitch:2, scoreA:0, scoreB:0 }
    ],
    Social: []
  },
  Ladies: { default: [] },
  Juniors:{ default: [] }
})

// only the array for your current filter
const displayedGames = computed(() => {
  const g = selectedGender.value
  const t = selectedType.value || 'default'
  return allGames[g]?.[t] ?? []
})

// --- 3) Edit dialog state ---
const showEdit      = ref(false)
const showDeleteConfirm = ref(false)
const editIndex    = ref(null)
const form = reactive({
  kickoffTime: '',
  pitch: 1,
  scoreA: 0,
  scoreB: 0
})

function openEdit() {
  showEdit.value = true
  editIndex.value = null
}
function closeEdit() {
  showEdit.value = false
  showDeleteConfirm.value = false
}

// when user picks a game to edit, populate the form
function selectGame(idx) {
  editIndex.value = idx
  const g = displayedGames.value[idx]
  form.kickoffTime = g.kickoffTime
  form.pitch        = g.pitch
  form.scoreA       = g.scoreA
  form.scoreB       = g.scoreB
}

// save back into the array
function saveGame() {
  if (editIndex.value !== null) {
    const g = displayedGames.value[editIndex.value]
    g.kickoffTime = form.kickoffTime
    g.pitch       = form.pitch
    g.scoreA      = form.scoreA
    g.scoreB      = form.scoreB
  }
  closeEdit()
}
function openAdd() {
  // TODO: wire up your real “add a game” dialog here
  console.log('add games clicked')
}

// delete with confirmation
function askDelete() {
  showDeleteConfirm.value = true
}
function deleteGame() {
  if (editIndex.value !== null) {
    displayedGames.value.splice(editIndex.value, 1)
  }
  closeEdit()
}
</script>

<template>
  <main class="wrapper pt-20 space-y-6 max-w-lg mx-auto">

    <!-- breadcrumbs + title -->
    <Breadcrumbs />

    <!-- add stub -->
    <button
      class="block w-full mb-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      @click="openAdd"
    >Add game</button>

    <!-- gender/type filters -->
    <GenderButtons @updateSelection="handleSelection" />

    <!-- all games header + edit button -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">All Games</h2>
      <button
        class="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        @click="openEdit"
      >
        Edit Games
      </button>
    </div>

    <!-- games table -->
    <div class="overflow-x-auto border border-gray-300 rounded-lg">
      <table class="w-full text-left">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-3 py-2">Team A</th>
            <th class="px-3 py-2">Score A</th>
            <th class="px-3 py-2">Team B</th>
            <th class="px-3 py-2">Score B</th>
            <th class="px-3 py-2">Kickoff</th>
            <th class="px-3 py-2">Pitch</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(g,i) in displayedGames"
            :key="i"
            class="even:bg-gray-50"
          >
            <td class="px-3 py-2">{{ g.teamA }}</td>
            <td class="px-3 py-2">{{ g.scoreA }}</td>
            <td class="px-3 py-2">{{ g.teamB }}</td>
            <td class="px-3 py-2">{{ g.scoreB }}</td>
            <td class="px-3 py-2">{{ new Date(g.kickoffTime).toLocaleString([], { hour:'2-digit', minute:'2-digit' }) }}</td>
            <td class="px-3 py-2">{{ g.pitch }}</td>
          </tr>
          <tr v-if="!displayedGames.length">
            <td colspan="6" class="px-3 py-4 text-center text-gray-500">
              No games in this category.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- EDIT MODAL -->
    <div
      v-if="showEdit"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h3 class="text-xl font-semibold">Edit a game</h3>

        <!-- 1) pick game -->
        <label>
          Choose game
          <select
            v-model.number="editIndex"
            @change="selectGame(editIndex)"
            class="block w-full mt-1 border rounded p-2"
          >
            <option :value="null" disabled>Select…</option>
            <option
              v-for="(g,i) in displayedGames"
              :key="i"
              :value="i"
            >
              {{ g.teamA }} vs {{ g.teamB }} @
              {{ new Date(g.kickoffTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }}
            </option>
          </select>
        </label>

        <div v-if="editIndex !== null" class="space-y-3">

          <!-- 2) kickoff time -->
          <label class="block">
            Kickoff time
            <input
              type="datetime-local"
              v-model="form.kickoffTime"
              class="block w-full mt-1 border rounded p-2"
            />
          </label>

          <!-- 3) pitch dropdown -->
          <label class="block">
            Pitch
            <select v-model.number="form.pitch" class="block w-full mt-1 border rounded p-2">
              <option v-for="n in [1,2,3]" :key="n" :value="n">Pitch {{ n }}</option>
            </select>
          </label>

          <!-- 4) scores -->
          <div class="flex gap-4">
            <label class="flex-1 block">
              {{ displayedGames[editIndex].teamA }} score
              <input
                type="number"
                v-model.number="form.scoreA"
                min="0"
                class="block w-full mt-1 border rounded p-2"
              />
            </label>
            <label class="flex-1 block">
              {{ displayedGames[editIndex].teamB }} score
              <input
                type="number"
                v-model.number="form.scoreB"
                min="0"
                class="block w-full mt-1 border rounded p-2"
              />
            </label>
          </div>

          <!-- save & delete -->
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="saveGame"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save game
            </button>
            <button
              @click="askDelete"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- delete confirm -->
        <div v-if="showDeleteConfirm" class="mt-4 p-4 bg-red-100 rounded">
          <p class="text-red-700">Are you sure you want to delete this game?</p>
          <div class="flex justify-end gap-2 mt-2">
            <button
              @click="deleteGame"
              class="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Yes, delete
            </button>
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- close dialog -->
        <button
          @click="closeEdit"
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* nothing extra for now */
</style>
