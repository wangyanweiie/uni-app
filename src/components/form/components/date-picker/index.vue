<template>
    <view class="wrap">
        <view class="content">
            <view class="content__left" @click="handleOpen">
                <view v-if="dateValue">{{ dateValue }}</view>
                <view v-else class="content__left__placeholder">
                    {{ schema?.attributes?.placeholder || '请选择日期' }}
                </view>
            </view>

            <!-- 清空 -->
            <view class="content__right">
                <u-icon
                    v-if="schema?.attributes?.clearable"
                    name="close-circle-fill"
                    size="40rpx"
                    @click="handleClear"
                ></u-icon>
            </view>
        </view>

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
    name: 'DatePicker',
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
                type: 'DatePicker',
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
const {
    showPicker,
    dateValue,
    dateType,
    dateFormat,
    handleOpen,
    handleClear,
    handleCancel,
    handleDatePickFormat,
    handleConfirm,
} = useIndex(props, emit);

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
.wrap {
    width: 100%;
    height: 70rpx;
}

.content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;

    &__left {
        width: 100%;

        &__placeholder {
            color: #cccfd6;
        }
    }
}
</style>
