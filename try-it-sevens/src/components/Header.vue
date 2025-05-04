<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/images/logo.svg'

const auth   = useAuthStore()
const route  = useRoute()
const router = useRouter()
const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function handleAuth() {
  toggleMenu()
  if (auth.loggedIn) {
    auth.logout()
    router.push('/')
  } else {
    router.push('/login')
  }
}

// … pageTitle / navLinks as before …
</script>

<template>
  <header class="py-4 bg-white fixed top-0 left-0 w-full z-50">
    <div class="wrapper">
      <div class="flex justify-between items-center">
        <RouterLink to="/" class="logo">
          <img :src="logo" alt="Logo" class="h-10" />
        </RouterLink>
        <h1 class="text-xl font-bold">{{ pageTitle }}</h1>
        <button @click="toggleMenu" class="relative z-50 flex flex-col gap-1">
          <span
            :class="[
              'w-6 h-0.5 bg-black transition-transform duration-300',
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            ]"
          />
          <span
            :class="[
              'w-6 h-0.5 bg-black transition-opacity duration-300',
              isOpen ? 'opacity-0' : ''
            ]"
          />
          <span
            :class="[
              'w-6 h-0.5 bg-black transition-transform duration-300',
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            ]"
          />
        </button>
      </div>

      <nav
        :class="[
          'fixed top-0 right-0 w-full h-screen bg-white flex flex-col justify-between p-12 transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
      >
        <div class="flex flex-col items-center space-y-6 text-xl font-semibold">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="toggleMenu"
            class="hover:text-emerald-500 transition"
          >
            {{ link.text }}
          </RouterLink>
        </div>

        <button @click="handleAuth" class="custom-button px-6 py-2 rounded-full">
          {{ auth.loggedIn ? 'Logout' : 'Login' }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
nav a,
nav button {
  transition: ease 0.3s;
}
.custom-button {
  background: #93D0F2;
}
</style>
