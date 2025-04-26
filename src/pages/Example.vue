<template>
    <div>
        <h3 class="title">下划线动画</h3>
        <span class="text-span"
            >告别漫长等待，迎接闪电速度。全新闪电充电宝
            X9000，只需20分钟，即可为您的设备充入80%电量。采用航天级石墨烯材料，轻薄设计携带无负担，却蕴含10000mAh超大容量。
            三重安全保护系统，智能温控技术，为您的爱机筑起安全屏障。支持多设备同时充电，USB-C与无线充电双模兼容，满足您所有的充电需求。
            现在购买还享受两年质保服务，首批订购更可获赠精美便携袋一个。为您的数字生活充电，就选闪电X9000。</span
        >
        <h3 class="title">文字镂空</h3>
        <div class="image-content">
            <div class="image-mask">
                <h2>AMSTERDAM</h2>
            </div>
        </div>
        <CardRoute />
        <ImageClip />
    </div>
</template>

<script setup lang="ts">
import CardRoute from "@/components/CardRoute.vue";
import ImageClip from "@/components/ImageClip.vue";
</script>

<style scoped lang="scss">
.title {
    margin: 1em 0;
}

/* Add your CSS styles here */
.text-span {
    background: linear-gradient(to right, #ff6600, #ffcc00) no-repeat;
    background-size: 0 2px;
    background-position: right bottom;
    transition: background-size 2s;
    &:hover {
        background-position: left bottom;
        background-size: 100% 2px;
    }
}

.image-content {
    width: 100%;
    height: 300px;
    background-image: url("https://picsum.photos/1920/300");
    background-size: cover;
    background-position: center;
    position: relative;
    .image-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        h2 {
            background-image: url("https://picsum.photos/1920/300");
            background-clip: text;
            font-size: 8vw;
            color: transparent;
            text-align: center;
            line-height: 300px;
            -webkit-text-stroke: 1px #fff;
        }
    }
}
</style>
