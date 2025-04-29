<template>
  <div class="example-component">
      <h3 class="title">基础动画</h3>
      <v-card >
          <v-btn class='m-4' @click="startAnimation">start</v-btn>
          <v-btn class='m-4' @click="resetAnimation">reset</v-btn>
          <div class="flex flex-col gap-4 p-4">
              <div ref="green" class='w-20 h-20 bg-gradient-to-r from-green-400 to-green-300 green rounded-lg'></div>
              <div ref="purple" class='w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-300 purple rounded-lg'></div>
              <div ref="blue" class='w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-300 blue rounded-lg'></div>
          </div>
      </v-card>
  </div>
  <TimeLine/>
  <Stage />
  <AnimateLearn />
  <TWline/>
  <Effect/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TWline from '@/components/TWline.vue';
import Effect from '@/components/Effect.vue';
import AnimateLearn from '@/components/AnimateLearn.vue';
import Stage from '@/components/Stage.vue';
import TimeLine from '@/components/TimeLine.vue';
import gsap from 'gsap';
const green = ref(null);
const purple = ref(null);
const blue = ref(null);
const startAnimation = () => {
    gsap.to(green.value, {rotation: 360, x: 100, duration: 1});
    gsap.to(purple.value, {rotation: -360, x: 300, duration: 1});
    gsap.to(blue.value,  {rotation: 360, x: 400, duration: 1});
};
const resetAnimation = () => {
    gsap.to([green.value, purple.value, blue.value], {rotation: 0, x: 0, duration: 1});
};
</script>

<style scoped lang="scss">

</style>
