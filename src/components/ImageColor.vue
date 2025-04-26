<template>
    <div>
        <h3 class="title">图片处理</h3>
        <div class="item-box">
            <v-color-picker v-model="targetColor"></v-color-picker>
            <canvas ref="canvasRef"></canvas>
        </div>
    </div>
</template>

<script setup>
import imageSrc from '../assets/color.png';
import { onMounted, ref } from 'vue';
const targetColor = ref('#000000');
const canvasRef = ref(null);
const ctx = ref(null);
onMounted(() => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 400;
    canvas.height = 200;
    ctx.fillStyle = '#fff';
    ctx.fillStyle = '#000';
    const image = new Image();
    image.src = imageSrc
    image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    canvas.addEventListener('click', (e) => {
        const clickX = e.offsetX;
        const clickY = e.offsetY;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData)
        const canvasData = imageData.data;
        const tColor = hextoRgba(targetColor.value);
        const clickClor = getColor(clickX,clickY,canvasData);
        changeColor(clickX,clickY,canvasData,tColor,clickClor)
        ctx.putImageData(imageData, 0, 0);
    })
})
function pointToIndex(x, y) {
    return (x + y * canvasRef.value.width) * 4;
}
function changeColor(startX, startY, canvasData, targetColor, clickColor) {
    const queue = [[startX, startY]];
    const width = canvasRef.value.width;
    const height = canvasRef.value.height;
    
    // 创建一个访问集合来防止重复处理像素
    const visited = new Set();
    
    while (queue.length > 0) {
        const [x, y] = queue.shift();
        
        // 为每个像素坐标创建唯一键
        const pixelKey = `${x},${y}`;
        
        // 如果超出边界或已访问过，跳过
        if (x < 0 || y < 0 || x >= width || y >= height || visited.has(pixelKey)) {
            continue;
        }
        
        // 标记为已访问
        visited.add(pixelKey);
        
        const currentColor = getColor(x, y, canvasData);
        
        // 检查颜色相似度
        if (diffColor(clickColor, currentColor) > 50) {
            continue;   // 颜色差异太大
        }
        
        // 替换颜色（正确设置像素值的方式）
        const index = pointToIndex(x, y);
        canvasData[index] = targetColor[0];     // R
        canvasData[index + 1] = targetColor[1]; // G
        canvasData[index + 2] = targetColor[2]; // B
        canvasData[index + 3] = targetColor[3]; // A
        
        // 将相邻像素添加到队列
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
    }
}
function hextoRgba(hex) {
    let rgba = hex.replace('#', '').match(/../g);
    rgba = rgba.map(item => parseInt(item, 16));
    rgba.push(255);
    return rgba;
}
function getColor(x, y, canvasData) {
    const index = pointToIndex(x, y);
    return [
        canvasData[index],
        canvasData[index + 1],
        canvasData[index + 2],
        canvasData[index + 3]
    ];
}
function diffColor(color1,color2) {
    let diff = 0;
    for (let i = 0; i < 3; i++) {
        diff += Math.abs(color1[i] - color2[i]);
    }
    return diff;
}
</script>

<style lang="scss" scoped>
.item-box {
    display: flex;
    align-items: center;
    gap: 40px;
}
</style>