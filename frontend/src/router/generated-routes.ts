// Auto-generated route definitions — do not edit manually.
import type { RouteRecordRaw } from 'vue-router';

const generatedRoutes: RouteRecordRaw[] = [
  {
    path: '/demo-api-user-v1s',
    name: 'demo-api-user-v1s',
    component: () => import('../pages/demo-api-user-v1/IndexPage.vue'),
    meta: { title: 'Demo Api User V1s' },
  },
  {
    path: '/demo-api-user-v1s/:id',
    name: 'demo-api-user-v1-detail',
    component: () => import('../pages/demo-api-user-v1/DetailPage.vue'),
    meta: { title: 'Demo Api User V1 Detail' },
    props: true,
  },
  {
    path: '/demo-api-user-v1get-ones',
    name: 'demo-api-user-v1get-ones',
    component: () => import('../pages/demo-api-user-v1get-one/IndexPage.vue'),
    meta: { title: 'Demo Api User V1get Ones' },
  },
  {
    path: '/demo-api-user-v1get-ones/:id',
    name: 'demo-api-user-v1get-one-detail',
    component: () => import('../pages/demo-api-user-v1get-one/DetailPage.vue'),
    meta: { title: 'Demo Api User V1get One Detail' },
    props: true,
  },
  {
    path: '/demo-internal-model-entity-users',
    name: 'demo-internal-model-entity-users',
    component: () => import('../pages/demo-internal-model-entity-user/IndexPage.vue'),
    meta: { title: 'Demo Internal Model Entity Users' },
  },
  {
    path: '/demo-internal-model-entity-users/:id',
    name: 'demo-internal-model-entity-user-detail',
    component: () => import('../pages/demo-internal-model-entity-user/DetailPage.vue'),
    meta: { title: 'Demo Internal Model Entity User Detail' },
    props: true,
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../pages/user/IndexPage.vue'),
    meta: { title: 'Users' },
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('../pages/user/DetailPage.vue'),
    meta: { title: 'User Detail' },
    props: true,
  },
];

export default generatedRoutes;
