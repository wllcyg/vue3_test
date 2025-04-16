<template>
    <v-list density="compact" nav>
        <v-list-item v-for="(item, i) in menu" color="primary" :key="i" :value="item" :active="item.path === activePath" @click="handleItemClick(item)">
            <template v-slot:prepend>
                 <v-icon :icon="item.meta.icon"></v-icon>
               </template>
            <v-list-item-title v-text="item.meta.title"></v-list-item-title>
        </v-list-item>
    </v-list>
</template>
<script lang="ts" setup>
// 使用vue router 获取路由数据
import { useRouter, useRoute } from 'vue-router';
import { ref,onMounted } from 'vue'
const router = useRouter();
const route = useRoute();
const routes = router.getRoutes();
const menu = routes
  .filter(route => {
    return route.path !== '/' &&
           route.name !== 'NotFound' &&
           !route.path.includes(':pathMatch');
  })
  .map(route => ({
    path: route.path,
    meta: route.meta
  }));

const activePath = ref(null);
onMounted(() => {
    activePath.value = route.path;
});

const handleItemClick = (item) => {
    activePath.value = item.path;
    router.push(item.path);
};

</script>
<style scoped lang="scss"></style>
