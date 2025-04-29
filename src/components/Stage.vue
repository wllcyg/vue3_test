<template>
    <div class="example-component">
        <h3 class="title">Stage</h3>
        <v-card>
            <div class="flex gap-4 p-4 h-full">
                <div class="flex items-center gap-4 p-4 h-96">
                    <div
                        v-for="(color, index) in colors"
                        :key="index"
                        class="box1 w-20 h-20 rounded-lg cursor-pointer"
                        :class="color.class"
                        @click="animateBoxes"
                    ></div>
                </div>
                <div class='flex-1'>
                    <v-form >
                        <v-radio-group inline label="from" v-model="formValue.from">
                          <v-radio label="center" value="center"></v-radio>
                          <v-radio label="end" value="end"></v-radio>
                          <v-radio label="edges" value="edges"></v-radio>
                          <v-radio label="random" value="random"></v-radio>
                          <v-radio label="2" value="2"></v-radio>
                        </v-radio-group>
                        <v-radio-group inline label="axis" v-model="formValue.axis">
                          <v-radio label="null" value="null"></v-radio>
                          <v-radio label="x" value="x"></v-radio>
                          <v-radio label="y" value="y"></v-radio>
                        </v-radio-group>
                        <v-radio-group inline label="ease" v-model="formValue.ease">
                          <v-radio label="null" value="null"></v-radio>
                          <v-radio label="power3.inOut" value="power3.inOut"></v-radio>
                          <v-radio label="power2.in" value="power2.in"></v-radio>
                        </v-radio-group>
                    </v-form>
                </div>
                <div class='grid grid-cols-[repeat(13,minmax(0,1fr))] gap-4'>
                    <div
                        v-for="i in 65"
                        :key="i"
                        class="tlBox w-10 h-10 bg-[#aaecee] back rounded-lg cursor-pointer"
                        @click="shadeClick"
                    ></div>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive,watch } from "vue";
import gsap from "gsap";
const formValue = reactive({
    from: 'center',
    axis:'',
    ease:''
});
// 创建颜色数组便于管理
const colors = ref([
    { class: "bg-gradient-to-r from-green-400 to-green-300" },
    { class: "bg-gradient-to-r from-red-500 to-red-400" },
    { class: "bg-gradient-to-r from-pink-400 to-pink-300" },
    { class: "bg-gradient-to-r from-orange-400 to-orange-300" },
]);

// 动画是否正在进行中
const isAnimating = ref(false);

// 点击时执行的动画
const animateBoxes = () => {
    // 如果动画正在进行中，不执行新的动画
    if (isAnimating.value) return;

    // 设置动画状态为正在进行中
    isAnimating.value = true;

    console.log("box clicked");
    gsap.to(".box1", {
        duration: 0.5,
        opacity: 0,
        y: -100,
        stagger: 0.1,
        ease: "back.in",
        onComplete: () => {
            // 动画完成后回到原位
            gsap.to(".box1", {
                duration: 0.5,
                opacity: 1,
                y: 0,
                stagger: 0.1,
                ease: "back.out",
                onComplete: () => {
                    // 所有动画完成后重置状态，允许再次点击
                    isAnimating.value = false;
                }
            });
        }
    });
};


const grid = [5, 13];
const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const boxesAnimate = (from,axis,ease) => {
    tl.to('.tlBox',{
        duration: 1,
        scale:0.1,
        y:60,
        yoyo:true,
        repeat:-1,
        ease: "power1.inout",
        stagger:{
            amount:1.5,
            grid:grid,
            axis,
            ease,
            from
        }
    })
}
// 点击执行动画组
const shadeClick = (e) => {
    gsap.fromTo(e.target, {rotation: 0}, {rotation: 360, duration: 1})
}
const updateAnimation = () => {
     tl.seek(0).clear();
    let { from, axis, ease } = formValue;
    // 检查 from 是否可以转换为数字
    if (!isNaN(from) && from !== "null") {
        from = parseInt(from, 10); // 将字符串转换为数字
    }

    // 处理 axis 和 ease 为 "null" 的情况
    if (axis === "null") axis = null;
    if (ease === "null") ease = null;
    console.log('updateAnimation',from,axis,ease)
    boxesAnimate(from, axis, ease);
}
watch(formValue, (newValue) => {
    updateAnimation()
});
onMounted(() => {
    // 初始化动画
    gsap.from(".box1", {//
        duration: 1,
        rotation: 360,
        opacity: 0,
        delay: 0.5,
        stagger: 0.2,// 负值会让最后一个先运行
        ease: "sine.out",
        force3D: true
    });
    boxesAnimate('center')
    gsap.set(".tlBox", {rotation: 0.5, force3D: true});
});
</script>
