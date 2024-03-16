<template>
    <u-form-item :label="label" :prop="prop" :required="required">
        <u-input
            v-bind="$attrs"
            v-model="inputData"
            :placeholder="placeholder"
            :clearable="clearable"
            :disabled="disabled"
            :border="isShow"
        ></u-input>
    </u-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue?: string;
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
        /** 是否显示边框 */
        show?: boolean;
    }>(),
    {
        modelValue: '',
        label: '',
        prop: '',
        required: false,
        placeholder: '',
        clearable: false,
        disabled: false,
        show: false,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

/**
 * 输入框数据
 */
const inputData = computed<string>({
    get: () => props.modelValue ?? '',
    set: value => emits('update:modelValue', value),
});

/**
 * 是否显示边框
 */
const isShow = computed(() => {
    return props.show === true ? 'none' : 'surround';
});
</script>
