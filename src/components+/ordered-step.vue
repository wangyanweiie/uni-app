<template>
    <view class="step" :class="[`status--${icon.type}`]">
        <view class="title">
            <text>{{ title }}</text>
        </view>

        <view class="status">
            <u-icon class="icon" :class="icon.className"></u-icon>
        </view>
    </view>
</template>

<script setup lang="ts">
import { StepStatusIconClass, StepStatusType } from 'src/constant/base';
import { computed } from 'vue';

type StatusType = 'success' | 'warning' | 'info' | 'error' | 'primary';

const props = withDefaults(
    defineProps<{
        /**
         * 标题
         */
        title?: string | number;
        /**
         * 类型
         */
        type?: StepStatusType;
    }>(),
    {
        title: '',
        type: 1,
    }
);

const icon = computed<{
    className: string;
    type: StatusType;
}>(() => {
    // 未定义
    if (!props.type) {
        return {
            className: StepStatusIconClass.未完成,
            type: 'info',
        };
    }

    // 进行中
    if (props.type === StepStatusType.进行中) {
        return {
            className: StepStatusIconClass.进行中,
            type: 'primary',
        };
    }

    // 已完成
    if (props.type === StepStatusType.已完成) {
        return {
            className: StepStatusIconClass.已完成,
            type: 'success',
        };
    }

    // 默认未完成
    return {
        className: StepStatusIconClass.未完成,
        type: 'info',
    };
});
</script>

<style lang="scss" scoped>
.step {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    background: #f4f4f4;
    margin-bottom: 15px;
}

.title {
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-left: 10px;
}

.status {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    font-size: 45px;
}
</style>
