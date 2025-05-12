<template>
  <div class="scroll-trigger">
    <h2>Scroll down</h2>
    <div class="scroll-box bg-[#0AE448]" ref="scrollBox"></div>
    <div class="outline"></div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ref, onMounted } from 'vue';

const scrollBox = ref(null);

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
    gsap.to(scrollBox.value, {
        x:300,
        scrollTrigger:{
            start:100,
            end:300,
            scrub:true,
        }
    });
    gsap.to(scrollBox.value, {
        y:-300,
        scrollTrigger:{
            start:400,
            end:800,
            scrub:true,
        }
    });
});

</script>

<style scoped lang="scss">
.scroll-trigger {
  width: 100%;
  height: 100%;
  height: 300vh;
}
.scroll-box {
  width: 76px;
  height: 76px;
}
h2 {
  margin-bottom: 100vh;
}
.scroll-box, .outline {
  position: fixed;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
}

.outline {
  width: 80px;
  height: 80px;
  transform: translate(-2px, -2px);
  outline: dashed 2px black;
}
</style>

