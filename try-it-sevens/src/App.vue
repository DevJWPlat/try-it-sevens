<script setup>
import MobileMenu from './components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <MobileMenu />
    <RouterView />
    <Footer />
  </div>
</template>


