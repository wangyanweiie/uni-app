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
                @click="handleConnectServiceMAC(device)"
            >
                <text>{{ device.bluetoothName }}</text>
            </view>
        </view>
    </u-modal>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import usePrint from './use-print';

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        printData: Record<string, unknown>[];
    }>(),
    {
        modelValue: false,
        printData: () => {
            return [];
        },
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

/**
 * 是否显示
 */
const show = ref<boolean>(false);

/**
 * 打印相关方法
 */
const { handleSavePrintServiceMAC, devices, handleConnectServiceMAC, handlePrintServiceMAC, activeClass } = usePrint();

/**
 * 确认打印
 */
async function confirmPrint(): Promise<void> {
    const res = await handlePrintServiceMAC(props.printData);

    if (!res) {
        return;
    }

    show.value = false;

    emits('update:modelValue', false);
}

/**
 * 取消打印
 */
async function cancelPrint(): Promise<void> {
    show.value = false;

    emits('update:modelValue', false);
}

/**
 * 监听
 */
watch(
    () => props.modelValue,
    (value: boolean) => {
        show.value = value;
    },
);

watchEffect(() => {
    if (show.value === true) {
        handleSavePrintServiceMAC();
    }
});
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
    color: $u-main-color;

    &--active {
        color: $u-primary;
    }
}
</style>
