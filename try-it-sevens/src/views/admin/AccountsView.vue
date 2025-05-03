<!-- src/views/admin/AccountsView.vue -->
<script setup>
import { ref, reactive, watch } from 'vue'

// Mock account data
const accounts = ref([
  { id: 1, accessLevel: 'Super Admin', team: '', username: 'super1', password: '••••••••' },
  { id: 2, accessLevel: 'Admin', team: '', username: 'admin1', password: '••••••••' },
  { id: 3, accessLevel: 'Team Admin', team: 'Tigers', username: 'teamtiger', password: '••••••••' }
])

// Modal state
const isModalOpen = ref(false)
const isEditing   = ref(false)

// Form state
const form = reactive({ id: null, accessLevel: 'Super Admin', team: '', username: '', password: '' })
const showFormPassword = ref(false)

// Teams dropdown
const teams = ['Tigers', 'Lions', 'Bulls']

function openAddModal() {
  isEditing.value = false
  Object.assign(form, { id: null, accessLevel: 'Super Admin', team: '', username: '', password: '' })
  showFormPassword.value = false
  isModalOpen.value = true
}

function openEditModal() {
  if (!accounts.value.length) return
  isEditing.value = true
  form.id = accounts.value[0].id
  populateForm()
  showFormPassword.value = false
  isModalOpen.value = true
}

function populateForm() {
  const acc = accounts.value.find(a => a.id === form.id)
  if (!acc) return
  form.accessLevel = acc.accessLevel
  form.team = acc.team
  form.username = acc.username
  form.password = acc.password  // pre-fill masked password
}

watch(() => form.id, () => isEditing.value && populateForm())

function saveAccount() {
  if (isEditing.value) {
    const acc = accounts.value.find(a => a.id === form.id)
    acc.accessLevel = form.accessLevel
    acc.team = form.accessLevel === 'Team Admin' ? form.team : ''
    acc.username = form.username
    if (form.password) acc.password = '••••••••'
  } else {
    const newId = Math.max(0, ...accounts.value.map(a => a.id)) + 1
    accounts.value.push({
      id: newId,
      accessLevel: form.accessLevel,
      team: form.accessLevel === 'Team Admin' ? form.team : '',
      username: form.username,
      password: '••••••••'
    })
  }
  closeModal()
}

function deleteAccount() {
  if (window.confirm('Are you sure you want to delete this account?')) {
    const idx = accounts.value.findIndex(a => a.id === form.id)
    if (idx >= 0) accounts.value.splice(idx, 1)
    closeModal()
  }
}

function closeModal() {
  isModalOpen.value = false
}

function toggleFormPassword() {
  showFormPassword.value = !showFormPassword.value
}
</script>

<template>
  <div class="wrapper pt-20 max-w-4xl mx-auto">
    <div class="flex justify-between mb-4">
      <button @click="openAddModal" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        Add User
      </button>
      <button @click="openEditModal" :disabled="!accounts.length" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition">
        Edit User
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="px-4 py-2">#</th>
            <th class="px-4 py-2">Access Level</th>
            <th class="px-4 py-2">Team</th>
            <th class="px-4 py-2">Username</th>
            <th class="px-4 py-2">Password</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acc in accounts" :key="acc.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-2">{{ acc.id }}</td>
            <td class="px-4 py-2">{{ acc.accessLevel }}</td>
            <td class="px-4 py-2">{{ acc.team || '—' }}</td>
            <td class="px-4 py-2">{{ acc.username }}</td>
            <td class="px-4 py-2">{{ acc.password }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg space-y-4">
        <h2 class="text-xl font-bold">{{ isEditing ? 'Edit User' : 'Add User' }}</h2>

        <template v-if="isEditing">
          <label class="block">
            <span>Select Username</span>
            <select v-model="form.id" class="mt-1 block w-full border rounded p-2">
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                {{ acc.username }} (ID: {{ acc.id }})
              </option>
            </select>
          </label>
        </template>

        <label class="block">
          <span>Access Level</span>
          <select v-model="form.accessLevel" class="mt-1 block w-full border rounded p-2">
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Team Admin</option>
          </select>
        </label>

        <label v-if="form.accessLevel === 'Team Admin'" class="block">
          <span>Team</span>
          <select v-model="form.team" class="mt-1 block w-full border rounded p-2">
            <option disabled value="">Select team</option>
            <option v-for="t in teams" :key="t">{{ t }}</option>
          </select>
        </label>

        <label class="block">
          <span>Username</span>
          <input v-model="form.username" type="text" class="mt-1 block w-full border rounded p-2" />
        </label>

        <label class="block">
          <span>Password</span>
          <div class="mt-1 flex items-center">
            <input
              :type="showFormPassword ? 'text' : 'password'"
              v-model="form.password"
              class="block flex-1 border rounded p-2"
            />
            <button @click.prevent="toggleFormPassword" class="ml-2 text-gray-500">
              {{ showFormPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </label>

        <div class="flex justify-end space-x-2">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button @click="saveAccount" class="px-4 py-2 bg-green-500 text-white rounded">
            Save
          </button>
          <button
            v-if="isEditing"
            @click="deleteAccount"
            class="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* no extra CSS */  
</style>
