<template>
    <u-form-item :id="$attrs.id ?? prop" :label="label" :prop="prop" :required="required">
        <picker mode="time" :value="dateData" @change="handleChange" @cancel="handleCancel">
            <view v-if="dateData" class="time">{{ dateData }} </view>
            <view v-else class="time placeholder">{{ placeholder }} </view>
        </picker>
        <template #right>
            <u-icon name></u-icon>
        </template>
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
        /** 是否禁用 */
        disabled?: boolean;
    }>(),
    {
        modelValue: undefined,
        label: '',
        prop: '',
        required: false,
        placeholder: '',
        disabled: false,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

/**
 * 日期
 */
const dateData = computed<string>(() => props.modelValue ?? '');

/**
 * 改变日期
 */
function handleChange(value: any): void {
    emits('update:modelValue', value.detail.value);
}

/**
 * 取消日期
 */
function handleCancel(): void {
    emits('update:modelValue', '');
}
</script>

<style lang="scss" scoped>
.time {
    width: 100%;
    min-width: 100px;
    height: 28px;
    display: flex;
    align-items: center;
}

.placeholder {
    color: $uni-text-color-grey;
}
</style>
