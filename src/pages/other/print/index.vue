<template>
    <view class="view-wrap">
        <print-template :data-source="dataSource"></print-template>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PrintTemplate from './print-template.vue';

interface DataSource {
    sampleName?: string;
    sampleNum?: string;
    checkNum?: string;
    itemName?: string;
    specialSituation?: string;
    sendSampleTime?: string;
    sendSampleOperator?: string;
    qrcode?: string;
}

const dataSource = ref<DataSource>({
    sampleName: 'YP-2025031101',
    sampleNum: 'YP-2025031101',
    checkNum: 'JC-2025031101',
    itemName: '项目1',
    specialSituation: '加急',
    sendSampleTime: '2025/03/11',
    sendSampleOperator: 'wyw',
    qrcode: 'YP-2025031101/JC-2025031101',
});
</script>

<style lang="scss" scoped></style>
