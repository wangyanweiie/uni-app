<template>
    <view class="container">
        <html2canvas ref="html2canvasRef" :dom-id="domId" @render-finish="handleRenderFinished">
            <view class="container__border">
                <table class="container__table" :border="2">
                    <tr class="table__tr">
                        <td class="table__td" width="25%">样品名称</td>
                        <td class="table__td" colspan="4" width="45%">
                            {{ data.sampleName }}
                        </td>
                        <td class="table__td" rowspan="7" colspan="2" width="30%">
                            <canvas
                                id="qrcode"
                                canvas-id="qrcode"
                                style="width: 15mm; height: 15mm; margin-left: 1mm"
                            ></canvas>
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">样品编号</td>
                        <td class="table__td" colspan="4">
                            {{ data.sampleNum }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">检测编号</td>
                        <td class="table__td" colspan="4">
                            {{ data.checkNum }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">项目</td>
                        <td class="table__td" colspan="2">
                            {{ data.itemName }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">特殊情况</td>
                        <td class="table__td" colspan="2">
                            {{ data.specialSituation }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">送样时间</td>
                        <td class="table__td">
                            {{ data.sendSampleTime }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">送样人</td>
                        <td class="table__td">
                            {{ data.sendSampleOperator }}
                        </td>
                    </tr>
                </table>
            </view>
        </html2canvas>

        <view class="container__btn">
            <u-button type="primary" @click="handleBTPrint"> 蓝牙打印 </u-button>
        </view>

        <x-print-modal-bt v-model="showModal" :print-data="printData"></x-print-modal-bt>
    </view>
</template>

<script lang="ts" setup>
import UQRCode from 'uqrcodejs';
import html2canvas from '@/components/html2canvas/html2canvas.vue';
import { onMounted, ref } from 'vue';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
    }>(),
    {
        data: undefined,
    },
);

const printData = ref<Record<string, unknown>>({
    bluetoothName: '',
    bluetoothMac: '',
    data: '',
    row: 0,
    col: 0,
    targetWeight: 60,
    targetHeight: 40,
});

/**
 * domId
 */
const domId = ref<string>('');

/**
 * html2canvas 实例
 */
const html2canvasRef = ref();

/**
 * imageData
 */
const imageData = ref<string>('');

/**
 * 弹窗是否展示
 */
const showModal = ref<boolean>(false);

/**
 * 渲染二维码
 */
function generateQRCode() {
    // 获取 uQRCode 实例
    const qr = new UQRCode();

    // 设置二维码内容
    // qr.data = 'https://uqrcode.cn/doc';
    qr.data = props.data.qrcode;

    // 设置二维码大小，必须与canvas设置的宽高一致
    qr.size = 50;

    // 调用制作二维码方法
    qr.make();

    // 获取 canvas 上下文
    const canvasContext = uni.createCanvasContext('qrcode');

    // 设置 uQRCode 实例的 canvas 上下文
    qr.canvasContext = canvasContext;

    // 调用绘制方法将二维码图案绘制到 canvas 上
    qr.drawCanvas();

    // 生成打印标签
    handleGenerateImage();
}

/**
 * 生成打印图片
 */
function handleGenerateImage() {
    domId.value = '#print';
}

/**
 * 成功生成图片
 */
function handleRenderFinished(data: string) {
    console.log('renderFinish', data);

    imageData.value = data;
}

/**
 * 蓝牙打印
 */
async function handleBTPrint() {
    // #ifdef APP-PLUS
    printData.value.data = imageData.value;
    showModal.value = true;
    // #endif

    // #ifdef H5
    uni.showToast({
        title: '请在APP中使用蓝牙打印功能！',
        icon: 'none',
    });
    // #endif
}

/**
 * 页面渲染
 */
onMounted(() => {
    generateQRCode();
});
</script>

<style lang="scss">
.container {
    width: 100vw;
    height: calc(100vh - 55px);
    position: relative;
    text-align: center;
    font-weight: bold;
    font-size: 10px;
    overflow: scroll;

    &__border {
        width: 60mm;
        height: 40mm;
        border: 0px solid #393939;
        background-color: gainsboro;
    }

    &__table {
        margin: 1mm;
        position: absolute;
        padding: 2mm;
        width: 58mm;
        height: 38mm;
        border-collapse: collapse;

        &__td {
            border: 0px solid #000;
        }
    }

    &__btn {
        position: absolute;
        bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
