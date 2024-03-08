<template>
    <u-form-item :id="$attrs.id ?? prop" :prop="prop" :label="label" :required="required">
        <u-input
            v-model="labelString"
            :placeholder="placeholder ?? `请选择${label ?? ''}`"
            readonly
            border="none"
            :disabled="disabled"
            clearable
            v-bind="inputProps"
            @click="openSelect"
        >
        </u-input>

        <template #right>
            <u-icon name="arrow-right" size="20px" @click="openSelect"></u-icon>
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
import type { LabelValueItem } from 'src/constant/global';
import { onMounted, watchEffect, computed, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        mode?: string;
        modelValue?: any;
        prop?: string;
        label?: string;
        required?: boolean;
        labelValue?: string;
        api?: (data: any) => Promise<any>;
        options?: any[];
        labelKey?: string;
        valueKey?: string;
        params?: any;
        placeholder?: string;
        disabled?: boolean;
        prefetch?: boolean;
        inputProps?: Record<string, any>;
        searchCancelText?: string;
        searchPlaceholder?: string;
        loadingText?: string;
    }>(),
    {
        modelValue: undefined,
        prop: undefined,
        label: '',
        required: false,
        params: undefined,
        labelValue: undefined,
        labelKey: 'label',
        valueKey: 'value',
        options: () => [],
        api: undefined,
        mode: 'single',
        placeholder: '',
        disabled: false,
        prefetch: true,
        inputProps: undefined,
        searchCancelText: '清空',
        searchPlaceholder: '请输入关键字',
        loadingText: '加载中',
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: string): void;
    (e: 'update:labelValue', value?: string): void;
    (e: 'clear'): void;
    (e: 'confirm', value?: any): void;
}>();

/**
 * label
 */
const labelString = ref<string | undefined>(undefined);

/**
 * value
 */
const codeValue = computed<string | undefined>({
    get: () => props.modelValue,
    set: (value?: string) => {
        emits('update:modelValue', value);
    },
});

const popupRef = ref();

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
async function openSelect(): Promise<void> {
    fetch();
    popupRef.value.open();
}

/**
 * 清除
 */
function clear(): void {
    codeValue.value = undefined;
    labelString.value = undefined;
}

/**
 * 清空事件
 */
function handleClear(): void {
    clear();
    popupRef.value.close();
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
 * 选中项
 */
function isActive(item: LabelValueItem): boolean {
    return props.modelValue === item.value;
}

/**
 * 选中
 */
function handleSelect(item: LabelValueItem): void {
    labelString.value = item.label;
    codeValue.value = item.value;

    emits('update:labelValue', item.label);
    emits('update:modelValue', item.value);
    emits('confirm', item);

    popupRef.value.close();
}

watchEffect(() => {
    const matchedItem = list.value.find((item) => item.value === codeValue.value);

    labelString.value = matchedItem?.label;
    emits('update:labelValue', labelString.value);
});

watch(
    () => props.options,
    () => {
        fetch();
    }
);

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
