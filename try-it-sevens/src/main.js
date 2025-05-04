// main.js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

// Create app and store
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Import store *after* Pinia is ready
import { useAuthStore } from '@/stores/auth'

// Restore user session before mounting
const auth = useAuthStore()
auth.restore()

// Use plugins
app.use(router)
app.use(PrimeVue, { unstyled: true })

// Mount app
app.mount('#app')
