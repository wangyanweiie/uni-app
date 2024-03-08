<template>
    <u-form-item :id="$attrs.id ?? prop" :prop="prop" :label="label" :required="required">
        <u-input
            v-bind="uProps"
            v-model="code"
            :focus="scanFocus"
            :placeholder="placeholder"
            :clearable="clearable"
            @change="handleInputChange"
            @confirm="handleConfirm"
            @clear="handleClear"
            @focus="handleFocus"
            @blur="handleBlur"
        >
            <template #suffix>
                <u-icon name="scan" size="20px" @click="handleScanClick" />
            </template>
        </u-input>
        <template #right>
            <slot name="button"></slot>
        </template>
    </u-form-item>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { throttle } from 'lodash-es';
import { useScan } from './hooks/use-scan';

const props = withDefaults(
    defineProps<{
        modelValue: any;
        prop?: string;
        label: string;
        placeholder?: string;
        required?: boolean;
        focus?: boolean;
        clearable?: boolean;
        uProps?: Record<string, any>;
    }>(),
    {
        modelValue: undefined,
        prop: undefined,
        placeholder: '请扫码/手输',
        required: false,
        focus: true,
        clearable: true,
        uProps: undefined,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'scan', value?: string): void;
    (e: 'clear'): void;
    (e: 'change', value: any): void;
}>();

/**
 * 双向绑定
 */
const code = computed<string | undefined>({
    get: () => props.modelValue,
    set: (value?: string) => emits('update:modelValue', value),
});

/**
 * use-scan
 */
const { initListener, removeListener } = useScan(res => {
    emits('scan', res.code);
});

/**
 * 焦点状态
 */
const scanFocus = ref<boolean>(props.focus);

/**
 * 扫码标识
 */
const scanFlag = ref<boolean>(false);

/**
 * 聚焦回调
 */
function handleFocus() {
    scanFlag.value = true;
}

/**
 * 失焦回调
 */
function handleBlur() {
    scanFlag.value = false;
}

/**
 * 清空
 */
function handleClear(): void {
    emits('clear');
}

/**
 * 改变输入框数据回调
 */
function handleInputChange(value: any): void {
    emits('change', value);
}

function handleEmitScan() {
    emits('scan', code.value);
}

/**
 * 确认回调
 */
const handleConfirm = throttle(handleEmitScan, import.meta.env.VITE_APP_SCAN_TIME_OUT);

/**
 * 手动扫码标识回调
 */
function handleScanClick(): void {
    uni.scanCode({
        success: res => {
            emits('scan', res.result);
        },
    });
}

/**
 * 清空条码并重置焦点
 */
function resetFocus(): void {
    scanFocus.value = false;

    nextTick(() => {
        code.value = '';
        scanFocus.value = true;
    });
}

/**
 * 监听
 */
watch(
    () => scanFlag.value,
    newValue => {
        // #ifdef APP-PLUS
        removeListener();
        initListener(newValue);
        // #endif
    },
);

/**
 * 暴露方法
 */
defineExpose({
    resetFocus,
});
</script>
