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
      class="btn-dark w-full mt-20"
    >
      Add Game
    </button>

    <div class="overflow-x-auto border border-gray-300 rounded-lg">
      <table class="custom-table w-full text-left">
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
    <div v-if="isModalOpen" class="fixed overlay-add inset-0 flex items-center justify-center z-50">
      <div class="wrapper-bg"></div>
      <div class="card bg-white w-full max-w-md p-6 rounded-lg shadow space-y-4">
        <h2 class="text-lg font-bold">{{ isEditing ? 'Edit User' : 'Add User' }}</h2>

        <label class="block">
          <span>Username</span>
          <input v-model="form.username" class="mt-1 block w-full border rounded p-2" />
        </label>

        <label class="block">
          <span>Password</span>
          <div class="flex items-center">
            <input
              :type="showFormPass ? 'text' : 'password'"
              v-model="form.password"
              class="mt-1 flex-1 border rounded p-2"
            />
            <button @click="showFormPass = !showFormPass" class="ml-2 text-sm text-gray-500">
              {{ showFormPass ? 'Hide' : 'Show' }}
            </button>
          </div>
        </label>

        <label class="block">
          <span>Access Level</span>
          <select v-model="form.accessLevel" class="mt-1 block w-full border rounded p-2">
            <option value="super">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="team">Team Admin</option>
          </select>
        </label>

        <label v-if="form.accessLevel === 'team'" class="block">
          <span>Team</span>
          <select v-model="form.team" class="mt-1 block w-full border rounded p-2">
            <option value="" disabled>Select team</option>
            <option v-for="team in teams" :key="team" :value="team">
              {{ team }}
            </option>
          </select>
        </label>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button @click="saveAccount" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button
            v-if="isEditing"
            @click="deleteAccount"
            class="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.btn-dark {
  background: #231F20;
  padding: 12px 30px;
  color: #96D1F2;
  font-weight: 400;
  letter-spacing: 1px;
  border-radius: 12px;
  display: block;
  text-align: center;
  transition: all .3s;
  &:hover {
    background: #96D1F2;
    color: #231F20;
  }
  &.add-teams {
    margin-top: 36px;
    width: 100%;
  }
}

.btn-sec {
  background: #96D1F2;
  padding: 12px 30px;
  color: #231F20;
  font-weight: 400;
  letter-spacing: 1px;
  border-radius: 12px;
  display: block;
  text-align: center;
  transition: all .3s;
  &:hover {
    background: #231F20;
    color: #96D1F2;
  }
}

input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #a0d8ef;
}

.custom-table {
  border: none;
  width: 100%;
  overflow: scroll;
  thead {
    tr {
      border-top: none;
      border-right:  1px solid #fff;
      background: #231F20;
      th {
        color: #fff;
        font-weight: 400;
        width: 100%;
      }
    }
  }
  tbody {
    tr {
      background: #96D1F2;
      color: #231F20;
      &:nth-child(even) {
        background: #96d1f27d;
      }
      td {
        text-align: left;
        border-left: none;
        border-right: 1px solid #fff;
        button {
          color: #231F20;
          font-weight: 500;
          transition: all .3s;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .edits-delete {
        text-align: center;
        .edit {
          &:hover {
            color: green;
          }
        }
        .delete {
          &:hover {
            color: red;
          }
        }
      }
    }
  }
  
}
.overlay-add {
  height: 100vh;
  .wrapper-bg {
    height: 100vh;
    width: 100%;
    position: absolute;
    background-color: rgb(0 0 0 / 70%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .card {
    z-index: 56;
  }
}
</style>
