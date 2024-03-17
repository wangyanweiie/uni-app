<template>
    <u-form-item :id="$attrs.id ?? prop" :prop="prop" :label="label" :required="required">
        <u-input
            id="scan-select"
            v-model="code"
            clearable
            :placeholder="placeholder"
            :focus="scanFocus"
            :disabled="disabled"
            @clear="handleClear"
            @confirm="handleConfirm"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
        >
            <template #suffix>
                <u-icon name="scan" size="20px" @click="handleScanClick" />
            </template>
        </u-input>

        <!-- 打开下拉区域 -->
        <template #right>
            <u-icon name="arrow-down" size="20px" @click="openSelect"></u-icon>
        </template>

        <!-- 下拉区域 -->
        <uni-popup ref="popupRef" type="bottom">
            <view class="popup">
                <!-- 查询 -->
                <view class="search-line">
                    <view class="action action--error" @click="handleClear">
                        <text>{{ searchCancelText }}</text>
                    </view>

                    <u-search
                        v-model="searchValue"
                        :show-action="false"
                        :placeholder="searchPlaceholder"
                        class="search"
                    ></u-search>
                </view>

                <!-- 列表 -->
                <view class="select-list">
                    <view v-if="loading" class="loading">
                        <u-loading-icon :text="loadingText" size="25px" text-size="16px"></u-loading-icon>
                    </view>

                    <view
                        v-for="(item, index) in searchList"
                        :key="index"
                        class="select-item"
                        :class="{ 'select-item--active': isActive(item) }"
                        @click="handleSelect(item)"
                    >
                        <text>{{ item.label }}</text>
                        <u-icon v-if="isActive(item)" name="checkmark" color="#2979ff" size="14px"></u-icon>
                    </view>
                </view>
            </view>
        </uni-popup>
    </u-form-item>
</template>

<script setup lang="ts">
import { onMounted, watchEffect, watch, computed, nextTick, ref } from 'vue';
import type { LabelValueItem, Numeric } from 'src/constant/base';
import { useScan } from './hooks/use-scan';

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue?: any;
        /** 表单标题 */
        label?: string;
        /** 表单属性 */
        prop?: string;
        /** 条码值 */
        codeValue?: string;
        /** 下拉选项 */
        options?: Record<string, Numeric>[];
        /** 查询接口 */
        api?: (data: any) => Promise<any>;
        /** 查询接口请求参数 */
        params?: Record<string, Numeric>;
        /** 下拉选项的 label 属性名 */
        labelKey?: string;
        /** 下拉选项的 value 属性名 */
        valueKey?: string;
        /** 是否必填 */
        required?: boolean;
        /** 是否聚焦 */
        focus?: boolean;
        /** 是否可清空 */
        clearable?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 是否预加载 */
        preloadData?: boolean;
        /** 占位符 */
        placeholder?: string;
        /** 清空按钮文本 */
        searchCancelText?: string;
        /** 查询框占位符 */
        searchPlaceholder?: string;
        /** 加载中文本 */
        loadingText?: string;
    }>(),
    {
        modelValue: undefined,
        prop: undefined,
        label: '',
        codeValue: undefined,
        options: () => [],
        api: undefined,
        params: undefined,
        labelKey: 'label',
        valueKey: 'value',
        required: false,
        focus: true,
        clearable: false,
        disabled: false,
        preloadData: false,
        placeholder: '请扫码/选择',
        searchCancelText: '清空',
        searchPlaceholder: '请输入关键字',
        loadingText: '加载中',
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: any): void;
    (e: 'update:codeValue', value?: string): void;
    (e: 'scan', value: any): void;
    (e: 'confirm', value?: any): void;
    (e: 'clear'): void;
}>();

/**
 * 当前选中项
 */
function isActive(item: LabelValueItem): boolean {
    return props.codeValue === item.value;
}

/**
 * 双向绑定
 */
