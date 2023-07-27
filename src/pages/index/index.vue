<template>
    <view class="view-wrap">
        <view v-for="menu in menuList" :key="menu.label" class="menu">
            <view class="menu__label">
                <text>{{ menu.label }}</text>
            </view>

            <view class="menu__item-wrap">
                <view v-for="sub in menu.subMenu" :key="sub.value" class="menu__item" @click="navigateTo(sub)">
                    <u-icon
                        class="menu__item__icon"
                        color="#fff"
                        custom-prefix="iconfont"
                        :name="sub.icon"
                        size="60rpx"
                    >
                    </u-icon>
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
        color: #2196f3;
        font-size: 32rpx;
        margin-bottom: 10rpx;
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
        border-radius: 10rpx;
        box-shadow: 0 2px 12px 0 rgba(33, 150, 243, 0.1);

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
