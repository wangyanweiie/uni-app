<template>
    <view class="wrap">
        <!-- 纯文本展示样式 -->
        <!-- <view class="content">
            <view class="content__left" @click="handleOpen">
                <view v-if="dateValue">{{ dateValue }}</view>
                <view v-else class="content__left__placeholder">
                    {{ schema?.attributes?.placeholder || '请选择日期' }}
                </view>
            </view>

            <view class="content__right">
                <u-icon
                    v-if="schema?.attributes?.clearable"
                    name="close-circle-fill"
                    size="40rpx"
                    @click="handleClear"
                ></u-icon>
            </view>
        </view> -->

        <!-- 输入框禁用样式 -->
        <u-input
            v-model="dateValue"
            border="surround"
            placeholder="请选择日期"
            prefix-icon="calendar"
            prefix-icon-style="font-size: 40rpx"
            :readonly="!schema?.attributes?.disabled"
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
// :deep(.u-input__content) {
//     height: 70rpx;
// }

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

.suffix-wrap {
    display: flex;
}
</style>
