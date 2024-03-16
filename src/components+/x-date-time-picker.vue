<template>
    <u-form-item :id="$attrs.id ?? prop" :label="label" :prop="prop" :required="required" :label-width="labelWidth">
        <uni-datetime-picker
            v-model="dateData"
            :placeholder="placeholder"
            :clear-icon="clearable"
            :disabled="disabled"
            type="datetime"
            v-bind="uniProps"
        ></uni-datetime-picker>
    </u-form-item>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';

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
        /** 其他属性 */
        uniProps?: any;
        /** 表单标题宽度 */
        labelWidth?: string;
    }>(),
    {
        modelValue: '',
        label: '',
        prop: '',
        required: false,
        placeholder: '',
        clearable: false,
        disabled: false,
        uniProps: undefined,
        labelWidth: undefined,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const dateData = computed<string>({
    get: () => props.modelValue ?? '',
    set: value => {
        emits('update:modelValue', value);
    },
});

/**
 * 由于 uni 组件 change 方法无效
 * 所以用 watch 触发 emits 事件更新外部绑定值
 */
watch(dateData, value => {
    emits('update:modelValue', value);
});
</script>
