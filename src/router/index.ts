import { createRouter, createWebHistory } from 'vue-router'
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
        path: '/audio',
        name: 'Audio',
        meta: { title: '音频', icon: 'mdi-music-circle-outline' },
        component: () => import('@/pages/AudioChart.vue')
      },

      {
        path: '/code',
        name: 'code',
        meta: { title: 'code', icon: 'mdi-code-json' },
        component: () => import('@/pages/Code.vue')
      },
      // 示例
      {
        path: '/example',
        name: 'Example',
        meta: { title: '示例', icon: 'mdi-code-json' },
        component: () => import('@/pages/Example.vue')
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
      },

    ]
  },
  {
      path: '/welcome',
      name: 'Welcome',
      meta: { title: '欢迎'},
      component: () => import('@/pages/Welcome.vue')
  },
  {
      path:'/:pathMatch(.*)*',
      name:'NotFound',
      meta: { title: '404', icon: 'mdi-alert-circle-outline' },
      component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
