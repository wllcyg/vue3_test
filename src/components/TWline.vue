<template>
  <div class="example-component">
      <h3 class="title">时间线控制</h3>
      <v-card >
          <v-btn class='m-4' @click="startAnimation">start</v-btn>
          <v-btn class='m-4' @click="pauseAnimation">pause</v-btn>
          <v-btn class='m-4' @click="resumeAnimation">resume</v-btn>
          <v-btn class='m-4' @click="resetAnimation">reset</v-btn>
          <div class="flex flex-col items-center gap-4 p-4">
              <div ref="green" class='w-20 h-20 bg-gradient-to-r from-green-400 to-green-300 green rounded-lg'></div>
              <div ref="purple" class='w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-300 purple rounded-lg'></div>
              <div ref="blue" class='w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-300 blue rounded-lg'></div>
          </div>
      </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { time } from 'echarts';
const green = ref(null);
const purple = ref(null);
const blue = ref(null);
const animateStatus = ref('initial');
onMounted(() => {
    initAnimation();
});
const initAnimation = () => {


}
const timeline =  gsap.timeline(
    {
        paused: true,
        onComplete: () => {
            animateStatus.value = 'completed';
        },
        onReverseComplete: () => {
            animateStatus.value = 'initial';
        }
    }
)
const startAnimation = () => {
    timeline
        .to(green.value, { rotation: 360, x: 100, duration: 1 })
        .to(purple.value, { rotation: -360, x: -300, duration: 1 })
        .to(blue.value, { rotation: 360, x: 400, duration: 1 });
    timeline.play();
};
const resetAnimation = () => {
   timeline.reverse();
};
const pauseAnimation = () => {
    timeline.pause();
};
const resumeAnimation = () => {
    timeline.resume();
};
</script>

<style scoped lang="scss">

</style>
