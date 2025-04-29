<template>
  <div class="example-component">
      <h3 class="title">effectsLine</h3>
      <v-card >
          <div class="flex flex-col items-center gap-4 p-4">
              <div ref="green" class='box w-20 h-20 bg-gradient-to-r from-green-400 to-green-300 green rounded-lg'></div>
              <div ref="purple" class='box w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-300 purple rounded-lg'></div>
              <div ref="blue" class='box w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-300 blue rounded-lg'></div>
          </div>
      </v-card>
  </div>
</template>

<script setup>
/**
 * Import necessary dependencies
  使用自定义方式注册动效
 */
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { time } from 'echarts';
const green = ref(null);
const purple = ref(null);
const blue = ref(null);
// 单个注册自定义动效
gsap.registerEffect({
    name:'fade',
    defaults: {duration:2},
    effect:(targets, config) => {
        return gsap.to(targets, {
            opacity:0,
            duration:config.duration,
            opacity:0
        })
    }
})

// 批量注册

const effects = [
    {
        id:'fadeSlideTo',
        props:{
            opacity:0.85,
            x:300,
            yoyo:true,
        }
    },
    {
      id: "fadeSlideFrom",
      animate: 'from',
      props: { opacity: 0.25, x: 300, yoyo: true,   }
    },
    {
      id: "fadeSlideFromTo",
      animate: 'fromTo',
      props: { opacity: 0.1, x: 300},
      props2: { opacity: 1, x: 600, yoyo: true,  }
    }
]
effects.forEach(effect => {
  gsap.registerEffect({
    name: effect.id,
    defaults: { duration: 1 },
    extendTimeline: true,
    effect(targets, config) {
      if(effect.animate === 'from'){
        return gsap.from(targets, {...effect.props,...config })
      }
      else if (effect.animate === 'fromTo'){
        return gsap.fromTo(targets, {...effect.props,...config }, {...effect.props2})
        }
      else {
        return gsap.to(targets, {...effect.props,...config })
      }
    }
  });
});




onMounted(() =>{
    // document.querySelectorAll(".box").forEach(function(box) {
    //   box.addEventListener("mouseenter", function() {
    //     gsap.effects.fade(this);
    //   })
    // })
    //
    const tl = gsap.timeline();
          tl.fadeSlideTo(green.value)
            .fadeSlideFrom(purple.value, 0)
            .fadeSlideFromTo(blue.value, 0)
})

</script>

<style scoped lang="scss">

</style>
