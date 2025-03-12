<template>
    <view class="container">
        <view class="template">
            <html2canvas ref="html2canvasRef" :dom-id="domId" @render-finish="handleRenderFinished">
                <view class="template-inner">
                    <table class="template-table" :border="1">
                        <tr>
                            <td class="template-table-td">样品名称</td>
                            <td class="template-table-td" colspan="4">
                                {{ data.sampleName }}
                            </td>
                            <td class="template-table-td" rowspan="7" colspan="2">
                                <view class="qrcode">
                                    <canvas id="qrcode" canvas-id="qrcode" style="width: 15mm; height: 15mm"></canvas>
                                </view>
                            </td>
                        </tr>
                        <tr>
                            <td class="template-table-td">样品编号</td>
                            <td class="template-table-td">
                                {{ data.sampleNum }}
                            </td>
                        </tr>
                        <tr>
                            <td class="template-table-td">检测编号</td>
                            <td class="template-table-td">
                                {{ data.checkNum }}
                            </td>
                        </tr>
                        <tr>
                            <td class="template-table-td">项目</td>
                            <td class="template-table-td">
                                {{ data.itemName }}
                            </td>
                        </tr>
                        <tr>
                            <td class="template-table-td">特殊情况</td>
                            <td class="template-table-td">
                                {{ data.specialSituation }}
                            </td>
                        </tr>
                        <tr>
                            <td class="template-table-td">送样时间</td>
                            <td class="template-table-td">
                                {{ data.sendSampleTime }}
                            </td>
                        </tr>
                        <tr>
                            <td class="template-table-td">送样人</td>
                            <td class="template-table-td">
                                {{ data.sendSampleOperator }}
                            </td>
                        </tr>
                    </table>
                </view>
            </html2canvas>
        </view>

        <view class="button">
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
    row: 20,
    col: 20,
    targetWeight: 660,
    targetHeight: 440,
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
    qr.size = 55;

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
    printData.value = Object.assign({}, printData.value, {
        data,
    });

    console.log('render-finished', printData.value);
}

/**
 * 蓝牙打印
 */
async function handleBTPrint() {
    showModal.value = true;

    // #ifdef APP-PLUS
    // showModal.value = true;
    // #endif

    // #ifdef H5
    // uni.showToast({
    //     title: '请在APP中使用蓝牙打印功能！',
    //     icon: 'none',
    // });
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
    width: 100%;
    height: calc(100vh - 55px);
    position: relative;
}

.template {
    width: 60mm;
    height: 40mm;
    text-align: center;
    font-size: 11px;
    // font-weight: bold;

    &-inner {
        width: 60mm;
        height: 40mm;
    }

    &-table {
        margin: 1mm;
        position: absolute;
        padding: 2mm;
        width: 58mm;
        height: 38mm;
        border-collapse: collapse;

        &-td {
            border: 1px solid #000;
        }

        .qrcode {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.button {
    position: absolute;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
