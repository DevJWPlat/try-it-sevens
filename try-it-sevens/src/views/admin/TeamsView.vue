<!-- src/views/admin/TeamsView.vue -->
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'
import GenderButtons from '@/components/GenderButtons.vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
if (!auth.user || !['admin','super'].includes(auth.user.role)) {
  router.replace('/login')
}

// Filter state
const selectedGender = ref('Male')
const selectedType   = ref('Elite')

// Teams list
const teams = ref([])

// Modal and form state
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = reactive({
  id: null,
  teamLogoFile: null,
  teamLogoPreview: null,
  gender: selectedGender.value,
  type: selectedType.value,
  teamName: '',
  teamDescription: '',
  contactEmail: ''
})

// Fetch teams by filter
async function fetchTeams() {
  let query = supabase.from('teams').select('*').order('name')
  if (selectedGender.value !== 'All') {
    query = query.eq('gender', selectedGender.value)
  }
  if (selectedGender.value === 'Male' && selectedType.value !== 'All') {
    query = query.eq('type', selectedType.value)
  }
  const { data, error } = await query
  if (error) console.error('fetchTeams error:', error)
  else teams.value = data
}

// Handle filter updates
function handleSelection({ gender, type }) {
  selectedGender.value = gender
  selectedType.value   = type
  fetchTeams()
}

// Open modal for add or edit
function openModal(team = null) {
  if (team) {
    isEditing.value = true
    Object.assign(form, {
      id: team.id,
      teamLogoFile: null,
      teamLogoPreview: team.logo_url || null,
      gender: team.gender || 'Male',
      type: team.type || 'All',
      teamName: team.name,
      teamDescription: team.description || '',
      contactEmail: team.contact_email || ''
    })
  } else {
    isEditing.value = false
    Object.assign(form, {
      id: null,
      teamLogoFile: null,
      teamLogoPreview: null,
      gender: selectedGender.value,
      type: selectedType.value,
      teamName: '',
      teamDescription: '',
      contactEmail: ''
    })
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

// Handle file input
function onLogoChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.teamLogoFile = file
    form.teamLogoPreview = URL.createObjectURL(file)
  }
}

//submit
async function submitForm() {
  // Build payload with required and optional fields, including type only for Male if provided
  const payload = {
    name: form.teamName,
    gender: form.gender,
    description: form.teamDescription || '',
    contact_email: form.contactEmail || '',
    // only include `type` if Male and a subtype is selected
    ...(form.gender === 'Male' && form.type ? { type: form.type } : {})
  };

  console.log('[TeamsView] submitting payload:', payload);

  let teamId = form.id;
  let res;

  if (isEditing.value) {
    // update existing team
    res = await supabase
      .from('teams')
      .update(payload)
      .eq('id', teamId);
  } else {
    // create new team
    res = await supabase
      .from('teams')
      .insert(payload)
      .select('id')
      .single();
  }

  if (res.error) {
    console.error('[TeamsView] save error:', res.error);
    alert('Error saving team: ' + res.error.message);
    return; // <- stays inside the function
  }

  // if we just created it, grab its new ID
  if (!isEditing.value && res.data) {
    teamId = res.data.id;
  }

  // upload logo if provided
  if (form.teamLogoFile) {
    const path = `team-logos/${teamId}/${form.teamLogoFile.name}`;
    const { data: storageData, error: storageErr } = await supabase
      .storage
      .from('team-logos')
      .upload(path, form.teamLogoFile);

    if (storageErr) {
      console.error('[TeamsView] logo upload error:', storageErr);
    } else {
      const { publicURL } = supabase
        .storage
        .from('team-logos')
        .getPublicUrl(storageData.path);
      await supabase
        .from('teams')
        .update({ logo_url: publicURL })
        .eq('id', teamId);
    }
  }

  closeModal();
  fetchTeams();
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
      <button @click="openModal()" class="btn bg-green-500 text-white">Add Team</button>
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
              <button @click="openModal(team)" class="text-blue-600 hover:underline">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md p-6 rounded-lg shadow space-y-4">
        <h2 class="text-lg font-bold">{{ isEditing ? 'Edit Team' : 'Add Team' }}</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label class="block mb-1 text-sm font-medium">Team Logo</label>
            <input type="file" accept="image/*" @change="onLogoChange" class="block mb-2" />
            <div v-if="form.teamLogoPreview" class="h-32 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              <img :src="form.teamLogoPreview" alt="Logo Preview" class="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Gender</label>
            <select v-model="form.gender" class="w-full p-2 border rounded">
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Ladies</option>
              <option>Juniors</option>
            </select>
          </div>

          <div v-if="form.gender === 'Male'">
            <label class="block mb-1 text-sm font-medium">Type (optional)</label>
            <select v-model="form.type" class="w-full p-2 border rounded">
              <option value="">— none —</option>
              <option>Elite</option>
              <option>Social</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Team Name</label>
            <input v-model="form.teamName" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Team Description</label>
            <textarea v-model="form.teamDescription" class="w-full p-2 border rounded h-24"></textarea>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Contact Email</label>
            <input v-model="form.contactEmail" type="email" class="w-full p-2 border rounded" />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
