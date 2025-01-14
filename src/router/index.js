import { createRouter, createWebHistory } from 'vue-router';
import AuditManagementView from '../views/AuditManagementView.vue';
import AuditSummaryView from '../views/AuditSummaryView.vue';
import AuditView from '../views/AuditView.vue';
import HomeView from '../views/HomeView.vue';
import NonConformitiesView from '../views/NonConformitiesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/audit/:id',
      name: 'audit-management',
      component: AuditManagementView
    },
    {
      path: '/audit/:id/questions',
      name: 'audit-questions',
      component: AuditView
    },
    {
      path: '/audit/:id/summary',
      name: 'audit-summary',
      component: AuditSummaryView
    },
    {
      path: '/audit/:id/non-conformities',
      name: 'audit-non-conformities',
      component: NonConformitiesView
    }
  ]
});

export default router;