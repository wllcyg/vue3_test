<template>
  <div>
    <h3>音频可视化</h3>
    <div>
      <audio :src="audio" controls ref="audioElement"></audio>
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import audio from '@/assets/files/audio.mp3'
import { ref, onMounted, onUnmounted } from 'vue'

const audioElement = ref<HTMLAudioElement>()
const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>()
const isInit = ref(false)
const dataArray = ref<Uint8Array>()
const analyser = ref<AnalyserNode>()
const isPlaying = ref(false)
const animationFrameId = ref<number>()
const fadeOutFactor = ref(1) // 淡出系数，1为完全显示，0为完全消失
const lastData = ref<Uint8Array>() // 存储最后一帧的数据，用于淡出效果

function clearCanvas() {
  if (!canvas.value || !ctx.value) return
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

function drawBars(data: Uint8Array, opacity: number = 1) {
  if (!canvas.value || !ctx.value) return

  const width = canvas.value.width
  const height = canvas.value.height

  const dataLength = data.length / 2.5
  const barWidth = width / dataLength / 2

  // 设置透明度
  ctx.value.fillStyle = `rgba(120, 197, 231, ${opacity})`

  for (let i = 0; i < dataLength; i++) {
    const value = data[i]
    const barHeight = (value / 255) * height * fadeOutFactor.value
    const x1 = i * barWidth + width / 2
    const x2 = width / 2 - (i + 1) * barWidth
    const y = height - barHeight
    ctx.value.fillRect(x1, y, barWidth - 2, barHeight)
    ctx.value.fillRect(x2, y, barWidth - 2, barHeight)
  }
}

function draw() {
  animationFrameId.value = requestAnimationFrame(draw)

  const width = canvas.value?.width || 0
  const height = canvas.value?.height || 0
  if (!ctx.value) return

  ctx.value.clearRect(0, 0, width, height)

  if (!isInit.value) return

  if (isPlaying.value && analyser.value && dataArray.value) {
    // 正在播放时获取实时数据
    analyser.value.getByteTimeDomainData(dataArray.value)
    // 存储当前数据用于淡出效果
    if (!lastData.value) {
      lastData.value = new Uint8Array(dataArray.value.length)
    }
    lastData.value.set(dataArray.value)
    fadeOutFactor.value = 1 // 重置淡出因子
    drawBars(dataArray.value)
  } else if (lastData.value) {
    // 已暂停，执行淡出效果
    fadeOutFactor.value *= 0.95 // 每帧减少5%
    drawBars(lastData.value, fadeOutFactor.value)

    // 当淡出因子足够小时停止动画
    if (fadeOutFactor.value < 0.01) {
      cancelAnimationFrame(animationFrameId.value as number)
      animationFrameId.value = undefined
      clearCanvas()
    }
  }
}

function initCanvas() {
  if (!canvas.value) return
  ctx.value = canvas.value.getContext('2d')
  canvas.value.width = window.innerWidth * devicePixelRatio
  canvas.value.height = (window.innerHeight / 2) * devicePixelRatio
  clearCanvas()
}

function handlePlay() {
  isPlaying.value = true

  if (!isInit.value && audioElement.value) {
    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaElementSource(audioElement.value)
    analyser.value = audioCtx.createAnalyser()
    analyser.value.fftSize = 512
    dataArray.value = new Uint8Array(analyser.value.frequencyBinCount)
    source.connect(analyser.value)
    analyser.value.connect(audioCtx.destination)
    isInit.value = true
  }

  if (!animationFrameId.value) {
    draw()
  }
}

function handlePause() {
  isPlaying.value = false
  // 不立即清除画布，让淡出效果处理
}

function handleResize() {
  initCanvas()
}

onMounted(() => {
  initCanvas()

  if (audioElement.value) {
    audioElement.value.addEventListener('play', handlePlay)
    audioElement.value.addEventListener('pause', handlePause)
    audioElement.value.addEventListener('ended', handlePause)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.removeEventListener('play', handlePlay)
    audioElement.value.removeEventListener('pause', handlePause)
    audioElement.value.removeEventListener('ended', handlePause)
  }

  window.removeEventListener('resize', handleResize)

  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<style scoped lang="scss">
canvas {
  background: #ccc;
  width: 100%;
  height: 50vh;
}
</style>