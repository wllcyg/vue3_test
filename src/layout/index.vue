<template>
  <v-app class="app">
    <v-navigation-drawer
        v-model="isOpen"
        app
        :width="drawerWidth"
        :rail="!isOpen"
        :rail-width="56"
        class="sidebar"
    >
      <v-img aspect-ratio="16/9" cover height="64" :src="avatar"></v-img>
      <slide-bar/>
    </v-navigation-drawer>

    <v-app-bar
        app
        class="header"
        color="teal-darken-4"
        image="https://picsum.photos/1920/1080?random"
    >
      <template v-slot:image>
        <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>luckys</v-app-bar-title>
      <v-btn icon>
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-map-marker-outline</v-icon>
      </v-btn>
      <v-btn>
        {{ store.city }}
      </v-btn>
    </v-app-bar>

    <v-main class="main">
      <v-container fluid>
        <Suspense>
          <template #default>
            <router-view></router-view>
          </template>
          <template #fallback>
            <v-sheet
                class="d-flex align-center justify-center"
                height="300"
            >
              <v-progress-circular
                  indeterminate
                  color="primary"
                  class="mr-3"
              ></v-progress-circular>
              <span>内容加载中...</span>
            </v-sheet>
          </template>
        </Suspense>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import {ref, onMounted} from "vue";
import avatar from "@/assets/material.jpg";
import SlideBar from "@/layout/SlideBar.vue";
const isOpen = ref(true);
const drawerWidth = 240;
import { useAppStore } from '@/store/index.ts'
const store = useAppStore()
function toggleSidebar() {
  isOpen.value = !isOpen.value;
  console.log("Sidebar toggled", isOpen.value);
}



onMounted(() => {
  //引入插件，此示例采用异步引入，更多引入方式 https://lbs.amap.com/api/javascript-api-v2/guide/abc/plugins

})
</script>

<style scoped lang="scss">
.app, .sidebar {
  background-color: var(--background-color);
}


</style>
