<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function go(path) { router.push(path) }
function logout() { router.push('/login') }
</script>

<template> 
  <main class="wrapper pt-20 max-w-sm mx-auto space-y-6 text-center">
    <button
    @click="go('/admin/accounts')" class="block w-full btn-dark bg-black text-white rounded-lg hover:bg-gray-800 transition" >
      Manage Accounts
    </button>
    <button @click="go('/admin/teams')" class="block w-full btn-dark bg-black text-white rounded-lg hover:bg-gray-800 transition">
      Manage Teams
    </button>
    <button @click="go('/admin/games')"    class="block w-full btn-dark bg-black text-white rounded-lg">
      Game Planner
    </button>
    <!-- <button @click="go('/admin/sponsors')" class="block w-full py-3 bg-black text-white rounded-lg">
      Sponsors
    </button> -->

    <!-- <hr class="my-4"/>

    <button @click="logout" class="block w-full py-3 bg-red-600 text-white rounded-lg">
      Log out
    </button> -->
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
 