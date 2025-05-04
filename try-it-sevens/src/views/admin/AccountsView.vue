<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '@/lib/supabase'
 

const accounts       = ref([])               // to refresh after inserts
const isModalOpen    = ref(false)
const isEditing      = ref(false)
const form           = reactive({ id: null, accessLevel: 'Admin', team: '', username: '', password: '' })
const showFormPass   = ref(false)

async function fetchAccounts() {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .order('id')
  if (!error) accounts.value = data
}

async function saveAccount() {
  if (isEditing.value) {
    // UPDATE existing
    await supabase
      .from('app_users')
      .update({
        username: form.username,
        password: form.password,
        access: form.accessLevel,
        team: form.accessLevel === 'Team Admin' ? form.team : null
      })
      .eq('id', form.id)
  } else {
    // INSERT new
    await supabase
      .from('app_users')
      .insert([{
        username: form.username,
        password: form.password,
        access: form.accessLevel,
        team: form.accessLevel === 'Team Admin' ? form.team : null
      }])
  }

  await fetchAccounts()      // refresh table
  isModalOpen.value = false
}

async function deleteAccount() {
  if (confirm('Are you sure you want to delete this account?')) {
    await supabase
      .from('app_users')
      .delete()
      .eq('id', form.id)
    await fetchAccounts()
    isModalOpen.value = false
  }
}

// on mount…
fetchAccounts()
</script>


<template>
  <div class="wrapper pt-20 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Manage Accounts</h1>

    <!-- Table of accounts -->
    <table class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th class="px-4 py-2">ID</th>
          <th class="px-4 py-2">Username</th>
          <th class="px-4 py-2">Access</th>
          <th class="px-4 py-2">Team</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="acc in accounts" :key="acc.id">
          <td class="px-4 py-2">{{ acc.id }}</td>
          <td class="px-4 py-2">{{ acc.username }}</td>
          <td class="px-4 py-2">{{ acc.access }}</td>
          <td class="px-4 py-2">{{ acc.team || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
