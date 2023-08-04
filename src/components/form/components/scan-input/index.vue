<template>
    <view class="component-height">
        <u-input
            v-model="inputValue"
            :focus="focusStatus"
            border="surround"
            v-bind="schema?.attributes"
            @clear="handleClear"
            @confirm="handleConfirm"
        >
            <template #suffix>
                <u-icon name="scan" size="50rpx" @click="handlePhotoScan"></u-icon>
            </template>
        </u-input>
    </view>
</template>

<script lang="ts">
export default {
    name: 'ScanInput',
};
</script>

<script setup lang="ts">
import useIndex from './useIndex';
import useScan from './useScan';
import type { Schema } from '../../interface';

const props = withDefaults(
    defineProps<{
        schema: Schema;
    }>(),
    {
        schema: () => {
            return {
                prop: '',
                label: '',
                type: 'ScanInput',
            };
        },
    },
);

/**
 * handleEmit 双向绑定回调
 * handleScanSuccess 扫码成功回调，返回一个对象，对象的属性value为请求成功后的参数，formItem为当前表单项的配置
 * handleScanFail 扫码失败后的回调
 */
const emit = defineEmits<{
    (e: 'handleEmit', val: string | number): void;
    (e: 'handleScanSuccess', val: object | Array<object>): void;
    (e: 'handleScanFail', val: object | Array<object>): void;
}>();

/**
 * useIndex
 */
const { inputValue, focusStatus, handleClear, handleConfirm, handlePDAScan, handlePhotoScan } = useIndex(props, emit);

/**
 * useScan
 */
useScan(handlePDAScan);

/**
 * 暴露的属性与方法
 */
defineExpose({
    setData(val: string | number) {
        inputValue.value = val;
    },
});
</script>
