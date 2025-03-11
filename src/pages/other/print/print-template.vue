<template>
    <view class="container">
        <html2canvas ref="html2canvasRef" :dom-id="domId" @render-finish="handleRenderFinished">
            <view class="container__border">
                <table class="container__table" :border="2">
                    <tr class="table__tr">
                        <td class="table__td" width="25%">样品名称</td>
                        <td class="table__td" colspan="4" width="45%">
                            {{ printDate.sampleName }}
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
                            {{ printDate.sampleNum }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">检测编号</td>
                        <td class="table__td" colspan="4">
                            {{ printDate.checkNum }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">项目</td>
                        <td class="table__td" colspan="2">
                            {{ printDate.itemName }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">特殊情况</td>
                        <td class="table__td" colspan="2">
                            {{ printDate.specialSituation }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">送样时间</td>
                        <td class="table__td">
                            {{ printDate.sendSampleTime }}
                        </td>
                    </tr>
                    <tr class="table__tr">
                        <td class="table__td">送样人</td>
                        <td class="table__td">
                            {{ printDate.sendSampleOperator }}
                        </td>
                    </tr>
                </table>
            </view>
        </html2canvas>

        <view class="container__btn">
            <u-button type="primary" :disabled="btnStatus" @click="handleBTPrint"> 蓝牙打印 </u-button>
        </view>

        <u-toast ref="uToastRef" />
    </view>
</template>

<script lang="ts" setup>
import UQRCode from 'uqrcodejs';
import html2canvas from '@/components/html2canvas/html2canvas.vue';
import plugintest from '@/utils/print-plugin.js';
import { onMounted, ref } from 'vue';
import { showToast } from '../../../utils/uni-message';

export interface PrintDate {
    sampleName?: string;
    sampleNum?: string;
    checkNum?: string;
    itemName?: string;
    specialSituation?: string;
    sendSampleTime?: string;
    sendSampleOperator?: string;
    qrcode?: string;
}

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        printDate: PrintDate;
    }>(),
    {
        printDate: undefined,
    },
);

/**
 * 按钮状态
 */
const btnStatus = ref<boolean>(false);

/**
 * domId
 */
const domId = ref<string>('');

/**
 * imageData
 */
const imageData = ref<string>('');

/**
 * html2canvas 实例
 */
const html2canvasRef = ref();

/**
 * 提示组件实例
 */
const uToastRef = ref();

/**
 * 渲染二维码
 */
function generateQRCode() {
    // 获取 uQRCode 实例
    const qr = new UQRCode();

    // 设置二维码内容
    // qr.data = 'https://uqrcode.cn/doc';
    qr.data = props.printDate.qrcode;

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
    btnStatus.value = true;

    const printerData = {
        bluetoothName: '',
        bluetoothMac: '',
        data: '',
    };

    printerData.bluetoothName = uni.getStorageSync('BTPrintName');
    printerData.bluetoothMac = uni.getStorageSync('BTPrintMAC');
    printerData.data = imageData.value;

    uni.showLoading({
        title: '打印中....',
    });

    // #ifdef APP-PLUS
    plugintest.AddPrintFunction(
        printerData,
        (result: any) => {
            // 3、打印机异常
            if (JSON.stringify(result) === '["3"]') {
                uToastRef.value.show({
                    title: '打印机异常或未连接，请重新连接！',
                    type: 'warning',
                    icon: false,
                });
            } else if (JSON.stringify(result) === '["5"]') {
                uToastRef.value.show({
                    title: '打印成功！',
                    type: 'success',
                    icon: false,
                });
            } else if (JSON.stringify(result) === '["1"]') {
                uToastRef.value.show({
                    title: '蓝牙重新连接成功, 请再次点击蓝牙打印！',
                    type: 'success',
                    icon: false,
                });
            }

            uni.hideLoading();
            btnStatus.value = false;
        },
        (result: any) => {
            uni.hideLoading();
            btnStatus.value = false;

            // 3、打印机异常
            if (JSON.stringify(result) === '["3"]') {
                uToastRef.value.show({
                    title: '打印机异常，蓝牙连接失败，请重新连接！',
                    type: 'warning',
                    icon: false,
                });
            }
        },
    );
    // #endif

    // #ifdef H5
    btnStatus.value = false;

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
