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
                <u-form-item label="用户名" required prop="account">
                    <u-input
                        v-model="form.account"
                        type="text"
                        placeholder="请输入用户名"
                        placeholder-style="color:#999"
                    />
                </u-form-item>
                <u-form-item label="密码" required prop="password">
                    <u-input
                        v-model="form.password"
                        type="password"
                        placeholder="请输入密码"
                        placeholder-style="color:#999"
                    />
                </u-form-item>
                <u-form-item label="公司" required prop="companyId">
                    <x-select v-model="form.companyId" :options="companyList" border="none"></x-select>
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
import useLogin from './useIndex';

const { formRef, form, rules, imageList, companyList, login } = useLogin();
</script>

<style lang="scss" scoped>
.wrap {
    height: 100vh;
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
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        height: 180rpx;
    }
}
</style>
