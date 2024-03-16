<template>
    <view class="dropdown-input">
        <label class="label">{{ label }}</label>
        <u-input v-model="data" :placeholder="defaultPlaceholder" @change="handleChange"></u-input>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { debounce } from 'lodash-es';
import { DEBOUNCE_DURATION } from 'src/constant/global';

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue?: string;
        /** 标题 */
        label?: string;
        /** 占位符 */
        placeholder?: string;
    }>(),
    {
        modelValue: '',
        label: '',
        placeholder: '',
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: string | undefined): void;
    (e: 'change', value: string | undefined): void;
}>();

/**
 * 输入框数据
 */
const data = computed<string>({
    get: () => props.modelValue,
    set: value => emits('update:modelValue', value),
});

/**
 * 默认占位符
 */
const defaultPlaceholder = computed<string>(() => {
    return props.placeholder ? props.placeholder : `${props.label}查询`;
});

/**
 * 改变输入框的值
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
