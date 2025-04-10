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
        component: () => import('@/pages/Home.vue')
      },
      // 其他路由也作为Layout的子路由
      // 例如:
      // {
      //   path: 'about',
      //   name: 'About',
      //   component: () => import('../views/About.vue')
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
