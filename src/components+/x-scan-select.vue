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

        <template #right>
            <u-icon name="arrow-down" size="20px" @click="openSelect"></u-icon>
        </template>

        <uni-popup ref="popupRef" type="bottom">
            <view class="popup">
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

                <view class="select-list">
                    <view v-if="loading" class="loading">
                        <u-loading-icon
                            :text="loadingText"
                            size="25px"
                            text-size="16px"
                        ></u-loading-icon>
                    </view>
                    <view
                        v-for="(item, index) in searchList"
                        :key="index"
                        class="select-item"
                        :class="{ 'select-item--active': isActive(item) }"
                        @click="handleSelect(item)"
                    >
                        <text>{{ item.label }}</text>

                        <u-icon
                            v-if="isActive(item)"
                            name="checkmark"
                            color="#2979ff"
                            size="14px"
                        ></u-icon>
                    </view>
                </view>
            </view>
        </uni-popup>
    </u-form-item>
</template>

<script setup lang="ts">
import { onMounted, watchEffect, watch, computed, nextTick, ref } from 'vue';
import { useScan } from './use-scan';
import type { LabelValueItem } from 'src/constant/global';

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        prop?: string;
        label?: string;
        required?: boolean;
        clearable?: boolean;
        codeValue?: string;
        options?: any[];
        api?: (data: any) => Promise<any>;
        params?: any;
        labelKey?: string;
        valueKey?: string;
        focus?: boolean;
        disabled?: boolean;
        prefetch?: boolean;
        placeholder?: string;
        searchCancelText?: string;
        searchPlaceholder?: string;
        loadingText?: string;
    }>(),
    {
        modelValue: undefined,
        prop: undefined,
        label: '',
        required: false,
        clearable: false,
        codeValue: undefined,
        options: () => [],
        api: undefined,
        params: undefined,
        labelKey: 'label',
        valueKey: 'value',
        focus: true,
        disabled: false,
        prefetch: false,
        placeholder: '请扫码/选择',
        searchCancelText: '清空',
        searchPlaceholder: '请输入关键字',
        loadingText: '加载中',
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: any): void;
    (e: 'update:codeValue', value?: string): void;
    (e: 'scan', value: any): void;
    (e: 'confirm', value?: any): void;
    (e: 'clear'): void;
}>();

/**
 * 选中项
 */
function isActive(item: LabelValueItem): boolean {
    return props.codeValue === item.value;
}

/**
 *  V-MODEL
 */
const code = computed<string | undefined>({
    get: () => props.modelValue,
    set: (value?: string) => emits('update:modelValue', value),
});

/**
 * value 值
 */
const codeValue = computed<string | undefined>({
    get: () => props.codeValue ?? '',
    set: (value?: string) => emits('update:codeValue', value),
});

const loading = ref<boolean>(false);

/**
 * 获取接口数据
 */
async function fetch(): Promise<boolean> {
    if (!props.api) {
        list.value = props.options.map((item) => ({
            ...item,
            label: item[props.labelKey] ?? '',
            value: item[props.valueKey] ?? '',
        }));
        return false;
    }

    loading.value = true;
    const res = await props.api(props.params);

    if (!res) {
        loading.value = false;
        return false;
    }

    list.value = res.data.map((item: any) => ({
        ...item,
        label: item[props.labelKey] ?? '',
        value: item[props.valueKey] ?? '',
    }));

    loading.value = false;
    return true;
}

const popupRef = ref();

/**
 * 打开弹出框
 */
async function openSelect(): Promise<void> {
    if (props.disabled) {
        return;
    }

    fetch();
    popupRef.value.open();
}

function handleConfirm(): void {
    emits('scan', code.value);
}

/**
 * 点击处理
 */
function handleScanClick(): void {
    uni.scanCode({
        success: (res) => {
            code.value = res.result;

            emits('scan', code.value);
        },
    });
}

/**
 * 清空事件
 */
function handleClear(): void {
    clear();
    popupRef.value.close();
    emits('clear');
}

/**
 * 清除
 */
function clear(): void {
    code.value = undefined;
    codeValue.value = undefined;

    list.value = [];
}

const searchValue = ref<string>('');

/**
 * 下拉列表
 */
const list = ref<LabelValueItem[]>([]);

/**
 * 搜索列表
 */
const searchList = computed(() => {
    return list.value.filter((item) => item.label.includes(searchValue.value));
});

/**
 * 选中
 */
function handleSelect(item: LabelValueItem): void {
    code.value = item.label;
    codeValue.value = item.value;

    emits('update:modelValue', item.label);
    emits('update:codeValue', item.value);

    popupRef.value.close();
    searchValue.value = '';
    emits('confirm', item);
}

const scanFocus = ref<boolean>(props.focus);

const flag = ref<boolean>(false);

/**
 * 调用scan
 */
const { initListener, removeListener } = useScan((res) => {
    emits('scan', res.code);
});

watch(
    () => flag.value,
    (newValue) => {
        // #ifdef APP-PLUS
        removeListener();
        initListener(newValue);
        // #endif
    }
);

function resetFocus(): void {
    scanFocus.value = false;
    nextTick(() => {
        clear();
        scanFocus.value = true;
    });
}

function handleFocus() {
    flag.value = true;
}

function handleBlur() {
    flag.value = false;
}

function handleChange(value: string) {
    if (!value) {
        codeValue.value = '';
    }
}

/**
 * 同步label
 */
watchEffect(() => {
    const matchedOptions = list.value.find((item) => item.value === props.codeValue);

    code.value = matchedOptions?.label;
});

defineExpose({
    clear,
    resetFocus,
});

onMounted(() => {
    if (props.prefetch) {
        fetch();
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
