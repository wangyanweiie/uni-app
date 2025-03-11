<template>
    <view class="view-wrap">
        <print-template :print-date="printData"></print-template>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PrintTemplate, { PrintDate } from './print-template.vue';

const printData = ref<PrintDate>({
    sampleName: 'YP-2025031101',
    sampleNum: 'YP-2025031101',
    checkNum: 'JC-2025031101',
    itemName: '项目1',
    specialSituation: '加急',
    sendSampleTime: '2025/03/11',
    sendSampleOperator: '张三',
    qrcode: 'YP-2025031101/JC-2025031101',
});
</script>

<style lang="scss" scoped></style>
