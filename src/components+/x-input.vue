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
        modelValue?: any;
        label?: string;
        prop?: string;
        required?: boolean;
        placeholder?: string;
        clearable?: boolean;
        disabled?: boolean;
        show?: boolean;
    }>(),
    {
        modelValue: undefined,
        label: '',
        prop: '',
        required: false,
        placeholder: '',
        clearable: false,
        disabled: false,
        show: false,
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const inputData = computed<any>({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
});

const isShow = computed(() => {
    return props.show === true ? 'none' : 'surround';
});
</script>
