<template>
    <view class="view-wrap">
        <view v-for="menu in menuList" :key="menu.label" class="menu">
            <view class="menu__label">
                <text>{{ menu.label }}</text>
            </view>

            <view class="menu__item-wrap">
                <view v-for="sub in menu.subMenu" :key="sub.value" class="menu__item" @click="navigateTo(sub)">
                    <!-- u-icon 自定义字体图标暂不可用 -->
                    <u-icon class="menu__item__icon" color="#fff" :name="sub.icon" size="50rpx"></u-icon>

                    <!-- uni-icons 可使用自定义字体图标 -->
                    <!-- <uni-icons
                        class="menu__item__icon"
                        color="#fff"
                        custom-prefix="iconfont"
                        :type="sub.icon"
                        size="40rpx"
                    >
                    </uni-icons> -->
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
.menu {
    margin-bottom: 30rpx;

    &__label {
        font-size: 32rpx;
        margin-bottom: 10rpx;
        color: #2196f3;
    }

    &__item-wrap {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 150rpx;
        height: 150rpx;
        padding: 16rpx;
        margin: 16rpx;
        color: #fff;
        background: #2196f3;
        box-shadow:
            8rpx 8rpx 14rpx #e3dfdf,
            -8rpx -8rpx 14rpx #f7f5f5;
        border-radius: 10rpx;

        &__icon {
            font-size: 60rpx;
        }

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
