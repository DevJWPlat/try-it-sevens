<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function go(path) { router.push(path) }
function logout() { router.push('/login') }
</script>

<template>
  <main class="wrapper pt-20 max-w-sm mx-auto space-y-6 text-center">
    <h1 class="text-2xl font-bold">Admin</h1>
    <button @click="go('/admin/teams')" class="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
      Your Team
    </button>

    <hr class="my-4"/>

    <button @click="logout" class="block w-full py-3 bg-red-600 text-white rounded-lg">
      Log out
    </button>
  </main>
</template>