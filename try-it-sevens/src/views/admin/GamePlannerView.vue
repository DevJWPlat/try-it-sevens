<!-- src/views/admin/GamePlannerView.vue -->
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useScoreboardStore } from '@/stores/scoreboard'
import { useRouter } from 'vue-router'
import GenderButtons from '@/components/GenderButtons.vue'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'

const router = useRouter()
const scoreboardStore = useScoreboardStore()

// Top‐level filters
const selectedGender = ref('Male')
const selectedType   = ref('Elite')
function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
}

// Teams and games data
const teams     = ref([])
const teamMap   = ref({})
const allGames  = ref([])
const filteredGames = computed(() =>
  allGames.value.filter(g =>
    g.gender === selectedGender.value &&
    (g.type || 'default') === (selectedType.value || 'default')
  )
)

// Fetch initial data
async function fetchData() {
  const { data: teamData } = await supabase
    .from('teams')
    .select('id, name, gender, type')
  teams.value   = teamData || []
  teamMap.value = Object.fromEntries(teams.value.map(t => [t.id, t.name]))

  const { data: gameData } = await supabase
    .from('games')
    .select('*')
    .order('kickoff_time')
  allGames.value = gameData || []
}
onMounted(fetchData)

// Modal & form state
const showEdit          = ref(false)
const showDeleteConfirm = ref(false)
const isEditing         = ref(false)
const form              = reactive({
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
  Object.assign(form, {
    id: game.id,
    gender: game.gender,
    type: game.type,
    team_a_id: game.team_a_id,
    team_b_id: game.team_b_id,
    score_a: game.score_a,
    score_b: game.score_b,
    pitch: game.pitch,
    is_complete: game.is_complete
  })
  const [date, time] = game.kickoff_time.split('T')
  form.date         = date
  form.kickoff_time = time?.slice(0,5) || ''
  showEdit.value    = true
}

function closeEdit() {
  showEdit.value = false
  showDeleteConfirm.value = false
}

const teamsForForm = computed(() =>
  teams.value.filter(t => {
    if (t.gender !== form.gender) return false
    if (form.gender === 'Male' && form.type && t.type !== form.type) return false
    return true
  })
)

async function updateScoreboardOnComplete(game) {
  const { team_a_id, team_b_id, score_a, score_b, type, gender } = game

  const points = score_a > score_b
    ? { [team_a_id]: 3, [team_b_id]: 1 }
    : score_a < score_b
      ? { [team_b_id]: 3, [team_a_id]: 1 }
      : { [team_a_id]: 2, [team_b_id]: 2 }

  for (const [teamId, pts] of Object.entries(points)) {
    const { data: existing, error: fetchErr } = await supabase
      .from('scoreboard')
      .insert([{
        team_id: teamId,
        gender,        // ← the new column
        type,
        played:  1,
        points:  pts,
        wins:    pts === 3 ? 1 : 0,
        draws:   pts === 2 ? 1 : 0,
        losses:  pts === 1 ? 1 : 0
      }]);
    if (fetchErr) {
      console.error(`Lookup error for team ${teamId}:`, fetchErr)
      continue
    }

    if (existing) {
      const { error } = await supabase
        .from('scoreboard')
        .update({
          played: existing.played + 1,
          points: existing.points + pts,
          wins:   existing.wins   + (pts === 3 ? 1 : 0),
          draws:  existing.draws  + (pts === 2 ? 1 : 0),
          losses: existing.losses + (pts === 1 ? 1 : 0)
        })
        .eq('team_id', teamId)
        .eq('type', type)
        .eq('gender', gender)
      console.log(`Updated scoreboard for team ${teamId}`, error || 'success')
    } else {
      const { error } = await supabase
        .from('scoreboard')
        .insert([{
          team_id: teamId,
          type,
          gender,
          played:  1,
          points:  pts,
          wins:    pts === 3 ? 1 : 0,
          draws:   pts === 2 ? 1 : 0,
          losses:  pts === 1 ? 1 : 0
        }])
      console.log(`Inserted scoreboard for team ${teamId}`, error || 'success')
    }
  }
}

async function saveGame() {
  const payload = {
    gender: form.gender,
    type:   form.type,
    team_a_id:     form.team_a_id,
    team_b_id:     form.team_b_id,
    score_a:       form.score_a,
    score_b:       form.score_b,
    kickoff_time:  `${form.date}T${form.kickoff_time}`,
    date:          form.date,
    pitch:         form.pitch,
    is_complete:   form.is_complete
  }

  if (isEditing.value) {
    await supabase.from('games').update(payload).eq('id', form.id)
  } else {
    const { data } = await supabase.from('games')
      .insert([payload])
      .select()
      .single()
    form.id = data?.id
  }

  if (form.is_complete) {
    await updateScoreboardOnComplete({ ...form })
  }

  await scoreboardStore.fetchByCategory(form.gender, form.type)
  await fetchData()
  closeEdit()
  router.push('/')
}

async function deleteGame() {
  await supabase.from('games').delete().eq('id', form.id)
  await fetchData()
  closeEdit()
}
</script>

<template>
  <main class="wrapper pt-20 space-y-6 max-w-2xl mx-auto">
    <Breadcrumbs />
    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />

    <button
      @click="openAdd"
      class="block w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition"
    >
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
            <td class="px-3 py-2">{{ teamMap[game.team_a_id] }}</td>
            <td class="px-3 py-2">{{ game.score_a }}</td>
            <td class="px-3 py-2">{{ teamMap[game.team_b_id] }}</td>
            <td class="px-3 py-2">{{ game.score_b }}</td>
            <td class="px-3 py-2">
              {{ new Date(game.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </td>
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

    <!-- Modal form (unchanged) -->
  </main>
</template>

<style scoped>
/* no extra styles */
</style>
