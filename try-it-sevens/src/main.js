// main.js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { useAuthStore } from '@/stores/auth'

async function bootstrap() {
  const pinia = createPinia()
  const app   = createApp(App)
  app.use(pinia)
  app.use(router)
  app.use(PrimeVue, {
    unstyled: true,
  })

  // restore any existing session
  const auth = useAuthStore()
  await auth.restore()

  app.mount('#app')
}

// app.use(pinia)
// app.use(createPinia())
// app.use(router)
// app.use(PrimeVue, {
//   unstyled: true,
// })

// app.mount('#app')

// const auth = useAuthStore()
// // auth.init()
// auth.restore()

bootstrap()