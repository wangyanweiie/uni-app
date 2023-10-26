<template>
    <view class="component description">
        <!-- 顶部区域 -->
        <view class="top">
            <view class="top__left">
                <slot name="topLeft"></slot>
            </view>
            <view class="top__right">
                <slot name="topRight"></slot>
            </view>
        </view>

        <!-- 描述列主体区域 -->
        <view class="main">
            <!-- chunk：将数组拆分成多个 size 长度的区块，并将这些区块组成一个新数组 -->
            <uni-row v-for="(childColumn, childIndex) in chunk(columns, size)" :key="childIndex">
                <uni-col v-for="(item, index) in childColumn" :key="index" :span="colSpan(childColumn)">
                    <view class="main__title">
                        {{ item.label }}
                    </view>

                    <view class="main__text">
                        {{ data[item.prop] }}
                    </view>
                </uni-col>
            </uni-row>
        </view>

        <!-- 底部区域 -->
        <view class="bottom">
            <slot name="bottom"></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { chunk } from 'lodash-es';
import { XDescriptionColumn } from './interface';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XDescription',
});

/**
 * props
 */
withDefaults(
    defineProps<{
        size?: number;
        columns: XDescriptionColumn[];
        data: Record<string, unknown>;
    }>(),
    {
        size: 2,
        columns: () => [],
        data: () => ({}),
    },
);

/**
 * col-span
 */
function colSpan(data: XDescriptionColumn[]) {
    switch (data.length) {
        case 1:
            return 24;
        case 2:
            return 12;
        case 3:
            return 8;
    }
}
</script>

<style scoped lang="scss">
.description {
    border: 1px solid #eee;
    border-radius: 20rpx;
    box-shadow:
        1rpx 1rpx 4rpx #e3dfdf,
        -1rpx -1rpx 4rpx #f7f5f5;
    padding: 14rpx;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &__left {
            font-size: 24rpx;
            color: #707070;

            view {
                padding: 4rpx;
            }
        }

        &__right {
            display: flex;
        }
    }

    .main {
        border: 1px solid #eee;
        text-align: center;
        margin: 10rpx 0;

        &__title {
            font-size: 28rpx;
            font-weight: bold;
            color: #8f939c;
            padding: 10rpx;
            background-color: #f5f6f8;
        }
        &__text {
            font-size: 24rpx;
            margin: 10rpx 0;
            color: #8f939c;
        }
    }

    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
