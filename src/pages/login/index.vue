<template>
    <view class="view-wrap wrap">
        <u-row>
            <u-col :span="12" class="image-top">
                <image :src="imageList.cloud"></image>
            </u-col>
        </u-row>

        <view class="login">
            <view class="login__title">
                <text>UNI-APP</text>
            </view>

            <u-form ref="formRef" :model="form" :rules="rules" label-width="120rpx" class="login__form">
                <u-form-item prop="account">
                    <u-input v-model="form.account" type="text" placeholder="用户名" />
                </u-form-item>
                <u-form-item prop="password">
                    <u-input v-model="form.password" type="password" placeholder="密码" />
                </u-form-item>
                <u-form-item prop="companyId">
                    <x-select
                        v-model="form.companyId"
                        :options="companyList"
                        placeholder="公司"
                        border="none"
                    ></x-select>
                </u-form-item>
                <u-form-item v-if="ENV !== 'production'" prop="baseUrl">
                    <u-input v-model="form.baseUrl" placeholder="BASE_URl" @blur="handleBlur"></u-input>
                </u-form-item>
            </u-form>

            <u-button class="login__button" plain type="primary" @click="login">登录</u-button>
        </view>

        <u-row>
            <u-col :span="4" class="image-bottom">
                <image :src="imageList.order"></image>
            </u-col>
            <u-col :span="4" class="image-bottom">
                <image :src="imageList.sale"></image>
            </u-col>
            <u-col :span="4" class="image-bottom">
                <image :src="imageList.analysis"></image>
            </u-col>
        </u-row>
    </view>
</template>

<script setup lang="ts">
import { ENV } from '@/constant/global';
import useLogin from './useIndex';

const { formRef, form, rules, imageList, companyList, handleBlur, login } = useLogin();
</script>

<style lang="scss" scoped>
.wrap {
    height: calc(100vh - 44px);
    background-color: #ecf5ff;
}

.login {
    margin: 30rpx;
    padding: 30rpx;
    background-color: #fff;

    &__title {
        text-align: center;
        color: #3c9dfff3;
        font-size: 32rpx;
        height: 100rpx;
        line-height: 100rpx;
    }

    &__button {
        margin: 10px 0;
    }
}

.image-top {
    image {
        width: 150rpx;
        height: 150rpx;
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
