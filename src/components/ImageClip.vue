<template>
    <div>
        <h3 class="title">图片裁剪</h3>
        <div class="controls">
            <v-file-input label="上传图片" @update:model-value="handleFileUpload"></v-file-input>
            
            <div class="aspect-ratio-controls">
                <span>裁剪比例：</span>
                <v-btn-group>
                    <v-btn @click="setAspectRatio('free')" :color="aspectRatio === 'free' ? 'primary' : ''">自由</v-btn>
                    <v-btn @click="setAspectRatio('1:1')" :color="aspectRatio === '1:1' ? 'primary' : ''">1:1</v-btn>
                    <v-btn @click="setAspectRatio('4:3')" :color="aspectRatio === '4:3' ? 'primary' : ''">4:3</v-btn>
                    <v-btn @click="setAspectRatio('16:9')" :color="aspectRatio === '16:9' ? 'primary' : ''">16:9</v-btn>
                </v-btn-group>
            </div>
            
            <div class="action-buttons">
                <v-btn @click="resetImage" :disabled="!imageLoaded">重置</v-btn>
                <v-btn @click="rotateImage" :disabled="!imageLoaded">旋转</v-btn>
                <v-btn @click="handleDownload" :disabled="!imageLoaded" color="primary">下载截图</v-btn>
            </div>
        </div>
        
        <div class="preview-img">
            <div class="options" ref="previewContainer" @wheel.prevent="handleZoom">
                <!-- 图片容器，可拖动和缩放 -->
                <div 
                    class="image-container" 
                    ref="imageContainer"
                    :style="{
                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) rotate(${imageRotation}deg) scale(${imageScale})`,
                        transformOrigin: 'center'
                    }"
                    @mousedown="startImageDrag"
                >
                    <img ref="previewRef" alt="" @load="handleImageLoad">
                </div>
                
                <!-- 裁剪框，固定位置 -->
                <div 
                    class="crop-mask"
                    :style="{
                        left: cropPosition.x + 'px',
                        top: cropPosition.y + 'px',
                        width: cropSize.width + 'px',
                        height: cropSize.height + 'px'
                    }"
                    @mousedown="startDrag"
                >
                    <!-- 四个角的拖拽点 -->
                    <div class="resize-handle tl" @mousedown.stop="startResize('tl')"></div>
                    <div class="resize-handle tr" @mousedown.stop="startResize('tr')"></div>
                    <div class="resize-handle bl" @mousedown.stop="startResize('bl')"></div>
                    <div class="resize-handle br" @mousedown.stop="startResize('br')"></div>
                    <!-- 四条边的拖拽点 -->
                    <div class="resize-handle t" @mousedown.stop="startResize('t')"></div>
                    <div class="resize-handle r" @mousedown.stop="startResize('r')"></div>
                    <div class="resize-handle b" @mousedown.stop="startResize('b')"></div>
                    <div class="resize-handle l" @mousedown.stop="startResize('l')"></div>
                </div>
                
                <!-- 缩放控制器 -->
                <div class="zoom-controls">
                    <v-btn icon @click="changeZoom(-0.1)" :disabled="!imageLoaded">
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span>{{ Math.round(imageScale * 100) }}%</span>
                    <v-btn icon @click="changeZoom(0.1)" :disabled="!imageLoaded">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="avatar">
                <canvas ref="canvasRef"></canvas>
                <div class="canvas-info">{{ canvasConfig.width }} × {{ canvasConfig.height }}</div>
                
                <!-- 输出尺寸控制 -->
                <div class="output-size-control">
                    <div class="size-input">
                        <label>宽度：</label>
                        <v-text-field
                            v-model.number="canvasConfig.width"
                            type="number"
                            min="50"
                            max="1000"
                            @input="updateCanvasSize"
                            dense
                        ></v-text-field>
                    </div>
                    <div class="size-input">
                        <label>高度：</label>
                        <v-text-field
                            v-model.number="canvasConfig.height"
                            type="number"
                            min="50"
                            max="1000"
                            @input="updateCanvasSize"
                            dense
                        ></v-text-field>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, watch, onMounted, nextTick } from 'vue'
    
    // 基础引用和状态
    const previewRef = ref(null)
    const previewContainer = ref(null)
    const imageContainer = ref(null)
    const imageLoaded = ref(false)
    const aspectRatio = ref('free')
    
    // 图片相关状态
    const imagePosition = reactive({
        x: 0,
        y: 0
    })
    const originalImagePosition = reactive({
        x: 0,
        y: 0
    })
    const imageScale = ref(1)
    const imageRotation = ref(0)
    
    // 裁剪框位置和大小
    const cropPosition = reactive({
        x: 100,
        y: 100
    })
    const cropSize = reactive({
        width: 200,
        height: 200
    })
    const originalCropSize = reactive({
        width: 200,
        height: 200
    })
    
    // 图片信息
    const imageInfo = reactive({
        originalWidth: 0,
        originalHeight: 0,
        displayWidth: 0,
        displayHeight: 0,
        scale: 1
    })
    
    // Canvas配置
    const canvasRef = ref(null)
    const ctx = ref(null)
    const canvasConfig = reactive({
        width: 200,
        height: 200
    })
    
    // 防抖函数
    function debounce(fn, delay) {
        let timer = null
        return function(...args) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }
    
    // 初始化
    onMounted(() => {
        initCanvas()
        // 添加键盘事件支持
        window.addEventListener('keydown', handleKeyDown)
    })
    
    function initCanvas() {
        const canvas = canvasRef.value
        ctx.value = canvas.getContext('2d')
        updateCanvasSize()
    }
    
    function updateCanvasSize() {
        if (!canvasRef.value || !ctx.value) return
        
        // 限制输入范围
        canvasConfig.width = Math.max(50, Math.min(1000, canvasConfig.width))
        canvasConfig.height = Math.max(50, Math.min(1000, canvasConfig.height))
        
        canvasRef.value.width = canvasConfig.width
        canvasRef.value.height = canvasConfig.height
        
        // 如果图片已加载，重新绘制
        if (imageLoaded.value) {
            drawCroppedImage()
        }
    }
    
    // 监听裁剪框、图片位置和缩放变化
    const updateCroppedImage = debounce(() => {
        if (imageLoaded.value) {
            drawCroppedImage()
        }
    }, 100)
    
    watch([cropPosition, cropSize, imagePosition, imageScale, imageRotation], updateCroppedImage, { deep: true })
    
    // 处理图片加载
    function handleImageLoad() {
        const img = previewRef.value
        const container = previewContainer.value
        
        // 保存原始图片尺寸
        imageInfo.originalWidth = img.naturalWidth
        imageInfo.originalHeight = img.naturalHeight
        
        // 计算图片显示尺寸，适应容器但保持宽高比
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const imgRatio = imageInfo.originalWidth / imageInfo.originalHeight
        const containerRatio = containerWidth / containerHeight
        
        if (imgRatio > containerRatio) {
            // 图片相对较宽，以容器宽度为基准
            imageInfo.displayWidth = containerWidth * 0.8
            imageInfo.displayHeight = containerWidth * 0.8 / imgRatio
        } else {
            // 图片相对较高，以容器高度为基准
            imageInfo.displayHeight = containerHeight * 0.8
            imageInfo.displayWidth = containerHeight * 0.8 * imgRatio
        }
        
        // 设置图片尺寸
        img.style.width = imageInfo.displayWidth + 'px'
        img.style.height = imageInfo.displayHeight + 'px'
        
        // 计算缩放比例（用于裁剪计算）
        imageInfo.scale = imageInfo.displayWidth / imageInfo.originalWidth
        
        // 初始化图片位置（居中）
        imagePosition.x = (containerWidth - imageInfo.displayWidth) / 2
        imagePosition.y = (containerHeight - imageInfo.displayHeight) / 2
        
        // 保存初始位置用于重置
        originalImagePosition.x = imagePosition.x
        originalImagePosition.y = imagePosition.y
        
        // 重置一些状态
        imageScale.value = 1
        imageRotation.value = 0
        
        // 居中裁剪框
        centerCropBox()
        
        imageLoaded.value = true
        nextTick(() => {
            drawCroppedImage()
        })
    }
    
    // 居中裁剪框
    function centerCropBox() {
        const container = previewContainer.value
        if (!container) return
        
        cropPosition.x = (container.clientWidth - cropSize.width) / 2
        cropPosition.y = (container.clientHeight - cropSize.height) / 2
        
        // 保存原始裁剪框尺寸用于重置
        originalCropSize.width = cropSize.width
        originalCropSize.height = cropSize.height
    }
    
    // 设置裁剪比例
    function setAspectRatio(ratio) {
        aspectRatio.value = ratio
        
        if (ratio === 'free') return
        
        // 获取比例值
        let ratioWidth = 1, ratioHeight = 1
        if (ratio === '1:1') {
            ratioWidth = ratioHeight = 1
        } else if (ratio === '4:3') {
            ratioWidth = 4
            ratioHeight = 3
        } else if (ratio === '16:9') {
            ratioWidth = 16
            ratioHeight = 9
        }
        
        // 根据当前高度计算新宽度
        const newWidth = cropSize.height * (ratioWidth / ratioHeight)
        
        // 如果新宽度过大，则根据宽度重新计算高度
        const container = previewContainer.value
        if (newWidth > container.clientWidth - 20) {
            cropSize.width = container.clientWidth - 20
            cropSize.height = cropSize.width * (ratioHeight / ratioWidth)
        } else {
            cropSize.width = newWidth
        }
        
        // 重新居中裁剪框
        centerCropBox()
    }
    
    // 处理文件上传
    function handleFileUpload(file) {
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
            previewRef.value.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
    
    // 绘制裁剪后的图片到画布
    function drawCroppedImage() {
        if (!imageLoaded.value || !ctx.value) return
        
        const img = previewRef.value
        const canvas = canvasRef.value
        
        // 清除画布
        ctx.value.clearRect(0, 0, canvas.width, canvas.height)
        
        // 获取裁剪框相对于旋转和缩放后的图片的位置
        const imgRect = imageContainer.value.getBoundingClientRect()
        const cropRect = document.querySelector('.crop-mask').getBoundingClientRect()
        
        // 创建临时画布以处理旋转和裁剪
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = imgRect.width
        tempCanvas.height = imgRect.height
        
        // 绘制旋转后的图片到临时画布
        tempCtx.save()
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
        tempCtx.rotate((imageRotation.value * Math.PI) / 180)
        tempCtx.scale(imageScale.value, imageScale.value)
        tempCtx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
        )
        tempCtx.restore()
        
        // 计算裁剪区域在临时画布上的位置
        const cropX = (cropRect.left - imgRect.left)
        const cropY = (cropRect.top - imgRect.top)
        
        // 绘制最终裁剪结果到输出画布
        try {
            ctx.value.drawImage(
                tempCanvas,
                cropX,
                cropY,
                cropRect.width,
                cropRect.height,
                0,
                0,
                canvas.width,
                canvas.height
            )
        } catch (error) {
            console.error('裁剪失败:', error)
        }
    }
    
    // 下载裁剪后的图片
    function handleDownload() {
        if (!imageLoaded.value) return
        
        const canvas = canvasRef.value
        const dataURL = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = dataURL
        link.download = 'cropped_image.png'
        link.click()
    }
    
    // 重置图片
    function resetImage() {
        if (!imageLoaded.value) return
        
        imagePosition.x = originalImagePosition.x
        imagePosition.y = originalImagePosition.y
        imageScale.value = 1
        imageRotation.value = 0
        
        cropSize.width = originalCropSize.width
        cropSize.height = originalCropSize.height
        centerCropBox()
    }
    
    // 旋转图片
    function rotateImage() {
        if (!imageLoaded.value) return
        imageRotation.value = (imageRotation.value + 90) % 360
    }
    
    // 缩放功能
    function handleZoom(e) {
        if (!imageLoaded.value) return
        
        const delta = -Math.sign(e.deltaY) * 0.1
        changeZoom(delta)
    }
    
    function changeZoom(delta) {
        const newScale = Math.max(0.1, Math.min(3, imageScale.value + delta))
        
        // 计算缩放中心点（相对于图片中心）
        const container = previewContainer.value
        const containerCenterX = container.clientWidth / 2
        const containerCenterY = container.clientHeight / 2
        
        // 更新缩放比例
        imageScale.value = newScale
    }
    
    // 键盘控制
    function handleKeyDown(e) {
        if (!imageLoaded.value) return
        
        const moveStep = 10
        
        switch (e.key) {
            case 'ArrowUp':
                imagePosition.y += moveStep
                e.preventDefault()
                break
            case 'ArrowDown':
                imagePosition.y -= moveStep
                e.preventDefault()
                break
            case 'ArrowLeft':
                imagePosition.x += moveStep
                e.preventDefault()
                break
            case 'ArrowRight':
                imagePosition.x -= moveStep
                e.preventDefault()
                break
        }
    }
    
    // 图片拖动相关变量和函数
    let isImageDragging = false
    let imageStartX = 0
    let imageStartY = 0
    
    function startImageDrag(e) {
        isImageDragging = true
        imageStartX = e.clientX - imagePosition.x
        imageStartY = e.clientY - imagePosition.y
        document.addEventListener('mousemove', handleImageDrag)
        document.addEventListener('mouseup', stopImageDrag)
    }
    
    const handleImageDrag = debounce((e) => {
        if (!isImageDragging) return
        
        imagePosition.x = e.clientX - imageStartX
        imagePosition.y = e.clientY - imageStartY
    }, 5)
    
    function stopImageDrag() {
        isImageDragging = false
        document.removeEventListener('mousemove', handleImageDrag)
        document.removeEventListener('mouseup', stopImageDrag)
    }
    
    // 裁剪框拖动相关变量和函数
    let isDragging = false
    let isResizing = false
    let resizeType = ''
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0
    
    function startDrag(e) {
        if (e.target.classList.contains('resize-handle')) return
        isDragging = true
        startX = e.clientX - cropPosition.x
        startY = e.clientY - cropPosition.y
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', stopDrag)
    }
    
    const handleDrag = debounce((e) => {
        if (!isDragging) return
        const container = previewContainer.value
        const containerRect = container.getBoundingClientRect()
        let newX = e.clientX - startX
        let newY = e.clientY - startY
        
        // 限制裁剪框在容器内
        newX = Math.max(0, Math.min(newX, containerRect.width - cropSize.width))
        newY = Math.max(0, Math.min(newY, containerRect.height - cropSize.height))
        
        cropPosition.x = newX
        cropPosition.y = newY
    }, 5)
    
    function stopDrag() {
        isDragging = false
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', stopDrag)
    }
    
    function startResize(type) {
        isResizing = true
        resizeType = type
        startX = cropPosition.x
        startY = cropPosition.y
        startWidth = cropSize.width
        startHeight = cropSize.height
        document.addEventListener('mousemove', handleResize)
        document.addEventListener('mouseup', stopResize)
    }
    
    const handleResize = debounce((e) => {
        if (!isResizing) return
        const container = previewContainer.value
        const containerRect = container.getBoundingClientRect()
        const minSize = 50 // 最小尺寸
        const deltaX = e.clientX - (containerRect.left + startX)
        const deltaY = e.clientY - (containerRect.top + startY)
        
        let newX = startX
        let newY = startY
        let newWidth = startWidth
        let newHeight = startHeight
        
        // 计算新宽度和高度，考虑宽高比
        const maintainRatio = aspectRatio.value !== 'free'
        let ratio = 1
        
        if (maintainRatio) {
            if (aspectRatio.value === '1:1') ratio = 1
            else if (aspectRatio.value === '4:3') ratio = 4/3
            else if (aspectRatio.value === '16:9') ratio = 16/9
        }
        
        switch (resizeType) {
            case 'tl': // 左上角
                newX = Math.min(startX + startWidth - minSize, startX + deltaX)
                newWidth = startWidth - (newX - startX)
                
                if (maintainRatio) {
                    newHeight = newWidth / ratio
                    newY = startY + startHeight - newHeight
                } else {
                    newY = Math.min(startY + startHeight - minSize, startY + deltaY)
                    newHeight = startHeight - (newY - startY)
                }
                break
                
            case 'tr': // 右上角
                newWidth = Math.max(minSize, deltaX)
                
                if (maintainRatio) {
                    newHeight = newWidth / ratio
                    newY = startY + startHeight - newHeight
                } else {
                    newY = Math.min(startY + startHeight - minSize, startY + deltaY)
                    newHeight = startHeight - (newY - startY)
                }
                break
                
            case 'bl': // 左下角
                newX = Math.min(startX + startWidth - minSize, startX + deltaX)
                newWidth = startWidth - (newX - startX)
                
                if (maintainRatio) {
                    newHeight = newWidth / ratio
                } else {
                    newHeight = Math.max(minSize, deltaY)
                }
                break
                
            case 'br': // 右下角
                newWidth = Math.max(minSize, deltaX)
                
                if (maintainRatio) {
                    newHeight = newWidth / ratio
                } else {
                    newHeight = Math.max(minSize, deltaY)
                }
                break
                
            case 't': // 上边
                newY = Math.min(startY + startHeight - minSize, startY + deltaY)
                newHeight = startHeight - (newY - startY)
                
                if (maintainRatio) {
                    newWidth = newHeight * ratio
                    // 居中调整宽度
                    newX = startX - (newWidth - startWidth) / 2
                }
                break
                
            case 'r': // 右边
                newWidth = Math.max(minSize, deltaX)
                
                if (maintainRatio) {
                    newHeight = newWidth / ratio
                    // 居中调整高度
                    newY = startY - (newHeight - startHeight) / 2
                }
                break
                
            case 'b': // 下边
                newHeight = Math.max(minSize, deltaY)
                
                if (maintainRatio) {
                    newWidth = newHeight * ratio
                    // 居中调整宽度
                    newX = startX - (newWidth - startWidth) / 2
                }
                break
                
            case 'l': // 左边
                newX = Math.min(startX + startWidth - minSize, startX + deltaX)
                newWidth = startWidth - (newX - startX)
                
                if (maintainRatio) {
                    newHeight = newWidth / ratio
                    // 居中调整高度
                    newY = startY - (newHeight - startHeight) / 2
                }
                break
        }
        
        // 限制边界
        newX = Math.max(0, Math.min(newX, containerRect.width - minSize))
        newY = Math.max(0, Math.min(newY, containerRect.height - minSize))
        newWidth = Math.min(newWidth, containerRect.width - newX)
        newHeight = Math.min(newHeight, containerRect.height - newY)
        
        // 确保最小尺寸
        newWidth = Math.max(minSize, newWidth)
        newHeight = Math.max(minSize, newHeight)
        
        // 更新位置和尺寸
        cropPosition.x = newX
        cropPosition.y = newY
        cropSize.width = newWidth
        cropSize.height = newHeight
    }, 5)
    
    function stopResize() {
        isResizing = false
        document.removeEventListener('mousemove', handleResize)
        document.removeEventListener('mouseup', stopResize)
    }
</script>

<style scoped lang="scss">
    .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 16px;
        
        .aspect-ratio-controls, .action-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }
    
    .preview-img {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 20px;
        gap: 20px;
        
        @media (max-width: 968px) {
            flex-direction: column;
            align-items: center;
        }
        
        .options {
            width: 400px;
            height: 400px;
            border: 1px solid #ccc;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            
            .image-container {
                position: absolute;
                cursor: move;
                
                img {
                    display: block;
                    /* 不再使用 object-fit，而是由JS控制尺寸 */
                }
            }
            
            .crop-mask {
                position: absolute;
                border: 2px solid #fff;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
                cursor: move;
                box-sizing: border-box;
                
                .resize-handle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: #fff;
                    border: 1px solid #666;
                    
                    &.tl { top: -5px; left: -5px; cursor: nw-resize; }
                    &.tr { top: -5px; right: -5px; cursor: ne-resize; }
                    &.bl { bottom: -5px; left: -5px; cursor: sw-resize; }
                    &.br { bottom: -5px; right: -5px; cursor: se-resize; }
                    
                    &.t { top: -5px; left: 50%; margin-left: -5px; cursor: n-resize; }
                    &.r { top: 50%; right: -5px; margin-top: -5px; cursor: e-resize; }
                    &.b { bottom: -5px; left: 50%; margin-left: -5px; cursor: s-resize; }
                    &.l { top: 50%; left: -5px; margin-top: -5px; cursor: w-resize; }
                }
            }
            
            .zoom-controls {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.6);
                padding: 4px 8px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: white;
                z-index: 10;
            }
        }
        
        .avatar {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            canvas {
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            
            .canvas-info {
                margin-top: 8px;
                color: #666;
                font-size: 14px;
            }
            
            .output-size-control {
                margin-top: 16px;
                display: flex;
                gap: 16px;
                
                .size-input {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            }
        }
    }
</style>