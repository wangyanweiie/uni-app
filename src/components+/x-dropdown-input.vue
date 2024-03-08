<template>
    <view class="dropdown-input">
        <label class="label">{{ label }}</label>
        <u-input v-model="data" :placeholder="defaultPlaceholder" @change="handleChange"></u-input>
    </view>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import { DEBOUNCE_DURATION } from 'src/constant/global';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        label?: string;
        placeholder?: string;
    }>(),
    {
        modelValue: '',
        label: '',
        placeholder: '',
    }
);

const defaultPlaceholder = computed<string>(() => {
    return props.placeholder ? props.placeholder : `${props.label}查询`;
});

const emits = defineEmits<{
    (e: 'update:modelValue', value: string | undefined): void;
    (e: 'change', value: string | undefined): void;
}>();

const data = computed<string>({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
});

/**
 * 处理输入事件
 * @description 默认防抖
 */
const handleChange = debounce(() => {
    emits('change', data.value);
}, DEBOUNCE_DURATION);
</script>

<style lang="scss" scoped>
.dropdown-input {
    flex: 1;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    min-width: 0;
    color: #323233;
    font-size: 14px;
    padding: 0 10px;
}

.label {
    width: 60px;
}
</style>
