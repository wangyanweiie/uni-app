<template>
    <view class="wrap">
        <canvas class="canvas" :style="{ width: w + 'px', height: h + 'px' }" canvas-id="firstCanvas"></canvas>
        <button class="button" @click="getImg">获取图片</button>
        <image mode="aspectFill" :src="src" @click="preview"></image>
    </view>
</template>

<script>
import dayjs from 'dayjs';

export default {
    data() {
        return {
            w: 200, // 画布宽度
            h: 200, // 画布高度
            src: '', // 生成图片的路径
        };
    },

    methods: {
        /**
         * 选择图片
         */
        getImg() {
            const that = this;

            // 从本地相册选择图片或使用相机拍照
            uni.chooseImage({
                count: 1,
                sizeType: 'compressed',
                success: res => {
                    that.setimg(res.tempFilePaths[0]);
                },
            });
        },

        /**
         * 生成图片
         */
        setimg(url) {
            const that = this;

            // 创建 canvas 绘制上下文，参数（canvas-id, 组件实例）
            const ctx = uni.createCanvasContext('firstCanvas', that);

            /**
             * 获取图片信息
             */
            uni.getImageInfo({
                src: url,
                success: res => {
                    uni.showLoading({
                        title: '水印添加中...',
                        mask: true,
                    });

                    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
                    const x = res.width / 2 - 270;
                    const y = res.height / 2 - 50;

                    this.$nextTick(() => {
                        that.w = res.width / 2;
                        that.h = res.height / 2;

                        // 填充一个矩形
                        ctx.fillRect(0, 0, that.w, that.h);

                        // 绘制图像到画布，参数（图片资源路径, 图片左上角在目标 canvas 上 x 轴的位置, 图片左上角在目标 canvas 上 y 轴的位置, 绘制图像的宽度, 绘制图像的高度）
                        ctx.drawImage(res.path, 0, 0, res.width / 2, res.height / 2);

                        // 设置字体大小
                        ctx.setFontSize(24);

                        // 设置填充颜色
                        ctx.setFillStyle('#ffffff');

                        // 在画布上绘制被填充的文本，参数（文本, 文本左上角 x 坐标位置, 文本左上角 y 坐标位置）
                        ctx.fillText(currentTime, x, y);

                        // 不加异步首次渲染图片有问题
                        setTimeout(() => {
                            // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中，参数（是否接着上一次绘制, 绘制完成后回调）
                            ctx.draw(false, () => {
                                // 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
                                uni.canvasToTempFilePath({
                                    canvasId: 'firstCanvas',
                                    success: res => {
                                        that.src = res.tempFilePath;
                                    },
                                    complete: () => {
                                        uni.hideLoading();
                                    },
                                });
                            });
                        }, 500);
                    });
                },
            });
        },

        /**
         * 预览图片
         */
        preview() {
            uni.previewImage({
                urls: [this.src],
                current: 0,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.canvas {
    border: 2rpx solid pink;
    background: pink;
    width: 100%;
    height: 100%;
    overflow: auto;

    /* 定位到页面之外隐藏 */
    position: absolute;
    top: -1000px;
    left: -1000px;
}

.button {
    margin: 10px;
}
</style>
