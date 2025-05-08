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
const showType = computed(() => selectedGender.value === 'Male')

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

    <div class="overflow-x-auto">
      <table class="min-w-full text-left border-collapse">
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
            <td class="px-4 py-2">{{ team.type || '-' }}</td>
            <td class="px-4 py-2 text-right">
              <button @click.prevent="openEdit(team)" class="text-blue-600 hover:underline">Edit</button>
              <button @click.prevent="deleteTeam(team.id)" class="ml-2 text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="openAdd" class="btn mt-4">Add Team</button>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md p-6 rounded-lg space-y-4">
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
            <option>Juniors</option>
          </select>
        </label>

        <label v-if="showType" class="block">
          <span>Type</span>
          <select v-model="form.type" class="mt-1 block w-full border rounded p-2">
            <option>Elite</option>
            <option>Social</option>
          </select>
        </label>

        <label class="block">
          <span>Description</span>
          <textarea v-model="form.description" class="mt-1 block w-full border rounded p-2 h-24"></textarea>
        </label>

        <label class="block">
          <span>Contact Email</span>
          <input v-model="form.contact_email" class="mt-1 block w-full border rounded p-2" />
        </label>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showModal = false" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button @click="saveTeam" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
