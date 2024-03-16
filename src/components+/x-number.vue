<template>
    <u-form-item :label="label" :prop="prop" :required="required">
        <u-input
            ref="inputRef"
            v-model="inputData"
            type="digit"
            :placeholder="placeholder"
            :clearable="clearable"
            :disabled="disabled"
            v-bind="$attrs"
            @blur="handleBlur"
        ></u-input>
    </u-form-item>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue?: number | string;
        /** 表单标题 */
        label?: string;
        /** 表单属性 */
        prop?: string;
        /** 是否必填 */
        required?: boolean;
        /** 占位符 */
        placeholder?: string;
        /** 是否可清空 */
        clearable?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 表单标题宽度 */
        labelWidth?: string;
        /** 最小值 */
        min?: number;
        /** 最大值 */
        max?: number;
        /** 精度 */
        precision?: number;
    }>(),
    {
        modelValue: '',
        label: '',
        prop: '',
        required: false,
        placeholder: '',
        clearable: false,
        disabled: false,
        labelWidth: '90px',
        min: undefined,
        max: undefined,
        precision: undefined,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: number | string): void;
}>();

/**
 * 输入框数据
 */
const inputData = computed<number | string>({
    get: () => props.modelValue,
    set: value => emits('update:modelValue', value),
});

const attr = useAttrs() as any;

/**
 * 失去焦点事件
 */
function handleBlur() {
    // 最小值
    if (props.min && Number(inputData.value) <= props.min) {
        inputData.value = props.min;
    }

    // 最大值
    if (props.max && Number(inputData.value) >= props.max) {
        inputData.value = props.max;
    }

    // 精度
    if (props.precision) {
        inputData.value = Number(inputData.value).toFixed(props.precision);
    }

    // 为了使计算公式触发为最新的值
    if (attr.onChange) {
        attr.onChange(inputData.value);
    }
}
</script>
