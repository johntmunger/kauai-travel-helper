import { createRouter, createWebHistory } from 'vue-router';
import RegionView from '../views/RegionView.vue';
import ActivityDetailView from '../views/ActivityDetailView.vue';

const routes = [
  {
    path: '/',
    redirect: '/south',
  },
  {
    path: '/:region',
    name: 'region',
    component: RegionView,
    beforeEnter: (to, from, next) => {
      const validRegions = ['north', 'east', 'south', 'west'];
      if (validRegions.includes(to.params.region.toLowerCase())) {
        next();
      } else {
        next('/south');
      }
    },
  },
  {
    path: '/:region/activity/:id',
    name: 'activity-detail',
    component: ActivityDetailView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/south',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;

