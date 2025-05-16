<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth = useAuthStore()
const router = useRouter()

const loading = ref(true)
const error   = ref('')
const team    = ref(null)
const players = ref([])
 
const form = reactive({
  id: null,
  teamName: '',
  teamDescription: '',
  contactEmail: '',
  gender: '',
  type: '',
  teamLogoFile: null,
  teamLogoPreview: null
})
const newPlayer = reactive({ number: '', name: '' })

// Redirect if no team assigned
if (!auth.user || !auth.user.team) {
  router.replace('/')
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const teamRef = auth.user.team
    let teamQuery = supabase.from('teams').select('*')
    const uuidRegex = /^[0-9a-fA-F-]{36}$/
    if (uuidRegex.test(teamRef)) {
      teamQuery = teamQuery.eq('id', teamRef)
    } else {
      teamQuery = teamQuery.eq('name', teamRef)
    }
    const { data: t, error: tErr } = await teamQuery.single()
    if (tErr) throw tErr
    team.value = t
    Object.assign(form, {
      id: t.id,
      teamName: t.name,
      teamDescription: t.description || '',
      contactEmail: t.contact_email || '',
      gender: t.gender,
      type: t.type || ''
    })
    if (t.logo_url) form.teamLogoPreview = t.logo_url

    const { data: pl, error: pErr } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', t.id)
      .order('number', { ascending: true })
    if (pErr) console.error(pErr)
    players.value = pl || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function onLogoChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.teamLogoFile = file
    form.teamLogoPreview = URL.createObjectURL(file)
  }
}

async function submitForm() {
  try {
    const payload = {
      name: form.teamName,
      description: form.teamDescription,
      contact_email: form.contactEmail
    }
    await supabase.from('teams').update(payload).eq('id', form.id)
    if (form.teamLogoFile) {
      const path = `team-logos/${form.id}/${form.teamLogoFile.name}`
      const { data: storageData } = await supabase.storage
        .from('team-logos')
        .upload(path, form.teamLogoFile)
      const { publicURL } = supabase.storage.from('team-logos').getPublicUrl(storageData.path)
      await supabase.from('teams').update({ logo_url: publicURL }).eq('id', form.id)
    }
    fetchData()
  } catch (e) {
    console.error(e)
    error.value = 'Failed to save team data.'
  }
}

function addPlayer() {
  if (!newPlayer.number || !newPlayer.name) return
  supabase.from('players').insert({
    team_id: form.id,
    number: newPlayer.number,
    name: newPlayer.name
  }).then(() => fetchData())
  newPlayer.number = ''
  newPlayer.name = ''
}

function removePlayer(id) {
  supabase.from('players').delete().eq('id', id).then(() => fetchData())
}

onMounted(fetchData)
</script>

<template>
  <main class="wrapper pt-20 max-w-3xl mx-auto space-y-8">
    <div v-if="loading" class="text-center py-10">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600 py-10">{{ error }}</div>
    <div v-else>
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Team Logo -->
        <!-- <div>
          <label class="block mb-1 text-sm font-medium">Team Logo</label>
          <input type="file" accept="image/*" @change="onLogoChange" class="block mb-2" />
          <div v-if="form.teamLogoPreview" class="h-32 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            <img :src="form.teamLogoPreview" alt="Logo Preview" class="max-h-full max-w-full object-contain" />
          </div>
        </div> -->

        <!-- Team Name -->
        <div>
          <label class="block mb-1 text-sm font-medium">Team Name</label>
          <input v-model="form.teamName" type="text" class="w-full p-2 border rounded" required />
        </div>

        <!-- Gender (fixed) -->
        <div>
          <label class="block mb-1 text-sm font-medium">Gender</label>
          <input :value="form.gender" disabled type="text" class="w-full p-2 border rounded bg-gray-100" />
        </div>

        <!-- Type (fixed for Male) -->
        <div v-if="form.gender === 'Male'">
          <label class="block mb-1 text-sm font-medium">Type</label>
          <input :value="form.type" disabled type="text" class="w-full p-2 border rounded bg-gray-100" />
        </div>

        <!-- Description -->
        <!-- <div>
          <label class="block mb-1 text-sm font-medium">Team Description</label>
          <textarea v-model="form.teamDescription" class="w-full p-2 border rounded h-24"></textarea>
        </div> -->

        <!-- Contact Email -->
        <!-- <div>
          <label class="block mb-1 text-sm font-medium">Contact Email</label>
          <input v-model="form.contactEmail" type="email" class="w-full p-2 border rounded" />
        </div> -->

        <button type="submit" class="w-full btn-dark">
          Save Changes
        </button>
      </form>

      <!-- Players Section -->
      <!-- <section class="space-y-4 mt-6">
        <h2 class="text-xl font-semibold">Players</h2>
        <div class="flex gap-2">
          <input v-model="newPlayer.number" type="text" placeholder="Shirt number" class="flex-1 p-2 border rounded" />
          <input v-model="newPlayer.name" type="text" placeholder="Player name" class="flex-2 p-2 border rounded" />
          <button @click.prevent="addPlayer" class="px-4 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition">
            Add
          </button>
        </div>

        <div v-if="players.length" class="overflow-x-auto">
          <table class="min-w-full text-left border border-gray-300 rounded-lg">
            <thead class="bg-gray-200 text-gray-700">
              <tr>
                <th class="px-4 py-2">Number</th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in players" :key="p.id || i" class="even:bg-gray-50 hover:bg-green-50 transition">
                <td class="px-4 py-2 font-medium">{{ p.number }}</td>
                <td class="px-4 py-2">{{ p.name }}</td>
                <td class="px-4 py-2 text-right">
                  <button @click.prevent="removePlayer(p.id)" class="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section> -->
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
}
</style>