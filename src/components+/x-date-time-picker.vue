<template>
    <u-form-item :id="$attrs.id ?? prop" :label="label" :prop="prop" :required="required">
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
        modelValue?: any;
        label?: string;
        prop?: string;
        required?: boolean;
        placeholder?: string;
        clearable?: boolean;
        disabled?: boolean;
        uniProps?: any;
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
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const dateData = computed<any>({
    get: () => props.modelValue,
    set: (value) => {
        emits('update:modelValue', value);
    },
});

// uni组件 change方法无效 用watch触发emits事件更新外部绑定值
watch(dateData, (value) => {
    emits('update:modelValue', value);
});
</script>
