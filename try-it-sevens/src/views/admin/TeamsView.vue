<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'
import GenderButtons from '@/components/GenderButtons.vue'
import { supabase } from '@/lib/supabase'

// Filter state
const selectedGender = ref('All')
const selectedType   = ref('All')

// Modal state
const showModal    = ref(false)
const isEditing    = ref(false)
const form         = reactive({
  id: null,
  name: '',
  gender: 'All',
  type: '',
  description: '',
  contact_email: ''
})

// Data
const teams = ref([])

// Compute whether to show type dropdown
const showType = computed(() => form.gender === 'Male')

async function fetchTeams() {
  let query = supabase.from('teams').select('*')
  if (selectedGender.value !== 'All') query = query.eq('gender', selectedGender.value)
  if (selectedGender.value === 'Male' && selectedType.value !== 'All') {
    query = query.eq('type', selectedType.value)
  }
  const { data, error } = await query.order('name', { ascending: true })
  if (error) console.error('Fetch teams error:', error)
  teams.value = data || []
}

function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
  fetchTeams()
}

function openAdd() {
  isEditing.value = false
  Object.assign(form, { id: null, name: '', gender: selectedGender.value, type: '', description: '', contact_email: '' })
  showModal.value = true
}

function openEdit(team) {
  isEditing.value = true
  Object.assign(form, {
    id: team.id,
    name: team.name,
    gender: team.gender,
    type: team.type || '',
    description: team.description || '',
    contact_email: team.contact_email || ''
  })
  showModal.value = true
}

async function saveTeam() {
  const payload = {
    name: form.name,
    gender: form.gender,
    type: form.gender === 'Male' ? form.type : null,
    description: form.description,
    contact_email: form.contact_email
  }
  if (isEditing.value) {
    await supabase.from('teams').update(payload).eq('id', form.id)
  } else {
    await supabase.from('teams').insert(payload)
  }
  showModal.value = false
  await fetchTeams()
}

async function deleteTeam(id) {
  if (!confirm('Delete this team?')) return
  await supabase.from('teams').delete().eq('id', id)
  fetchTeams()
}

onMounted(fetchTeams)
</script>

<template>
  <main class="wrapper pt-20 max-w-4xl mx-auto space-y-6">
    <Breadcrumbs />

    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />

    <button @click="openAdd" class="btn-dark add-teams mb-10 mt-20">Add Team</button>

    <div class="overflow-x-auto">
      <table class="custom-table min-w-full text-left rounded-lg border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Gender</th>
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id" class="even:bg-gray-50">
            <td class="px-4 py-2">{{ team.name }}</td>
            <td class="px-4 py-2">{{ team.gender }}</td>
            <td class="px-4 py-2">{{ team.type || '' }}</td>
            <td class="px-4 py-2 edits-delete">
              <button @click.prevent="openEdit(team)" class="edit">Edit</button>
              <button @click.prevent="deleteTeam(team.id)" class="delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 overlay-add flex items-center justify-center z-50">
      <div class="wrapper-bg"></div>
      <div class="card bg-white w-full max-w-md p-6 rounded-lg space-y-4">
        <h2 class="text-lg font-bold">{{ isEditing ? 'Edit Team' : 'Add Team' }}</h2>

        <label class="block">
          <span>Name</span>
          <input v-model="form.name" class="mt-1 block w-full border rounded p-2" />
        </label>

        <label class="block">
          <span>Gender</span>
          <select v-model="form.gender" class="mt-1 block w-full border rounded p-2">
            <option>Male</option>
            <option>Ladies</option>
            <!-- <option>Juniors</option> -->
          </select>
        </label>

        <label v-if="showType" class="block">
          <span>Type</span>
          <select v-model="form.type" class="mt-1 block w-full border rounded p-2">
            <option>Elite</option>
            <option>Social</option>
          </select>
        </label>

        <!-- <label class="block">
          <span>Description</span>
          <textarea v-model="form.description" class="mt-1 block w-full border rounded p-2 h-24"></textarea>
        </label> -->

        <!-- <label class="block">
          <span>Contact Email</span>
          <input v-model="form.contact_email" class="mt-1 block w-full border rounded p-2" />
        </label> -->

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showModal = false" class="btn-dark rounded">Cancel</button>
          <button @click="saveTeam" class="btn-sec rounded">Save</button>
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
    z-index: 56;
    max-height: 75vh;
    overflow: auto;
  }
}
</style>
