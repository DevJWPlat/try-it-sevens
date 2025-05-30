<!-- src/views/admin/AccountsView.vue -->
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/AdminBreadcrumbs.vue'

const accounts = ref([])
const teams = ref([])
const isModalOpen = ref(false)
const isEditing = ref(false)
const showFormPass = ref(false)

const form = reactive({
  id: null,
  accessLevel: 'Admin',
  team: '',
  username: '',
  password: ''
})

// Fetch all accounts
async function fetchAccounts() {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .order('username')
  if (!error) accounts.value = data
}

// Fetch team names
async function fetchTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('name')
    
  if (error) {
    console.error('Error loading teams:', error)
  } else {
    teams.value = data.map(t => t.name)
  }
}

// Save (insert or update) account
async function saveAccount() {
  let result
  if (isEditing.value) {
    result = await supabase
      .from('app_users')
      .update({
        username: form.username,
        password: form.password,
        access: form.accessLevel,
        team: form.accessLevel === 'team' ? form.team : null
      })
      .eq('id', form.id)
  } else {
    result = await supabase
      .from('app_users')
      .insert([{
        username: form.username,
        password: form.password,
        access: form.accessLevel,
        team: form.accessLevel === 'team' ? form.team : null
      }])
  }

  const { error, data } = result
  console.log('SAVE RESULT:', { data, error })

  if (error) {
    alert('Error saving user: ' + error.message)
    return
  }

  await fetchAccounts()

  closeModal()
}


// Delete account
async function deleteAccount() {
  if (confirm('Are you sure you want to delete this account?')) {
    await supabase.from('app_users').delete().eq('id', form.id)
    await fetchAccounts() 
    closeModal()
  }
}

// Helpers
function openAdd() {
  isEditing.value = false
  Object.assign(form, { id: null, username: '', password: '', accessLevel: 'Admin', team: '' })
  showFormPass.value = false
  isModalOpen.value = true
}

function openEdit(user) {
  isEditing.value = true
  Object.assign(form, {
    id: user.id,
    username: user.username,
    password: user.password,
    accessLevel: user.access,
    team: user.team || ''
  })
  showFormPass.value = false
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

// Realtime listener
let userSub = null
onMounted(async () => {
  await fetchAccounts()
  await fetchTeams()

  userSub = supabase
    .channel('realtime-users')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_users' }, fetchAccounts)
    .subscribe()
})

onUnmounted(() => {
  if (userSub) supabase.removeChannel(userSub)
})
</script>

<template>
  <main class="wrapper pt-20 max-w-4xl mx-auto space-y-6">
    <Breadcrumbs />

    <div class="flex justify-between">
      <h2 class="text-xl font-bold">Manage Accounts</h2>
      <button @click="openAdd" class="btn-dark">
        Add User
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="custom-table min-w-full text-left border rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="px-4 py-2">Username</th>
            <th class="px-4 py-2">Access</th>
            <th class="px-4 py-2">Team</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in accounts" :key="user.id" class="even:bg-gray-50 hover:bg-green-50 transition">
            <td class="px-4 py-2">{{ user.username }}</td>
            <td class="px-4 py-2">{{ user.access }}</td>
            <td class="px-4 py-2">{{ user.team || '' }}</td>
            <td class="px-4 py-2">
              <button @click="openEdit(user)" class="text-blue-600 hover:underline">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="overlay-add fixed inset-0 z-50 flex items-center justify-center">
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
          <button @click="closeModal" class="btn-sec rounded">Cancel</button>
          <button @click="saveAccount" class="btn-dark rounded">Save</button>
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
          text-decoration: underline;
          color: #231F20;
          font-weight: 500;
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
    max-height: 75vh;
    overflow: auto;
  }
}
</style>