<template>
    <view class="view-wrap wrap">
        <view v-for="menu in menuList" :key="menu.label" class="menu">
            <view class="menu__label">
                <text>{{ menu.label }}</text>
            </view>

            <view class="menu__item-wrap">
                <view v-for="sub in menu.subMenu" :key="sub.value" class="menu__item" @click="navigateTo(sub)">
                    <!-- u-icon 自定义字体图标暂不可用 -->
                    <!-- <u-icon color="#2979ff" :name="sub.icon" size="50rpx"></u-icon> -->

                    <!-- uni-icons 可使用自定义字体图标 -->
                    <uni-icons
                        class="menu__item__icon"
                        color="#2979ff"
                        custom-prefix="iconfont"
                        :type="sub.icon"
                        size="50rpx"
                    >
                    </uni-icons>

                    <view class="menu__item__label">
                        <text>
                            {{ sub.label }}
                        </text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import useIndex from './useIndex';

const { menuList, navigateTo } = useIndex();
</script>
<style lang="scss" scoped>
.wrap {
    background-color: #f3f4f6;
    color: #252933;
}

.menu {
    padding: 20rpx 10rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow:
        8rpx 8rpx 8rpx #e3dfdf,
        -8rpx -8rpx 8rpx #f7f5f5;

    &__label {
        font-size: 32rpx;
        font-weight: bold;
        margin: 0 0 10rpx 10rpx;
    }

    &__item-wrap {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    &__item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 150rpx;
        height: 150rpx;
        padding: 16rpx;
        margin: 16rpx;
        border-radius: 10rpx;

        &__label {
            margin-top: 10rpx;
            font-size: 28rpx;

            text {
                white-space: nowrap;
                overflow-x: auto;
            }
        }
    }
}
</style>
