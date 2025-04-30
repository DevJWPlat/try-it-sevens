<script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  
  const isOpen = ref(false)
  const toggleMenu = () => {
    isOpen.value = !isOpen.value
  }
</script>


<template>
    <header class="p-4 bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold">TryItSevens</h1>
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
          'fixed top-0 right-0 w-full h-screen bg-white flex flex-col items-center justify-center space-y-6 text-xl font-semibold transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
      >
        <RouterLink to="/" @click="toggleMenu">Home</RouterLink>
        <RouterLink to="/about" @click="toggleMenu">About</RouterLink>
        <RouterLink to="/fixtures" @click="toggleMenu">Fixtures</RouterLink>
      </nav>
    </header>
</template>

<style scoped>
  nav a {
    transition: color 0.3s;
  }
  nav a:hover {
    color: #10b981; /* Tailwind's emerald-500 */
  }
  
</style>
  