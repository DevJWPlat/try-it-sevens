<script setup>
import { ref } from 'vue'
import FollowUs from '@/components/FollowUs.vue'

// form fields
const name = ref('')
const email = ref('')
const message = ref('')

function submitForm() {
  // handle form submission logic
  console.log('Submit:', { name: name.value, email: email.value, message: message.value })
  // clear fields
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>

<template>
  <main class="wrapper pb-10 space-y-8">
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-2xl font-bold text-center">Contact</h1>
      <p class="text-center">Want to take part in TryIt Sevens 2026? Get in touch now</p>

      <form @submit.prevent="submitForm" class="space-y-4">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email Address"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          v-model="message"
          rows="4"
          placeholder="Message"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        ></textarea>
        <button
          type="submit"
          class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Submit
        </button>
      </form>

      <FollowUs />
    </section>
  </main>
</template>

<style scoped>
/* Page-specific styling if needed */
</style>