const code = computed<string | undefined>({
    get: () => props.modelValue,
    set: (value?: string) => emits('update:modelValue', value),
});

/**
 * 条码值
 */
const codeValue = computed<string | undefined>({
    get: () => props.codeValue ?? '',
    set: (value?: string) => emits('update:codeValue', value),
});

/**
 * 下拉列表
 */
const list = ref<LabelValueItem[]>([]);

const loading = ref<boolean>(false);

/**
 * 获取接口数据
 */
async function loadData(): Promise<void> {
    if (!props.api) {
        list.value = props.options.map(item => ({
            ...item,
            label: item[props.labelKey] as string,
            value: item[props.valueKey] ?? '',
        }));

        return;
    }

    loading.value = true;
    const res = await props.api(props.params);

    if (!res) {
        loading.value = false;
        return;
    }

    list.value = res.data.map((item: any) => ({
        ...item,
        label: item[props.labelKey] ?? '',
        value: item[props.valueKey] ?? '',
    }));

    loading.value = false;
    return;
}

const popupRef = ref();

/**
 * 打开弹出框
 */
async function openSelect(): Promise<void> {
    if (props.disabled) {
        return;
    }

    loadData();
    popupRef.value.open();
}

/**
 * 扫码
 */
function handleConfirm(): void {
    emits('scan', code.value);
}

/**
 * 手动扫码
 */
function handleScanClick(): void {
    uni.scanCode({
        success: res => {
            code.value = res.result;
            emits('scan', code.value);
        },
    });
}

/**
 * 清空条码
 */
function clear(): void {
    code.value = undefined;
    codeValue.value = undefined;
    list.value = [];
}

/**
 * 清空
 */
function handleClear(): void {
    clear();
    popupRef.value.close();
    emits('clear');
}

/**
 * 改变条码
 */
function handleChange(value: string) {
    if (!value) {
        codeValue.value = '';
    }
}

const searchValue = ref<string>('');

/**
 * 查询列表
 */
const searchList = computed(() => {
    return list.value.filter(item => item.label.includes(searchValue.value));
});

/**
 * 选中
 */
function handleSelect(item: LabelValueItem): void {
    code.value = item.label;
    codeValue.value = item.value as string;

    emits('update:modelValue', item.label);
    emits('update:codeValue', item.value as string);

    searchValue.value = '';
    popupRef.value.close();
    emits('confirm', item);
}

/**
 * use scan
 */
const { initListener, removeListener } = useScan(res => {
    emits('scan', res.code);
});

/**
 * 扫码聚焦状态
 */
const scanFocus = ref<boolean>(props.focus);

/**
 * 扫码标识状态
 */
const scanFlag = ref<boolean>(false);

/**
 * 聚焦事件
 */

function handleFocus() {
    scanFlag.value = true;
}

/**
 * 失焦事件
 */
function handleBlur() {
    scanFlag.value = false;
}

/**
 * 重置扫码聚焦状态
 */
function resetFocus(): void {
    scanFocus.value = false;
    nextTick(() => {
        clear();
        scanFocus.value = true;
    });
}

/**
 * 监听扫码
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
 * 同步label
 */
watchEffect(() => {
    const matchedOptions = list.value.find(item => item.value === props.codeValue);

    code.value = matchedOptions?.label;
});

defineExpose({
    clear,
    resetFocus,
});

onMounted(() => {
    if (props.preloadData) {
        loadData();
    }
});
</script>

<style lang="scss" scoped>
.popup {
    background-color: #fff;
}

.search-line {
    display: flex;
    align-items: center;
    height: 50px;
}

.action {
    width: 50px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.select-list {
    // width: 100%;
    height: 240px;
    overflow-y: scroll;
}

.select-item {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;

    &::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        bottom: 0;
        border-bottom: 1px solid #ebedf0;
        transform: scaleY(0.5);
        width: 100%;
    }
}

.select-item--active {
    color: $u-primary;
}

.action--error {
    color: $u-error;
}

.loading {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>
