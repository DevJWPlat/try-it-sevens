<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()
const slug  = route.params.team

const team    = ref(null)
const players = ref([])
const loading = ref(true)
const error   = ref('')

async function fetchTeam() {
  try {
    // Fetch team by name slug (case-sensitive match)
    const { data: t, error: teamErr } = await supabase
      .from('teams')
      .select('*')
      .eq('name', slug)
      .single()
    if (teamErr || !t) {
      throw new Error('Team not found')
    }
    team.value = t

    // Fetch its players
    const { data: pl, error: plErr } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', t.id)
      .order('number', { ascending: true })
    if (plErr) console.error('Players fetch error:', plErr)
    players.value = pl || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchTeam)
</script>

<template>
  <main class="wrapper max-w-3xl mx-auto space-y-6">
    <div v-if="loading" class="text-center py-10">Loading team details...</div>
    <div v-else-if="error" class="text-center text-red-600 py-10">{{ error }}</div>
    <div v-else>
      <!-- Team Header -->
      <div class="flex items-center space-x-4">
        <img
          v-if="team.logo_url"
          :src="team.logo_url"
          alt="Team Logo"
          class="h-20 w-20 object-contain rounded"
        />
        <h1 class="text-3xl font-bold">{{ team.name }}</h1>
      </div>

      <!-- Description -->
      <p v-if="team.description" class="mt-4 text-gray-700">{{ team.description }}</p>

      <!-- Contact Email -->
      <p v-if="team.contact_email" class="mt-2">
        <strong>Contact us:</strong>
        <a :href="`mailto:${team.contact_email}`" class="text-blue-600 hover:underline">
          {{ team.contact_email }}
        </a>
      </p>

      <!-- Players List -->
      <section v-if="players.length" class="mt-6">
        <h2 class="text-2xl font-semibold mb-2">Players</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2">Number</th>
                <th class="px-4 py-2">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in players"
                :key="p.id"
                class="even:bg-gray-50 hover:bg-green-50 transition"
              >
                <td class="px-4 py-2 font-medium">{{ p.number }}</td>
                <td class="px-4 py-2">{{ p.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Back Link -->
      <button
        @click="$router.back()"
        class="mt-8 inline-block bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
      >
        ← Back
      </button>
    </div>
  </main>
</template>

<style scoped>
/* optional page-specific styles */
</style>
