<template>
    <div class="card-route">
        <h3 class="title">视差旋转</h3>
        <div class="body">
            <div class="content">
                <div class="content-item">
                    <img src="https://picsum.photos/800/800?random=1" />
                </div>
                <div class="content-item">
                    <img src="https://picsum.photos/800/800?random=2" />
                </div>
                <div class="content-item">
                    <img src="https://picsum.photos/800/800?random=3" />
                </div>
                <div class="content-item">
                    <img src="https://picsum.photos/800/800?random=4" />
                </div>
                <div class="content-item">
                    <img src="https://picsum.photos/800/800?random=5" />
                </div>
            </div>
        </div>
        <h3 class="title">网格动画</h3>
        <div class="grid-animation">
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
        </div>
    </div>
</template>
<script></script>
<style scoped lang="scss">
.card-route {
    margin: 2em 0;
    .body {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-template-areas:
            "a a b"
            "c d b"
            "c e e";
        gap: 10px;
        animation: spin 8s linear infinite;
        .content-item {
            overflow: hidden;
            border: 1px solid #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 260%;
                height: 260%;
                object-fit: cover;
                animation: spin 8s linear infinite reverse;
            }
        }
        .content-item:nth-child(1) {
            grid-area: a;
        }
        .content-item:nth-child(2) {
            grid-area: b;
        }
        .content-item:nth-child(3) {
            grid-area: c;
        }
        .content-item:nth-child(4) {
            grid-area: d;
        }
        .content-item:nth-child(5) {
            grid-area: e;
        }
    }

    /* 网格动画 */
    .grid-animation {
        width: 400px;
        height: 400px;
        margin: 0 auto;
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 10px;
        cursor: pointer;
        transition: all 0.5s;
        .grid-item {
            background-color: #eee;
        }
    }
    @for $i from 1 through 9 {
        .grid-item:nth-child(#{$i}) {
            background-color: hsl($i * 40, 85%, 70%);  // 使用更大的色相间隔，增加颜色差异
        }
    }
    .grid-animation {
        @for $i from 1 through 9 {
            $r: floor(($i - 1) / 3) + 1;
            $c: ($i - 1) % 3 + 1;

            &:has(.grid-item:nth-child(#{$i}):hover) {
                --row-template: #{if($r == 1, 2fr 1fr 1fr, if($r == 2, 1fr 2fr 1fr, 1fr 1fr 2fr))};
                --col-template: #{if($c == 1, 2fr 1fr 1fr, if($c == 2, 1fr 2fr 1fr, 1fr 1fr 2fr))};
                grid-template-rows: var(--row-template);
                grid-template-columns: var(--col-template);
            }
        }
    }
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
