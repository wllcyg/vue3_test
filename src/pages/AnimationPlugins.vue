<template>
    <div class="scroll-container">
        <h1 class="fixed-header">Scroll Down ↓</h1>
        <div class="content-wrapper">
            <div class="box green"></div>
        </div>
        <div class="scroll-indicator">继续向下滚动查看完整动画</div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollTriggerInstance;

onMounted(() => {
    // 创建动画并存储引用以便后续清理
    scrollTriggerInstance = gsap.to(".green", {
        rotation: 900,
        duration: 1,
        scrollTrigger: {
            trigger: '.box',
            start: "top bottom-=100", // 元素顶部碰到视口底部上方100px
            end: "bottom top+=300",   // 元素底部碰到视口顶部下方300px
            scrub: 1,                 // 减少延迟
            markers: true,
            onEnter: () => console.log("动画开始"),
            onLeave: () => console.log("动画结束"),
            id: "box-rotation"        // 便于调试
        }
    });
});

// 组件销毁时清理
onBeforeUnmount(() => {
    if (scrollTriggerInstance) {
        scrollTriggerInstance.scrollTrigger.kill();
    }
});
</script>

<style scoped>
.scroll-container {
    min-height: 200vh;
    position: relative;
}

.fixed-header {
    position: fixed;
    width: 100%;
    text-align: center;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 0;
    z-index: 10;
    margin: 0;
}

.content-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding-top: 50vh;
}

.box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 50px;
    height: 50px;
    background-color: #00ff00;
}

.scroll-indicator {
    position: fixed;
    bottom: 20px;
    width: 100%;
    text-align: center;
    font-style: italic;
    opacity: 0.7;
}
</style>
