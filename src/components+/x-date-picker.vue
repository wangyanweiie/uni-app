<template>
    <u-form-item
        :id="$attrs.id ?? prop"
        :label="label"
        :prop="prop"
        :required="required"
        :label-width="labelWidth"
    >
        <uni-datetime-picker
            v-model="dateData"
            :placeholder="placeholder"
            :clear-icon="clearable"
            :disabled="disabled"
            type="date"
            v-bind="uniProps"
            @change="handleChange"
        ></uni-datetime-picker>
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
        uniProps?: any;
        labelWidth?: string;
    }>(),
    {
        modelValue: undefined,
        label: '',
        prop: '',
        required: false,
        placeholder: '',
        clearable: false,
        disabled: false,
        uniProps: undefined,
        labelWidth: undefined,
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: any): void;
}>();

const dateData = computed<any>({
    get: () => props.modelValue,
    set: (value) => {
        emits('update:modelValue', value);
    },
});

function handleChange(value: any) {
    emits('change', value);
}
</script>
