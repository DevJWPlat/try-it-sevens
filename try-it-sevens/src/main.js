// main.js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()



app.use(pinia)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
})

app.mount('#app')

const auth = useAuthStore()
// auth.init()
auth.restore()
