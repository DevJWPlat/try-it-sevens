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

      <form @submit.prevent="submitForm" class="space-y-4 contact-form">
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
          class="w-full submit"
        >
          Submit
        </button>
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.contact-form {
  .submit {
    background: #231F20;
    color: #96D1F2;
    font-weight: 500;
    letter-spacing: 1px;
    border-radius: 12px;
    padding: 12px 30px;
    transition: all .3s;
    &:hover {
      background: #96D1F2;
      color: #231F20;
    }
  }
}
</style>

