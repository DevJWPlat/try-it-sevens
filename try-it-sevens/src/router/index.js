import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ScoreboardView from '../views/ScoreboardView.vue'
import GamesView from '../views/GamesView.vue'
import MapView from '../views/MapView.vue'
import ContactView from '../views/ContactView.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/scoreboard', component: ScoreboardView },
  { path: '/games', component: GamesView },
  { path: '/map', component: MapView },
  { path: '/contact', component: ContactView },
  { path: '/login', component: LoginView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

