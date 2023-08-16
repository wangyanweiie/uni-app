<template>
    <view class="component">
        <u-input
            v-model="dateValue"
            readonly
            :border="border"
            :placeholder="placeholder"
            :disabled="disabled"
            @click="handleOpen"
        >
            <template #suffix>
                <!-- uviewPlus 标签不支持 .stop，但 view 标签可以 -->
                <view v-if="dateValue && clearable && !disabled" class="suffix-wrap" @click.stop="handleClear">
                    <u-icon name="close-circle-fill" color="#C6C7CB" size="40rpx"></u-icon>
                </view>
                <view v-else>
                    <u-icon name="calendar" color="#C6C7CB" size="40rpx"></u-icon>
                </view>
            </template>
        </u-input>

        <date-picker
            :show="showPicker"
            :value="dateValue"
            :type="dateType"
            :show-tips="true"
            :show-seconds="true"
            @confirm="handleConfirm"
            @cancel="handleCancel"
        />
    </view>
</template>

<script setup lang="ts">
import useIndex from './useIndex';
import DatePicker from './Datepicker.vue';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定的值 */
        modelValue: string;
        /** 边框 */
        border?: 'surround' | 'bottom' | 'none';
        /** 提示文字 */
        placeholder?: string;
        /** 是否可清空 */
        clearable?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 日期类型 */
        dateType?: 'time' | 'date' | 'datetime';
        /** 日期组件处理格式 */
        dateFormat?: 'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss';
    }>(),
    {
        modelValue: '',
        border: 'surround',
        placeholder: '请选择日期',
        clearable: false,
        disabled: false,
        dateType: 'date',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void;
    (e: 'change', val: any): void;
    (e: 'clear'): void;
}>();

/**
 * useIndex
 */
const { showPicker, dateValue, dateType, handleOpen, handleClear, handleCancel, handleConfirm } = useIndex(props, emit);
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}

.suffix-wrap {
    display: flex;
}
</style>
