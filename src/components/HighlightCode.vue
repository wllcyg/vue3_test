<template>
<div>
    <v-expansion-panels >
        <v-expansion-panel
        >
            <template v-slot:title>
                <div class="d-flex align-center justify-space-between w-100">
                    <span>{{ title }}</span>
                    <v-btn
                        icon
                        size="small"
                        @click.stop="copyCode"
                        title="复制代码"
                        class="mr-2"
                    >
                        <v-icon>mdi-content-copy</v-icon>

                        <v-tooltip
                            activator="parent"
                            :model-value="copied"
                            location="top"
                        >
                            点击复制!
                        </v-tooltip>
                    </v-btn>
                </div>
            </template>
            <v-expansion-panel-text >
                <highlightjs style="max-height: 320px;overflow-y: auto;" :code="code" :language="lang" />
            </v-expansion-panel-text>
        </v-expansion-panel>

    </v-expansion-panels>

</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
type SupportedLanguage = 'vue' | 'javascript' | 'css' | 'typescript' | 'html';
import { defineProps } from 'vue';
const props = defineProps<{
  lang: SupportedLanguage;
  code: string;
  title: string;
}>();
import 'highlight.js/styles/github.css';
import 'highlight.js/lib/common';
import hljs from 'highlight.js/lib/core'; // 使用core而非common可以减小体积
import vue from 'highlight.js/lib/languages/xml'; // vue实际上使用xml高亮
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import hljsVuePlugin from "@highlightjs/vue-plugin";
const highlightjs = hljsVuePlugin.component;
// 3. 注册需要的语言
hljs.registerLanguage('vue', vue);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', html);

const copied = ref(false);

const copyCode = (event: Event) => {
    event.stopPropagation(); // 防止触发面板展开/折叠

    navigator.clipboard.writeText(props.code || '')
        .then(() => {
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};
</script>
