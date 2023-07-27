<template>
    <view class="view-wrap">
        <view>
            <u-form ref="formRef" :label-width="80" :model="form" :rules="rules">
                <u-form-item label="原密码" required prop="oldPassword"
                    ><u-input v-model="form.oldPassword" type="text" placeholder="请输入用户名"
                /></u-form-item>
                <u-form-item label="新密码" required prop="newPassword"
                    ><u-input v-model="form.newPassword" type="password" placeholder="请输入密码"
                /></u-form-item>
                <u-form-item label="确认新密码" required prop="confirmNewPassword"
                    ><u-input v-model="form.confirmNewPassword" type="password" placeholder="请输入密码"
                /></u-form-item>
            </u-form>

            <u-button type="success" @click="handleSubmit">提交</u-button>
        </view>
    </view>
</template>
<script setup lang="ts">
import useChangePassward from './useChangePassward';

const { form, formRef, rules, handleSubmit } = useChangePassward();
</script>
