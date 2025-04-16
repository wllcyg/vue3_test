<template>
    <div>
        <h3>Code</h3>
        <HighlightCode :code="promiseCode" lang="typescript"  title="Promise Code"/>
    </div>
</template>
<script lang="ts" setup>
import HighlightCode from '@/components/HighlightCode.vue';
import promiseCode from './code/promise.ts?raw';
import { ref } from 'vue';
</script>
