import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/router/guards/auth.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/views/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/analytics' },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/analytics/AnalyticsOverviewView.vue'),
        },
        {
          path: 'sites',
          name: 'sites',
          component: () => import('@/views/sites/SitesListView.vue'),
        },
        {
          path: 'visitors',
          name: 'visitors',
          component: () => import('@/views/visitors/VisitorsListView.vue'),
        },
        {
          path: 'visitors/:fingerprintId',
          name: 'visitor-detail',
          component: () => import('@/views/visitors/VisitorDetailView.vue'),
          props: true,
        },
        {
          path: 'blocklist',
          name: 'blocklist',
          component: () => import('@/views/blocklist/BlocklistListView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach(authGuard)

export default router
