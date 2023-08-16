<template>
    <view class="component">
        <u-input
            v-model="dateValue"
            border="surround"
            placeholder="请选择日期"
            readonly
            v-bind="schema?.attributes"
            @click="handleOpen"
        >
            <template #suffix>
                <!-- uviewPlus 标签不支持 .stop，但 view 标签可以 -->
                <view
                    v-if="dateValue && schema?.attributes?.clearable && !schema?.attributes?.disabled"
                    class="suffix-wrap"
                    @click.stop="handleClear"
                >
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

<script lang="ts">
export default {
    name: 'BaseDatePicker',
};
</script>

<script setup lang="ts">
import useIndex from './useIndex';
import DatePicker from './Datepicker.vue';
import type { Schema } from '../../interface';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        schema: Schema;
        form: Record<string, any>;
    }>(),
    {
        schema: () => {
            return {
                prop: '',
                label: '',
                type: 'BaseDatePicker',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleEmit', val: { value: string; schema: Schema }): void;
}>();

/**
 * useIndex
 */
const { showPicker, dateValue, dateType, handleOpen, handleClear, handleCancel, handleDatePickFormat, handleConfirm } =
    useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    setData(val: string) {
        handleDatePickFormat(val);
    },
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}

.suffix-wrap {
    display: flex;
}
</style>
