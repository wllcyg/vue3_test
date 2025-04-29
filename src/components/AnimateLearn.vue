<template>
    <div class="example-component">
        <h3 class="title">animateLearn</h3>
        <v-card>
            <div class="flex flex-col items-center gap-4 p-4">
                <div
                    ref="boxRef"
                    class="box w-20 h-20 bg-gradient-to-r from-green-400 to-green-300 green rounded-lg"
                ></div>
                <div
                    ref="boxRef2"
                    class="box w-20 h-20 bg-gradient-to-r from-red-500 to-red-500-300 green rounded-lg"
                ></div>
                <div
                    ref="boxRef3"
                    class="box w-20 h-20 bg-gradient-to-r from-pink-400 to-pink-300 green rounded-lg"
                ></div>
            </div>
        </v-card>
        <h3 class="title">Cnavas</h3>
        <v-card>
            <div class='flex  items-center gap-4 p-4'>
                <canvas ref="canvasRef" id="canvas" width="300" height="300"></canvas>
                <div>
                    <div
                        ref="greenRef"
                        class="box w-20 h-20 mb-20 bg-gradient-to-r from-green-500 to-green-500-300 green rounded-lg"
                    ></div>
                    <div
                        ref="purpleRef"
                        class="box w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-300 purple rounded-lg"
                    ></div>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script setup>
/**
 * Import necessary dependencies
  使用自定义方式注册动效
 */
import { ref, onMounted } from "vue";
import gsap from "gsap";
const boxRef = ref(null);
const boxRef2 = ref(null);
const boxRef3 = ref(null);
const canvasRef = ref(null);
const greenRef = ref(null);
const purpleRef = ref(null);
const ctx =  ref(null);
const postions = ref({
    x:0,
    y:0
})
const initCanvas = () => {
    ctx.value = canvasRef.value.getContext('2d');
    ctx.value.fillStyle = "pink";
    ctx.value.fillRect(10, 10, 100, 100);
    // 根据时间位置线性变化
    gsap.to(postions.value, {
        x: 200,
        y: 200,
        duration: 4,
        ease: "power2.inOut",
        onUpdate: draw,
        yoyo:true,
        repeat:-1
    });
};
const draw = () => {
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.value.fillRect(postions.value.x, postions.value.y, 100, 100);
}
onMounted(() => {
    gsap.to(boxRef.value, {
        x: -200,
        rotation: 360,
        duration: 2,
        yPercent: 100,
        backgroundColor: '#8d3dae',
        backgroundImage: 'none'
    });
    gsap.to(boxRef2.value, { x: 100 });
    gsap.to(boxRef3.value, { x: 200 });
    initCanvas();
    gsap.to(greenRef.value,{
        rotation: 360,
        duration: 1,
        repeat: -1,
        repeatDelay: 1,
        x:200,
        yoyo:true
    })
    gsap.to(purpleRef.value,{
        rotation: 360,
        duration: 1,
        delay: 5,
    })
});

</script>

<style scoped lang="scss">
#canvas {
  max-height: 500px;
  overflow: visible;
  border: solid 2px white;
}
</style>
