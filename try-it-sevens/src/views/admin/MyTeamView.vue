<!-- src/views/admin/TeamsView.vue -->
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Redirect non-admin users
if (!auth.user || !['admin', 'super', 'team'].includes(auth.user.role)) {
  router.replace('/login')
}

// Form state
const form = reactive({
  teamName: '', 
  teamDescription: '',
  contactEmail: '',
  teamLogoFile: null,
  teamLogoPreview: null
})

// Players list
const players = ref([])
const newPlayer = reactive({ number: '', name: '' })

function onLogoChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.teamLogoFile = file
    form.teamLogoPreview = URL.createObjectURL(file)
  }
}

function addPlayer() {
  if (newPlayer.number && newPlayer.name) {
    players.value.push({
      number: newPlayer.number,
      name: newPlayer.name
    })
    newPlayer.number = ''
    newPlayer.name = ''
  }
}

async function submitForm() {
  // Insert new team
  const { data: team, error: teamErr } = await supabase
    .from('teams')
    .insert({
      name: form.teamName,
      description: form.teamDescription,
      contact_email: form.contactEmail
    })
    .select('id')
    .single()

  if (teamErr) {
    console.error('Error creating team:', teamErr)
    alert('Failed to create team. Check console for details.')
    return
  }

  // Upload logo if provided
  if (form.teamLogoFile) {
    const path = `team-logos/${team.id}/${form.teamLogoFile.name}`
    const { data: storageData, error: storageErr } = await supabase
      .storage
      .from('team-logos')
      .upload(path, form.teamLogoFile)
    if (storageErr) console.error('Logo upload error:', storageErr)
    else {
      const { publicURL } = supabase
        .storage
        .from('team-logos')
        .getPublicUrl(storageData.path)
      await supabase
        .from('teams')
        .update({ logo_url: publicURL })
        .eq('id', team.id)
    }
  }

  // Insert players
  for (const p of players.value) {
    const { error: pErr } = await supabase.from('players').insert({
      team_id: team.id,
      number: p.number,
      name: p.name
    })
    if (pErr) console.error('Player insert error:', pErr)
  }

  // Navigate back or clear form
  router.push('/admin/teams')
}
</script>

<template>
  <main class="wrapper pt-20 max-w-md mx-auto space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs />

    <!-- Team Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
        <!-- <div>
            <label class="block mb-1 text-sm font-medium">Team Logo</label>
            <input
              type="file"
              accept="image/*"
              @change="onLogoChange"
              class="block mb-2"
            />
            <div
              v-if="form.teamLogoPreview"
              class="h-32 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center"
            >
              <img
                :src="form.teamLogoPreview"
                alt="Logo Preview"
                class="max-h-full max-w-full object-contain"
              />
            </div>
        </div> -->
      <div>
        <label class="block mb-1 text-sm font-medium">Team Name</label>
        <input
          v-model="form.teamName"
          type="text"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Team Description</label>
        <textarea
          v-model="form.teamDescription"
          class="w-full p-2 border rounded h-24"
        ></textarea>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Contact Email</label>
        <input
          v-model="form.contactEmail"
          type="email"
          class="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Create Team
      </button>
    </form>

    <!-- Players Section -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Add Players</h2>
      <div class="flex gap-2">
        <input
          v-model="newPlayer.number"
          type="text"
          placeholder="Shirt number"
          class="flex-1 p-2 border rounded"
        />
        <input
          v-model="newPlayer.name"
          type="text"
          placeholder="Player name"
          class="flex-2 p-2 border rounded"
        />
        <button
          @click.prevent="addPlayer"
          class="px-4 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
        >
          Add
        </button>
      </div>

      <div v-if="players.length" class="overflow-x-auto">
        <table class="min-w-full text-left border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2">Number</th>
              <th class="px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, i) in players"
              :key="i"
              class="even:bg-gray-50 hover:bg-green-50 transition"
            >
              <td class="px-4 py-2 font-medium">{{ p.number }}</td>
              <td class="px-4 py-2">{{ p.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* no additional styles */
</style>
