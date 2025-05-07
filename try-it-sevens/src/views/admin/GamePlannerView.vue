<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import GenderButtons from '@/components/GenderButtons.vue'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'

const selectedGender = ref('Male')
const selectedType = ref('Elite')

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value = type
}

const teams = ref([])
const teamMap = ref({})
const allGames = ref([])

const filteredGames = computed(() => {
  return allGames.value.filter(g =>
    g.gender === selectedGender.value &&
    (g.type || 'default') === (selectedType.value || 'default')
  )
})

async function fetchData() {
  const { data: teamData } = await supabase.from('teams').select('id, name')
  teams.value = teamData || []
  teamMap.value = Object.fromEntries(teams.value.map(t => [t.id, t.name]))

  const { data: gameData } = await supabase.from('games').select('*').order('kickoff_time')
  allGames.value = gameData || []
}

const showEdit = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)

const form = reactive({
  id: null,
  gender: 'Male',
  type: 'Elite',
  team_a_id: '',
  team_b_id: '',
  score_a: 0,
  score_b: 0,
  kickoff_time: '',
  pitch: 1,
  date: '',
  is_complete: false
})

function openAdd() {
  isEditing.value = false
  Object.assign(form, {
    id: null,
    gender: selectedGender.value,
    type: selectedType.value || 'default',
    team_a_id: '',
    team_b_id: '',
    score_a: 0,
    score_b: 0,
    kickoff_time: '',
    pitch: 1,
    date: new Date().toISOString().split('T')[0],
    is_complete: false
  })
  showEdit.value = true
}

function openEditGame(game) {
  isEditing.value = true
  Object.assign(form, game)
  // Split kickoff_time into date and time
  const [date, time] = game.kickoff_time.split('T')
  form.date = date
  form.kickoff_time = time?.slice(0, 5) || ''
  showEdit.value = true
}

function closeEdit() {
  showEdit.value = false
  showDeleteConfirm.value = false
}

async function updateScoreboardOnComplete(game) {
  const { team_a_id, team_b_id, score_a, score_b, type } = game

  const points = score_a > score_b
    ? { [team_a_id]: 3, [team_b_id]: 1 }
    : score_a < score_b
    ? { [team_b_id]: 3, [team_a_id]: 1 }
    : { [team_a_id]: 2, [team_b_id]: 2 }

  const updates = []

  for (const [teamId, pts] of Object.entries(points)) {
    const { data: existing } = await supabase
      .from('scoreboard')
      .select('*')
      .eq('team_id', teamId)
      .eq('type', type)
      .maybeSingle()

    if (existing) {
      updates.push(
        supabase
          .from('scoreboard')
          .update({
            played: existing.played + 1,
            points: existing.points + pts,
            wins: existing.wins + (pts === 3 ? 1 : 0),
            draws: existing.draws + (pts === 2 ? 1 : 0),
            losses: existing.losses + (pts === 1 ? 1 : 0)
          })
          .eq('team_id', teamId)
          .eq('type', type)
      )
    } else {
      updates.push(
        supabase.from('scoreboard').insert([{
          team_id: teamId,
          type,
          played: 1,
          points: pts,
          wins: pts === 3 ? 1 : 0,
          draws: pts === 2 ? 1 : 0,
          losses: pts === 1 ? 1 : 0
        }])
      )
    }
  }

  await Promise.all(updates)
}

async function saveGame() {
  const payload = {
    gender: form.gender,
    type: form.type,
    team_a_id: form.team_a_id,
    team_b_id: form.team_b_id,
    score_a: form.score_a,
    score_b: form.score_b,
    kickoff_time: `${form.date}T${form.kickoff_time}`,
    date: form.date,
    pitch: form.pitch,
    is_complete: form.is_complete
  }

  if (isEditing.value) {
    await supabase.from('games').update(payload).eq('id', form.id)
  } else {
    const { data } = await supabase.from('games').insert([payload]).select().single()
    form.id = data?.id
  }

  if (form.is_complete) {
    await updateScoreboardOnComplete({ ...form })
  }

  await fetchData()
  closeEdit()
}

