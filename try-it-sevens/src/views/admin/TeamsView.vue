<!-- src/views/admin/TeamsView.vue -->
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'

const router = useRouter()

// form state
const form = reactive({
  teamName: '',
  teamDescription: '',
  contactEmail: '',
  teamLogo: null // will hold a preview URL
})

// list of players
const players = ref([])

// temporary inputs for a new player
const newPlayer = reactive({
  number: '',
  name: ''
})

// handle file input change and create a local preview
function onLogoChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.teamLogo = URL.createObjectURL(file)
  }
}

// add the new player into the players list
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

// stub submit
function submitForm() {
  alert(`Team “${form.teamName}” saved (stub)`)
  // you might router.push('/admin') or clear the form here
}
</script>

<template>
  <main class="wrapper pt-20 max-w-md mx-auto space-y-8">
    <!-- Header / breadcrumb -->
    <Breadcrumbs />

    <!-- Team form -->
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Team Name -->
      <div>
        <label class="block mb-1 text-sm font-medium">Team Name</label>
        <input
          v-model="form.teamName"
          type="text"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block mb-1 text-sm font-medium">Team Description</label>
        <textarea
          v-model="form.teamDescription"
          class="w-full p-2 border rounded h-24"
        ></textarea>
      </div>

      <!-- Contact Email -->
      <div>
        <label class="block mb-1 text-sm font-medium">Contact Email</label>
        <input
          v-model="form.contactEmail"
          type="email"
          class="w-full p-2 border rounded"
        />
      </div>

      <!-- Logo Upload + Preview -->
      <div>
        <label class="block mb-1 text-sm font-medium">Team Logo</label>
        <input
          type="file"
          accept="image/*"
          @change="onLogoChange"
          class="block mb-2"
        />
        <div
          v-if="form.teamLogo"
          class="h-32 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center"
        >
          <img
            :src="form.teamLogo"
            alt="Logo Preview"
            class="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Submit
      </button>
    </form>

    <!-- Add Players -->
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
          @click="addPlayer"
          class="px-4 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
        >
          Add
        </button>
      </div>

      <!-- Players Table -->
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
/* nothing extra for now */
</style>
