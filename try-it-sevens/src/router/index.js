import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ScoreboardView from '../views/ScoreboardView.vue'
import GamesView from '../views/GamesView.vue'
import MapView from '../views/MapView.vue'
import ContactView from '../views/ContactView.vue'
import SuperAdminHome from '@/views/admin/SuperAdminHome.vue'
import TeamAdminHome  from '@/views/admin/TeamAdminHome.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import AdminAccountsView      from '@/views/admin/AccountsView.vue'
import AdminTeamsView         from '@/views/admin/TeamsView.vue'
import AdminScoreboardView    from '@/views/admin/ScoreboardView.vue'
import AdminGamePlannerView   from '@/views/admin/GamePlannerView.vue'
import AdminSponsorsView      from '@/views/admin/SponsorsView.vue'





const routes = [
  { path: '/',           component: HomeView },
  { path: '/scoreboard', component: ScoreboardView },
  { path: '/games',      component: GamesView },
  { path: '/map',        component: MapView },
  { path: '/contact',    component: ContactView },
  { path: '/login',       component: LoginView },
  { path: '/super-admin', component: SuperAdminHome },
  // super-admin dashboard
  { path: '/super-admin',         component: SuperAdminHome },
  { path: '/admin/teams',         component: AdminTeamsView },
  { path: '/admin/scoreboard',    component: AdminScoreboardView },
  { path: '/admin/games',         component: AdminGamePlannerView },
  { path: '/admin/sponsors',      component: AdminSponsorsView },
  {
    path: '/admin/accounts',
    component: AdminAccountsView,
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore()
      if (!auth.loggedIn) next('/login')
      else next()
    }
  },
  

  // team-admin dashboard
  { path: '/team-admin',          component: TeamAdminHome },

  // dmin dashboard
  { path: '/admin',          component: AdminHome },
  { 
    path: '/team/:team', 
    component: () => import('@/views/TeamView.vue') 
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