async function deleteGame() {
  await supabase.from('games').delete().eq('id', form.id)
  await fetchData()
  closeEdit()
}

onMounted(fetchData)
</script>

<template>
  <main class="wrapper pt-20 space-y-6 max-w-2xl mx-auto">
    <Breadcrumbs />
    <GenderButtons
    :selectedGender="selectedGender"
    :selectedType="selectedType"
    @updateSelection="handleSelection"
    />

    <button @click="openAdd" class="block w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition">
      Add Game
    </button>

    <div class="overflow-x-auto border border-gray-300 rounded-lg">
      <table class="w-full text-left">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-3 py-2">Team A</th>
            <th class="px-3 py-2">Score</th>
            <th class="px-3 py-2">Team B</th>
            <th class="px-3 py-2">Score</th>
            <th class="px-3 py-2">Kickoff</th>
            <th class="px-3 py-2">Date</th>
            <th class="px-3 py-2">Pitch</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in filteredGames" :key="game.id" class="even:bg-gray-50">
            <td class="px-3 py-2">{{ teamMap[game.team_a_id] || game.team_a_id }}</td>
            <td class="px-3 py-2">{{ game.score_a }}</td>
            <td class="px-3 py-2">{{ teamMap[game.team_b_id] || game.team_b_id }}</td>
            <td class="px-3 py-2">{{ game.score_b }}</td>
            <td class="px-3 py-2">{{ new Date(game.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</td>
            <td class="px-3 py-2">{{ game.date }}</td>
            <td class="px-3 py-2">{{ game.pitch }}</td>
            <td class="px-3 py-2">
              <button @click="openEditGame(game)" class="text-blue-600 hover:underline">Edit</button>
            </td>
          </tr>
          <tr v-if="!filteredGames.length">
            <td colspan="8" class="text-center py-4 text-gray-500">No games for this category.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showEdit" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md p-6 rounded-lg space-y-4 relative">
        <h3 class="text-lg font-bold">{{ isEditing ? 'Edit' : 'Add' }} Game</h3>

        <label class="block">
          Team A
          <select v-model="form.team_a_id" class="mt-1 w-full border rounded p-2">
            <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </label>

        <label class="block">
          Team B
          <select v-model="form.team_b_id" class="mt-1 w-full border rounded p-2">
            <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </label>

        <label class="block">
          Date
          <input type="date" v-model="form.date" class="mt-1 w-full border rounded p-2" />
        </label>

        <label class="block">
          Kickoff Time
          <input type="time" v-model="form.kickoff_time" class="mt-1 w-full border rounded p-2" />
        </label>

        <label class="block">
          Pitch
          <select v-model.number="form.pitch" class="mt-1 w-full border rounded p-2">
            <option v-for="n in [1, 2, 3]" :key="n" :value="n">Pitch {{ n }}</option>
          </select>
        </label>

        <div class="flex gap-4">
          <label class="block flex-1">
            Score A
            <input type="number" v-model.number="form.score_a" class="mt-1 w-full border rounded p-2" />
          </label>
          <label class="block flex-1">
            Score B
            <input type="number" v-model.number="form.score_b" class="mt-1 w-full border rounded p-2" />
          </label>
        </div>

        <label class="block mt-2">
          <input type="checkbox" v-model="form.is_complete" class="mr-2" />
          Mark game as complete
        </label>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="saveGame" class="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button v-if="isEditing" @click="showDeleteConfirm = true" class="bg-red-600 text-white px-4 py-2 rounded">
            Delete
          </button>
          <button @click="closeEdit" class="px-4 py-2 rounded bg-gray-300">Cancel</button>
        </div>

        <div v-if="showDeleteConfirm" class="mt-4 bg-red-100 p-4 rounded">
          <p>Are you sure you want to delete this game?</p>
          <div class="flex justify-end gap-2 mt-2">
            <button @click="deleteGame" class="bg-red-700 text-white px-4 py-1 rounded">Yes</button>
            <button @click="showDeleteConfirm = false" class="px-4 py-1 bg-gray-300 rounded">No</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* nothing extra */
</style>
