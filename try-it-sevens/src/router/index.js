// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import GamesView from '../views/GamesView.vue'
import ContactView from '../views/ContactView.vue'

import SuperAdminHome from '@/views/admin/SuperAdminHome.vue'
import TeamAdminHome  from '@/views/admin/TeamAdminHome.vue'
import AdminHome from '@/views/admin/AdminHome.vue'

import AdminAccountsView    from '@/views/admin/AccountsView.vue'
import AdminTeamsView       from '@/views/admin/TeamsView.vue'
// import AdminScoreboardView  from '@/views/admin/ScoreboardView.vue'
import AdminGamePlannerView from '@/views/admin/GamePlannerView.vue'
import AdminSponsorsView    from '@/views/admin/SponsorsView.vue'

// Helper for role-based guards
function requireAccess(...allowedRoles) {
  // Normalize the allowed roles to lowercase once
  const roles = allowedRoles.map(r => r.toLowerCase())

  return (to, from, next) => {
    const auth = useAuthStore()
    const raw   = auth.user?.access ?? auth.user?.role ?? ''
    const role  = String(raw).toLowerCase()

    console.log(
      '[guard]',
      'loggedIn=', auth.loggedIn,
      'raw access=', raw,
      'normalized role=', role,
      'allowedRoles=', roles
    )

    // Redirect unauthenticated users to login
    if (!auth.loggedIn) {
      return next('/login')
    }

    // Allow if user role matches any allowed role
    if (roles.includes(role)) {
      return next()
    }

    // Otherwise redirect home
    return next('/')
  }
}

const routes = [
  { path: '/',           component: HomeView },
  { path: '/games',      component: GamesView },
  { path: '/contact',    component: ContactView },
  { path: '/login',      component: LoginView },
  { path: '/team/:team', component: () => import('@/views/TeamView.vue') },

  // Super Admin
  {
    path: '/super-admin',
    component: SuperAdminHome,
    beforeEnter: requireAccess('super')
  },
  {
    path: '/admin/accounts',
    component: AdminAccountsView,
    beforeEnter: requireAccess('super', 'admin')
  },

  // Admin
  {
    path: '/admin',
    component: AdminHome,
    beforeEnter: requireAccess('admin')
  },
  {
    path: '/admin/teams',
    component: AdminTeamsView,
    beforeEnter: requireAccess('admin', 'super')
  },
  // {
  //   path: '/admin/scoreboard',
  //   component: AdminScoreboardView,
  //   beforeEnter: requireAccess('admin', 'super')
  // },
  {
    path: '/admin/games',
    component: AdminGamePlannerView,
    beforeEnter: requireAccess('admin', 'super')
  },
  {
    path: '/admin/sponsors',
    component: AdminSponsorsView,
    beforeEnter: requireAccess('admin', 'super')
  },

  // Team Admin
  {
    path: '/team-admin',
    component: TeamAdminHome,
    beforeEnter: requireAccess('team')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

