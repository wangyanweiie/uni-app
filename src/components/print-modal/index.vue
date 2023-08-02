<template>
    <uni-popup ref="popupRef" type="dialog">
        <uni-popup-dialog
            title="附近可用蓝牙列表"
            cancel-text="取消搜索"
            confirm-text="确认"
            :before-close="true"
            @confirm="confirmPrint"
            @close="cancelPrint"
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
        </uni-popup-dialog>
    </uni-popup>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { usePrint, Brand, PrinterLanguage } from './use-print';
import { Buffer } from 'buffer';
import { getStorage } from '@/utils/uni-storage';

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
    }
);

/**
 * emits
 */
const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

/**
 * 弹窗实例
 */
const popupRef = ref();

/**
 * 更新弹窗状态
 */
watch(
    () => props.modelValue,
    (value: boolean) => {
        if (value) {
            popupRef.value.open();
        } else {
            popupRef.value.close();
        }
    }
);

/**
 * 监听一次
 */
watchEffect(() => {
    if (props.modelValue === true) {
        // 开启搜索蓝牙
        startBluetoothSearch();
    }
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

    popupRef.value.close();
    emits('update:modelValue', false);
}

/**
 * 取消打印
 */
async function cancelPrint(): Promise<void> {
    // 停止蓝牙搜索
    await stopBluetoothSearch();

    // 关闭蓝牙
    closeBluetooth();

    popupRef.value.close();
    emits('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.bluetooth-list {
    height: 600rpx;
    width: 100%;
    overflow-y: scroll;
}

.bluetooth-item {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    color: #222;

    &--active {
        color: rgb(11, 43, 230);
    }
}
</style>
