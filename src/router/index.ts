import { createRouter, createWebHashHistory } from 'vue-router'
// 引入Layout组件
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: { title: '首页', icon: 'mdi-home-circle-outline' },
        component: () => import('@/pages/Home.vue')
      },
      {
        path: '/about',
        name: 'About',
        meta: { title: '关于', icon: 'mdi-information-outline' },
        component: () => import('@/pages/About.vue')
      },
      {
        path: '/more',
        name: 'More',
        meta: { title: '更多', icon: 'mdi-page-next' },
        component: () => import('@/pages/More.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
