<template>
    <view class="view-wrap wrap">
        <u-button type="info" class="wrap__btn" @click="getImg">获取图片</u-button>

        <canvas class="wrap__canvas" :style="{ width: w + 'px', height: h + 'px' }" canvas-id="firstCanvas"></canvas>
        <image mode="aspectFill" :src="src" @click="preview"></image>
    </view>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import dayjs from 'dayjs';
import { UPLOAD_URL } from '@/constant/index';

/**
 * 画布宽度
 */
const w = ref<number>(200);

/**
 * 画布高度
 */
const h = ref<number>(200);

/**
 * 生成图片的路径
 */
const src = ref<string>('');

/**
 * 选择图片
 */
function getImg() {
    // 从本地相册选择图片或使用相机拍照
    uni.chooseImage({
        count: 1,
        sizeType: 'compressed',
        success: (res: any) => {
            src.value = '';
            setImg(res.tempFilePaths[0]);
        },
    });
}

/**
 * 生成图片
 */
function setImg(url: string) {
    // 创建 canvas 绘制上下文，参数（canvas-id, 组件实例）
    const ctx = uni.createCanvasContext('firstCanvas');

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

            // 获取当前时间
            const currentTime: string = dayjs().format('YYYY-MM-DD HH:mm:ss');

            nextTick(() => {
                // 更新画布宽高
                w.value = res.width / 2;
                h.value = res.height / 2;

                // 填充一个矩形
                ctx.fillRect(0, 0, w.value, h.value);

                // 绘制图像到画布，参数（图片资源路径, 图片左上角在目标 canvas 上 x 轴的位置, 图片左上角在目标 canvas 上 y 轴的位置, 绘制图像的宽度, 绘制图像的高度）
                ctx.drawImage(res.path, 0, 0, w.value, h.value);

                // 设置字体大小
                ctx.setFontSize(24);

                // 设置填充颜色
                ctx.setFillStyle('#ffffff');

                // 在画布上绘制被填充的文本，参数（文本, 文本左上角 x 坐标位置, 文本左上角 y 坐标位置）
                ctx.fillText(currentTime, w.value - 250, h.value - 30);

                // 不加异步首次渲染图片有问题
                setTimeout(() => {
                    // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中，参数（是否接着上一次绘制, 绘制完成后回调）
                    ctx.draw(false, () => {
                        // 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
                        uni.canvasToTempFilePath({
                            canvasId: 'firstCanvas',
                            destWidth: w.value,
                            destHeight: h.value,
                            fileType: 'png',
                            success: async res => {
                                // 保存生成的图片路径
                                src.value = res.tempFilePath;

                                // 调用上传接口
                                // await uploadFile(res.tempFilePath);
                            },
                            complete: () => {
                                uni.hideLoading();
                            },
                        });
                    });
                }, 500);
            });
        },
        fail: err => {
            console.log(err);
        },
    });
}

/**
 * 上传图片
 * @param url 图片路径
 */
// async function uploadFile(url: string) {
//     return new Promise(resolve => {
//         uni.uploadFile({
//             url: UPLOAD_URL,
//             filePath: url,
//             name: 'file',
//             // 用于让后端区分是 APP 上传还是 PC 上传
//             formData: {
//                 appSign: 'app',
//             },
//             success: res => {
//                 src.value = JSON.parse(res.data).data;
//                 resolve(JSON.parse(res.data).data);
//             },
//             fail: err => {
//                 console.log(err);
//                 resolve(false);
//             },
//         });
//     });
// }

/**
 * 预览图片
 */
function preview() {
    if (!src.value) {
        return;
    }

    uni.previewImage({
        urls: [src.value],
        current: 0,
    });
}
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    &__btn {
        margin-bottom: 20px;
    }

    &__canvas {
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
}
</style>
