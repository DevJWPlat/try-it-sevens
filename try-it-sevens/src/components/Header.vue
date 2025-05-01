<script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import logo from '@/assets/images/logo.svg'

  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const pageTitle = computed(() => {
    switch (route.path) {
      case '/':
        return 'TryIt Sevens'
      case '/scoreboard':
        return 'Scoreboard'
      case '/login':
        return 'Login'
      case '/about':
        return 'About'
      default:
        return 'TryIt Sevens'
    }
  })
  
  
  const isOpen = ref(false)
  const toggleMenu = () => {
    isOpen.value = !isOpen.value
  }
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
                isOpen ? 'rotate-45 translate-y-1.5' : '' ]"
            ></span>
            <span
              :class="[
                'w-6 h-0.5 bg-black transition-opacity duration-300',
                isOpen ? 'opacity-0' : '' ]"
            ></span>
            <span
              :class="[
                'w-6 h-0.5 bg-black transition-transform duration-300',
                isOpen ? '-rotate-45 -translate-y-1.5' : '' ]"
            ></span>
          </button>
        </div>
    
        <nav
        :class="[
          'fixed top-0 right-0 w-full h-screen bg-white flex flex-col justify-between p-12 transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
      >

        <div class="pt-30 flex flex-col items-center justify-start space-y-6 text-xl font-semibold">
          <RouterLink to="/" @click="toggleMenu">Home</RouterLink>
          <RouterLink to="/scoreboard" @click="toggleMenu">Scoreboard</RouterLink>
          <RouterLink to="/games" @click="toggleMenu">Games</RouterLink>
          <RouterLink to="/map" @click="toggleMenu">Map</RouterLink>
          <RouterLink to="/contact" @click="toggleMenu">Contact</RouterLink>
          <RouterLink to="/fixtures" @click="toggleMenu">Fixtures</RouterLink>
        </div>
        
          <!-- Login Link -->
          <RouterLink
              to="/login"
              @click="toggleMenu"
              class="px-6 py-2 rounded-full text-base shadow text-center transition custom-button"
            >
              Login
            </RouterLink>
      </nav>
      
      </div>
    </header>
</template>

<style>
  nav a {
    transition: ease 0.3s;
  }

  .custom-button {
    background: #93D0F2;
  }
  
</style>
  