// Auto-generated route definitions — do not edit manually.
import type { RouteRecordRaw } from 'vue-router';

const generatedRoutes: RouteRecordRaw[] = [
  {
    path: '/demo.api.user.v1.s',
    name: 'demo.api.user.v1.s',
    component: () => import('../pages/demo.api.user.v1./IndexPage.vue'),
    meta: { title: 'Demo.api.user.v1.s' },
  },
  {
    path: '/demo.api.user.v1.s/:id',
    name: 'demo.api.user.v1.-detail',
    component: () => import('../pages/demo.api.user.v1./DetailPage.vue'),
    meta: { title: 'Demo.api.user.v1. Detail' },
    props: true,
  },
  {
    path: '/demo.api.user.v1.get-ones',
    name: 'demo.api.user.v1.get-ones',
    component: () => import('../pages/demo.api.user.v1.get-one/IndexPage.vue'),
    meta: { title: 'Demo.api.user.v1.get Ones' },
  },
  {
    path: '/demo.api.user.v1.get-ones/:id',
    name: 'demo.api.user.v1.get-one-detail',
    component: () => import('../pages/demo.api.user.v1.get-one/DetailPage.vue'),
    meta: { title: 'Demo.api.user.v1.get One Detail' },
    props: true,
  },
  {
    path: '/demo.internal.model.entity.users',
    name: 'demo.internal.model.entity.users',
    component: () => import('../pages/demo.internal.model.entity.user/IndexPage.vue'),
    meta: { title: 'Demo.internal.model.entity.users' },
  },
  {
    path: '/demo.internal.model.entity.users/:id',
    name: 'demo.internal.model.entity.user-detail',
    component: () => import('../pages/demo.internal.model.entity.user/DetailPage.vue'),
    meta: { title: 'Demo.internal.model.entity.user Detail' },
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
