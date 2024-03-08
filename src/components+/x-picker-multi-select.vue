<template>
    <u-form-item :id="$attrs.id ?? prop" :prop="prop" :label="label" :required="required">
        <u-input
            v-model="inputLabel"
            :placeholder="placeholder ?? `请选择${label ?? ''}`"
            :disabled="disabled"
        >
        </u-input>

        <template #right>
            <u-icon name="arrow-down" size="20px" @click="openSelect"></u-icon>
        </template>
    </u-form-item>

    <u-popup :show="visible" mode="bottom" @close="handleClose">
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

                <view class="action action--primary" @click="handleConfirm">
                    <text>{{ searchConfirmText }}</text>
                </view>
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
                    :class="{ 'select-item--active': codeValue.indexOf(item.value) !== -1 }"
                    @click="handleSelect(item)"
                >
                    <text>{{ item.label }}</text>

                    <u-icon
                        v-if="codeValue.indexOf(item.value) !== -1"
                        name="checkmark"
                        color="#2979ff"
                        size="14px"
                    ></u-icon>
                </view>
            </view>
        </view>
    </u-popup>
</template>

<script setup lang="ts">
import type { LabelValueItem } from 'src/constant/global';
import { findItem } from 'src/utils/tools';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';

const props = withDefaults(
    defineProps<{
        prop?: string;
        label?: string;
        required?: boolean;
        labelValue?: any[];
        codeValue?: any;
        api?: (data: any) => Promise<any>;
        options?: any[];
        labelKey?: string;
        valueKey?: string;
        params?: any;
        placeholder?: string;
        disabled?: boolean;
        searchCancelText?: string;
        searchConfirmText?: string;
        searchPlaceholder?: string;
        loadingText?: string;
    }>(),
    {
        modelValue: undefined,
        prop: undefined,
        label: '',
        required: false,
        params: undefined,
        labelValue: () => [],
        codeValue: () => [] || '',
        labelKey: 'label',
        valueKey: 'value',
        options: () => [],
        api: undefined,
        placeholder: '选择/查询',
        disabled: false,
        searchCancelText: '清空',
        searchConfirmText: '确定',
        searchPlaceholder: '请输入关键字',
        loadingText: '加载中',
    }
);

const emits = defineEmits<{
    (e: 'update:codeValue', value?: any): void;
    (e: 'update:labelValue', value?: any): void;
    (e: 'confirm', value?: any): void;
    (e: 'clear'): void;
}>();

const inputLabel = computed(() => {
    return labelString.value.toString();
});

const labelString = ref<string[]>([]);

const codeValue = computed<any>({
    get: () => props.codeValue,
    set: (value?: any) => {
        emits('update:codeValue', value);
    },
});

watch(
    () => props.labelValue,
    (newValue) => {
        labelString.value = newValue;
    }
);
/**
 * 下拉列表
 */
const list = ref<LabelValueItem[]>([]);

const loading = ref<boolean>(false);

/**
 * 获取接口数据
 */
async function fetch(): Promise<boolean> {
    if (!props.api) {
        list.value = props.options?.map((item) => ({
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

/**
 * 打开弹出框
 */
const visible = ref<boolean>(false);
async function openSelect(): Promise<void> {
    fetch();
    visible.value = true;
}

function clear() {
    codeValue.value = [];
    labelString.value = [];
}
/**
 * 清空事件
 */
function handleClear(): void {
    clear();
    emits('clear');
}

const searchValue = ref<string>('');

/**
 * 搜索列表
 */
const searchList = computed(() => {
    return list.value.filter((item) => item.label.includes(searchValue.value));
});

/**
 * 选中
 */
function handleSelect(item: any): void {
    codeValue.value = findItem(codeValue.value, item.value);
    labelString.value = findItem(labelString.value, item.label);
}

function handleConfirm(): void {
    emits('update:labelValue', labelString.value);
    emits('update:codeValue', codeValue.value);
    emits('confirm', codeValue);
    visible.value = false;
}

function handleClose() {
    visible.value = false;
}

watchEffect(() => {
    const matchedItem = list.value.filter((item) => codeValue.value.includes(item.value));

    labelString.value = matchedItem.map((item: any) => item.label);
});

onMounted(() => {
    fetch();
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
    width: 30px;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.select-list {
    // width: 100%;
    height: 240px;
    // overflow-y: scroll;
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

.action--primary {
    color: $u-primary;
}

.loading {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>
