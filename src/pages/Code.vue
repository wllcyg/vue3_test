<template>
    <div>
        <h4 class="title">Code</h4>
        <HighlightCode :code="promiseCode" lang="typescript"  title="Promise Code"/>
        <h4 class="title">响应式</h4>
    </div>
</template>
<script lang="ts" setup>
import HighlightCode from '@/components/HighlightCode.vue';
import promiseCode from './code/promise.ts?raw';
import { ref } from 'vue';
</script>
<style scoped>
.title{
    margin: 1rem 0;
}
</style>
