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
