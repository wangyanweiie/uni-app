<template>
    <u-modal
        :show="show"
        title="附近可用蓝牙列表牙"
        show-cancel-button
        cancel-text="取消搜索"
        confirm-text="确认"
        close-on-click-overlay
        @confirm="confirmPrint"
        @cancel="cancelPrint"
    >
        <view class="bluetooth-list">
            <view
                v-for="(device, index) in devices"
                :key="index"
                class="bluetooth-item"
                :class="activeClass(device, 'bluetooth-item--active')"
                @click="connectBluetooth(device)"
            >
                <text>{{ device.name }}</text>
            </view>
        </view>
    </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { usePrint } from './use-print';
import { Buffer } from 'buffer';
import { getStorage } from '@/utils/uni-storage';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XPrintModal',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 打印弹窗是否展示 */
        modelValue: boolean;
        /** 打印数据 */
        printString: string | string[];
        /** 位图数据 */
        rowData?: Buffer;
    }>(),
    {
        modelValue: false,
        printString: '',
        rowData: () => Buffer.from([]),
    },
);

/**
 * emits
 */
const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

/**
 * 是否显示
 */
const show = computed<boolean>({
    get: () => props.modelValue,
    set: newValue => emits('update:modelValue', newValue),
});

/**
 * use print
 */
const { devices, startBluetoothSearch, connectBluetooth, stopBluetoothSearch, activeClass, print, closeBluetooth } =
    usePrint(getStorage('BrandAndLanguage'));

/**
 * 确认打印
 */
async function confirmPrint(): Promise<void> {
    const res = await print(props.printString, props.rowData);

    if (!res) {
        return;
    }

    // 关闭蓝牙
    closeBluetooth();

    show.value = false;
}

/**
 * 取消打印
 */
async function cancelPrint(): Promise<void> {
    // 停止蓝牙搜索
    await stopBluetoothSearch();

    // 关闭蓝牙
    closeBluetooth();

    show.value = false;
}

/**
 * 监听
 */
watchEffect(() => {
    if (props.modelValue === true) {
        // 开启搜索蓝牙
        startBluetoothSearch();
    }
});
</script>

<style lang="scss" scoped>
.bluetooth-list {
    height: 500rpx;
    width: 100%;
    font-size: 16px;
    overflow-y: scroll;
}

.bluetooth-item {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    color: $u-main-color;

    &--active {
        color: $u-primary;
    }
}
</style>
