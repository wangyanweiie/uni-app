<template>
    <view>
        <u-form-item :id="$attrs.id ?? prop" :required="required" :label="label" :prop="prop">
            <u-input
                v-model="labelName"
                clearable
                readonly
                :prefix-icon="prefixIcon"
                border="none"
                :placeholder="placeholder ?? `请选择${label ?? ''}`"
                :disabled="disabled"
                @click="handleOpen"
                @clear="handleClear"
            >
                <template #suffix>
                    <u-icon v-if="!disabled" name="arrow-right" size="20px" />
                </template>
            </u-input>
        </u-form-item>

        <u-picker
            :columns="uPickerColumns"
            :show="pickerVisible"
            close-on-click-overlay
            :cancel-text="cancelText"
            :confirm-text="confirmText"
            @confirm="handleConfirm"
            @cancel="handleClear"
            @close="handleClose"
        />
    </view>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, computed } from 'vue';
import type { Numeric } from 'src/constant/base';
import type { PickerOption } from './interface';

/**
 * FIXME: 触发表单 change 事件有问题
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue: any;
        /** label 文本 */
        text?: string;
        /** 查询接口 */
        api?: (data?: any) => Promise<any>;
        /** 查询接口参数 */
        apiParams?: Record<string, string>;
        /** 下拉列表 */
        options?: PickerOption[];
        /** 表单标题 */
        label?: string;
        /** 表单属性 */
        prop?: string;
        /** 占位符 */
        placeholder?: string;
        /** 是否必填 */
        required?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 前缀图标 */
        prefixIcon?: string;
        /** 取消文本 */
        cancelText?: string;
        /** 确认文本 */
        confirmText?: string;
    }>(),
    {
        text: undefined,
        api: undefined,
        apiParams: undefined,
        options: () => [],
        label: '',
        prop: undefined,
        placeholder: undefined,
        required: false,
        disabled: false,
        prefixIcon: undefined,
        cancelText: '清空',
        confirmText: '确定',
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'update:text', value: any): void;
    (e: 'confirm', value: any): void;
    (e: 'clear'): void;
}>();

/**
 * label
 */
const labelName = ref<Numeric | undefined>();

/**
 * 下拉框是否显示
 */
const pickerVisible = ref<boolean>(false);

/**
 * 下拉列表
 */
const pickerColumns = ref<any[]>(props.options);
const uPickerColumns = computed<string[][]>(() => {
    return [pickerColumns.value?.map(col => col.label) ?? []];
});

/**
 * 打开下拉框
 */
async function handleOpen(): Promise<void> {
    if (props.disabled) {
        return;
    }

    if (!props.api) {
        pickerVisible.value = true;
        return;
    }

    const res = await loadData();

    if (res) {
        pickerVisible.value = true;
    }
}

/**
 * 关闭下拉框
 */
function handleClose(): void {
    pickerVisible.value = false;
}

/**
 * 选中值
 */
const selected = ref<string[]>();

/**
 * 确认选中
 */
function handleConfirm(data: { indexs: number[] }): void {
    const { indexs } = data;

    if (indexs && pickerColumns.value) {
        const { value } = pickerColumns.value[indexs[0]];

        // 更新 text
        const matchedOption = pickerColumns.value.find(option => option.value === value);

        if (matchedOption) {
            labelName.value = matchedOption.label;
            selected.value = [matchedOption.value];
        } else {
            labelName.value = undefined;
            selected.value = [];
        }

        emits('update:text', labelName.value);
        emits('update:modelValue', value);
        emits('confirm', value);
    }

    pickerVisible.value = false;
}

/**
 * 清空
 */
function handleClear(): void {
    emits('update:modelValue', undefined);
    emits('update:text', undefined);
    emits('clear');
    pickerVisible.value = false;
}

/**
 * 请求下拉列表
 */
async function loadData(): Promise<boolean> {
    if (!props.api) {
        return false;
    }

    const res = await props.api(props.apiParams);

    if (!res) {
        return false;
    }

    pickerColumns.value = res.data;
    return true;
}

/**
 * FIXME: 监听，待优化
 */
watchEffect(() => {
    if (!props.api) {
        pickerColumns.value = props.options;
    }

    labelName.value = props.text;

    // 更新 text
    const matchedOption = pickerColumns.value.find(option => option.value === props.modelValue);

    if (matchedOption) {
        labelName.value = matchedOption.label;
        selected.value = [props.modelValue];
    } else {
        // labelName.value = undefined;
        selected.value = [];
    }

    const matchedLabelOption = pickerColumns.value.find(option => option.label === props.text);

    if (matchedLabelOption) {
        emits('update:modelValue', matchedLabelOption.value);
        selected.value = [props.modelValue];
    } else {
        // labelName.value = undefined;
        selected.value = [];
    }
});

/**
 * 页面挂载
 */
onMounted(() => {
    loadData();
});
</script>

<style scoped lang="scss">
:deep(.u-icon__icon) {
    margin-left: 10px;
}
</style>
./interface
