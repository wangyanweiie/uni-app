<template>
    <view class="view-wrap wrap">
        <view class="login">
            <view class="login__title">
                <text>UNI-APP</text>
            </view>

            <u-form ref="formRef" :model="form" :rules="rules" label-width="120rpx" class="login__form">
                <u-form-item prop="account">
                    <u-input
                        v-model="form.account"
                        type="text"
                        prefix-icon="account"
                        :prefix-icon-style="prefixIconStyle"
                        placeholder="用户名"
                    />
                </u-form-item>
                <u-form-item prop="password">
                    <u-input
                        v-model="form.password"
                        type="password"
                        prefix-icon="lock"
                        :prefix-icon-style="prefixIconStyle"
                        placeholder="密码"
                    />
                </u-form-item>
                <u-form-item prop="companyId">
                    <x-select
                        v-model="form.companyId"
                        :options="companyList"
                        placeholder="公司"
                        border="none"
                        prefix-icon="home"
                        :prefix-icon-style="prefixIconStyle"
                    ></x-select>
                </u-form-item>
                <u-form-item v-if="ENV !== 'production'" prop="baseUrl">
                    <u-input
                        v-model="form.baseUrl"
                        placeholder="URL"
                        prefix-icon="tags"
                        :prefix-icon-style="prefixIconStyle"
                        @blur="handleBlur"
                    ></u-input>
                </u-form-item>
            </u-form>

            <u-button class="login__button" plain type="primary" @click="login">登录</u-button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ENV } from '@/constant/global';
import useLogin from './useIndex';

const { prefixIconStyle, formRef, form, rules, companyList, handleBlur, login } = useLogin();
</script>

<style lang="scss" scoped>
.wrap {
    height: calc(100vh - 44px);
    background-color: #ecf5ff;
    display: flex;
    align-items: center;
}

.login {
    flex: 1;
    margin: 0 30rpx;
    padding: 10rpx 30rpx;
    background-color: #fff;

    &__title {
        text-align: center;
        color: #3c9dfff3;
        font-size: 32rpx;
        height: 80rpx;
        line-height: 80rpx;
    }

    &__button {
        margin: 20rpx 0;
    }
}

.image-top {
    image {
        width: 100rpx;
        height: 100rpx;
    }
}

.image-bottom {
    position: relative;

    image {
        width: 170rpx;
        height: 170rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
