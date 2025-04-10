<template>
  <div class="container">
     <slide class="sidebar" :class="{ 'slidebar-open': isOpen, 'slidebar-close': !isOpen }">
         侧边栏
     </slide>
     <header class="header">
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
     </header>
    <main class="main">
      <Suspense>
        <template #default>
          <router-view></router-view>
        </template>
        <template #fallback>
          <div class="loading">
            <p>内容加载中...</p>
          </div>
        </template>
      </Suspense>
    </main>


  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const isOpen = ref(false)
function toggleSidebar() {
  isOpen.value = !isOpen.value;
  console.log('Sidebar toggled', isOpen.value);
}
</script>

<style scoped lang="scss">
.container {
    display: grid;
    grid-template-columns:auto  1fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: "sidebar header header"
                         "sidebar main main"
                         "sidebar main main";
    min-height: 100vh;
    .sidebar{
        grid-area: sidebar;
        background: #f0f0f0;
        padding: 1rem;
        min-width: var(--sidebar-close);
        white-space: nowrap;
        transition: all 0.3s ease;
    }
    .slidebar-open{
        width: var(--sidebar-open);
    }
    .slidebar-close{
        width: var(--sidebar-close);
    }
    .header {
        grid-area: header;
        background: #e3f2fd;
        padding: 1rem;
        height: 60px;
    }
    .main {
        grid-area: main;
        padding: 1rem;
        min-height: 300px;
    }
}
@media (max-width: 768px) {
  .container {
    grid-template-columns: au;
    grid-template-areas:
      "header"
      "main"
  }

  .sidebar {
    white-space: normal; /* 恢复文字换行 */
  }
  .slide-open{
    width: 100% !important;
  }
  .slide-close{
    width: 0 !important;
  }
}


</style>
