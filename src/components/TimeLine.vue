<template>
  <div class="example-component">
    <h3 class="title">TimeLineControl</h3>
    <v-card>
      <div class='p-6'>
        <div ref="boxWrapperRef" class='flex flex-col gap-6 box-wrapper'>
          <div
            v-for="(color, index) in colorsBox"
            :key="index"
            :ref="el => { if(el) boxRefs[index] = el }"
            :style="{ backgroundColor: `#${color}` }"
            class='tboxv w-10 h-10 rounded-lg'
          ></div>
        </div>
        <v-btn class='mt-6' @click="play">play</v-btn>
        <div class="timelineUI">
          <div class="timelineUI-time" id="sequenceTime">{{ sequenceTimeValue }}</div>
          <div class="timelineUI-dragger-track">
            <div class="timelineUI-dragger" ref="dragRef">
              <div></div>
            </div>
          </div>
          <div class="markers"></div>

          <!-- 保持原始的DOM结构，不使用v-for -->
          <div class="timleineUI-row">
            <div class="timelineUI-tween bg-[#0ae448]"></div>
          </div>
          <div class="timleineUI-row">
            <div class="timelineUI-tween bg-[#9d95ff]"></div>
          </div>
          <div class="timleineUI-row">
            <div class="timelineUI-tween bg-[#ff8709]"></div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

// 响应式状态
const colorsBox = ['0ae448','9d95ff','ff8709'];
const boxRefs = reactive([]);
const boxWrapperRef = ref(null);
const dragRef = ref(null);
const sequenceTrackLength = ref(0);
const sequenceTimeValue = ref(0);
const wrapperWidth = ref(0); // 保持原样，作为ref

// GSAP Timeline
const timeLine = gsap.timeline({
  paused: true,
  onUpdate: sequenceUpdateDragger
});

// 初始化动画
const initAnimate = () => {
  // 使用与原代码相同的方式获取宽度
  const width = document.querySelector('.box-wrapper').offsetWidth;
  wrapperWidth.value = width;
  sequenceTrackLength.value = width;

  // 完全按照原始逻辑设置动画
  boxRefs.forEach((ref, index) => {
    const duration = index === 0 ? 2 : 1;
    let position;
    if (index === 0) {
      position = 1; // 第一个元素从0开始
    } else if (index === 1) {
      position = "<"; // 第二个元素与前一个同时开始
    } else {
      position = "+=1"; // 第三个元素在前一个结束后1秒开始
    }
    timeLine.to(ref, { x: wrapperWidth.value, xPercent: -100, duration,  }, position);
  });

  gsap.to('.timelineUI-tween', { opacity: 1 });

  const time = timeLine.duration();
  const children = timeLine.getChildren();

  // 使用原始逻辑设置拖动
  new Draggable(dragRef.value, {
    type: "x",
    bounds: { minX: 0, maxX: sequenceTrackLength.value },
    trigger: ".timelineUI-dragger div",
    onDrag: function() {
      timeLine.progress(this.x / sequenceTrackLength.value).pause();
    }
  });

  // 使用原始逻辑设置时间轴UI
  let timelineItems = document.querySelectorAll(".timelineUI-tween");
  children.forEach((child, index) => {
    let timelineBar = timelineItems[index];
    let duration = child.duration();
    let startTime = child.startTime();
    let width = (duration / time) * 100;
    let startPosition = (startTime / time) * 100;
    let color = colorsBox[index];
    gsap.set(timelineBar, {
      width: `${width}%`,
      marginLeft: `${startPosition}%`,
      backgroundColor: `#${color}`
    });
  });
};

// 更新拖动条位置
function sequenceUpdateDragger() {
  gsap.set(dragRef.value, {
    x: sequenceTrackLength.value * timeLine.progress()
  });
  sequenceTimeValue.value = timeLine.time().toFixed(2);
}

// 保持原始播放逻辑
const play = () => {
  if (timeLine.progress() < 1) {
    timeLine.play();
  } else {
    timeLine.restart();
  }
};

// 生命周期钩子
onMounted(() => {
  initAnimate();
});
</script>

<style scoped lang="scss">
/* CSS保持不变 */
.timleineUI-row {
  border: 1px solid #2f2f2f;
  margin: 2px 0;
  padding: 4px 0;
}
.timelineUI-tween {
  position: relative;
  width: 20%;
  height: 16px;
  border-radius: 8px;
}

.timelineUI-tween.green {
  width: 40%;
}

.timelineUI-dragger-track {
  position: relative;
  width: 100%;
  margin-top: 20px;
}

.timelineUI-dragger {
  position: absolute;
  width: 10px;
  height: 100px;
  top: -25px;
}

.timelineUI-dragger div {
  position: relative;
  width: 20px;
  height: 20px;
  background-color:#ccc;
  left: -10px;
  border-radius: 99px;
}

.timelineUI-dragger div::after {
  content: " ";
  position: absolute;
  width: 1px;
  height: 95px;
  top: 100%;
  left: calc(50% - 1px);
  border-left: solid 2px #ccc;
}

.timelineUI-dragger div::before {
  content: " ";
  position: absolute;
  width: 20px;
  height: 114px;
  top: -20px;
  left: -10px;
}

.timelineUI-time {
  position: relative;
  font-size: 30px;
  text-align: center;
}

.controls {
  margin: 10px 2px;
}

.prettyprint {
  font-size: 20px;
  line-height: 24px;
}

.timelineUI-button {
  background: transparent;
  border-radius: 99px;
  border: solid 2px #fffce1;
  color: #fffce1;
  text-decoration: none;
  margin: 0.5rem auto;
  font-family: "Signika Negative", sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  display: table;
  cursor: pointer;
  font-size: 13px;
  line-height: 18px;
  outline: none;
  display: inline-block;
  padding: 8px 14px;
}

.timelineUI-button:hover {
  background: #fffce1;
  text-decoration: none;
  color: #42433d
}
</style>
