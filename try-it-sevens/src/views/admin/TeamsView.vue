<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'
import GenderButtons from '@/components/GenderButtons.vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
// Redirect non-admin/super users
if (!auth.user || !['admin','super'].includes(auth.user.role)) {
  router.replace('/login')
}

// Filter state
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

// Teams data
const teams = ref([])

// Form state
const showForm = ref(false)
const editingTeam = ref(null)
const form = reactive({
  id: null,
  name: '',
  description: '',
  contact_email: '',
  gender: 'Male',
  type: 'Elite',
  logoFile: null,
  logoPreview: null
})

// Fetch teams based on current filters
async function fetchTeams() {
  let query = supabase.from('teams').select('*').order('name')
  if (selectedGender.value !== 'All') {
    query = query.eq('gender', selectedGender.value)
  }
  if (selectedGender.value === 'Male' && selectedType.value !== 'All') {
    query = query.eq('type', selectedType.value)
  }
  const { data, error } = await query
  if (error) {
    console.error('Error fetching teams:', error)
    teams.value = []
  } else {
    teams.value = data
  }
}

// Handle filter updates from GenderButtons
function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
  fetchTeams()
}

// Show/Hide and populate the form for add/edit
function openForm(team = null) {
  if (team) {
    editingTeam.value = team
    Object.assign(form, {
      id: team.id,
      name: team.name,
      description: team.description || '',
      contact_email: team.contact_email || '',
      gender: team.gender || 'Male',
      type: team.type || 'All',
      logoFile: null,
      logoPreview: team.logo_url || null
    })
  } else {
    editingTeam.value = null
    Object.assign(form, {
      id: null,
      name: '',
      description: '',
      contact_email: '',
      gender: selectedGender.value,
      type: selectedType.value,
      logoFile: null,
      logoPreview: null
    })
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

// Handle file input for logo
function onLogoChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.logoFile = file
    form.logoPreview = URL.createObjectURL(file)
  }
}

// Submit the add/edit form
async function submitForm() {
  let teamId = form.id
  if (teamId) {
    // Update existing
    await supabase.from('teams').update({
      name: form.name,
      description: form.description,
      contact_email: form.contact_email,
      gender: form.gender,
      type: form.type
    }).eq('id', teamId)
  } else {
    // Create new
    const { data, error } = await supabase.from('teams')
      .insert({
        name: form.name,
        description: form.description,
        contact_email: form.contact_email,
        gender: form.gender,
        type: form.type
      })
      .select('id')
      .single()
    if (error) {
      console.error('Error creating team:', error)
      return
    }
    teamId = data.id
  }
  // Upload logo if provided
  if (form.logoFile) {
    const path = `team-logos/${teamId}/${form.logoFile.name}`
    const { data: storageData, error: storageErr } = await supabase
      .storage.from('team-logos').upload(path, form.logoFile)
    if (!storageErr) {
      const { publicURL } = supabase.storage.from('team-logos').getPublicUrl(storageData.path)
      await supabase.from('teams').update({ logo_url: publicURL }).eq('id', teamId)
    }
  }
  showForm.value = false
  fetchTeams()
}

onMounted(fetchTeams)
</script>

<template>
  <main class="wrapper pt-20 space-y-6">
    <Breadcrumbs />

    <GenderButtons
      :selectedGender="selectedGender"
      :selectedType="selectedType"
      @updateSelection="handleSelection"
    />

    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Teams</h1>
      <button @click="openForm()" class="btn bg-green-500 text-white">Add Team</button>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-6">
      <div class="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 class="text-xl font-semibold">{{ editingTeam ? 'Edit Team' : 'New Team' }}</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <input v-model="form.name" placeholder="Name" required class="w-full border p-2 rounded" />
          <input v-model="form.contact_email" placeholder="Email" type="email" class="w-full border p-2 rounded" />
          <div class="flex gap-2">
            <select v-model="form.gender" class="border p-2 rounded">
              <option>Male</option>
              <option>Ladies</option>
              <option>Juniors</option>
            </select>
            <select v-model="form.type" class="border p-2 rounded" v-if="form.gender==='Male'">
              <option>Elite</option>
              <option>Social</option>
            </select>
          </div>
          <div>
            <input type="file" accept="image/*" @change="onLogoChange" />
            <img v-if="form.logoPreview" :src="form.logoPreview" class="h-16 mt-2 rounded" />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeForm" class="btn">Cancel</button>
            <button type="submit" class="btn bg-blue-500 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Teams Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2">Name</th>
            <th class="text-right px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id" class="even:bg-gray-50 hover:bg-gray-100">
            <td class="px-4 py-2">{{ team.name }}</td>
            <td class="text-right px-4 py-2">
              <button @click="openForm(team)" class="text-blue-600 hover:underline">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

