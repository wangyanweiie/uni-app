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
import { isUndefined } from 'lodash-es';
import { computed, useAttrs } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        label?: string;
        prop?: string;
        required?: boolean;
        placeholder?: string;
        clearable?: boolean;
        disabled?: boolean;
        labelWidth?: string;
        show?: boolean;
        min?: number;
        max?: number;
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
        show: false,
        min: undefined,
        max: undefined,
        precision: undefined,
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const inputData = computed<any>({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
});

const attr = useAttrs() as any;

function handleBlur() {
    if (!isUndefined(props.min) && Number(inputData.value) <= props.min) {
        inputData.value = props.min;
    }

    if (!isUndefined(props.max) && Number(inputData.value) >= props.max) {
        inputData.value = props.max;
    }

    if (!isUndefined(props.precision)) {
        inputData.value = Number(inputData.value).toFixed(props.precision);
    }

    // 为了使计算公式触发为最新的值
    if (attr.onChange) {
        attr.onChange(inputData.value);
    }
}
</script>
