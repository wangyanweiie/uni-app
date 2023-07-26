<template>
    <view class="view-wrap">
        <view>
            <u-form ref="formRef" :label-width="200" :model="form" :rules="rules">
                <u-form-item label="原始密码" required prop="oldPassword"
                    ><u-input v-model="form.oldPassword" type="text" placeholder="请输入用户名"
                /></u-form-item>
                <u-form-item label="新设密码" required prop="newPassword"
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
// import { clearToken, getStorage } from '@/utils/uni-storage';
// import { showSuccessToastWithNavget } from '@/utils/messageTip';
import useChangePassword from './useChangePassword';
// import HTTP from '@/api/login/index';

/**
 * useChangePassword
 */
const { form, formRef, rules } = useChangePassword();

/**
 * 提交
 */
async function handleSubmit() {
    await formRef.value.validate();

    uni.showModal({
        title: '',
        content: '是否确认更改密码？',
        success: res => {
            if (res.confirm) {
                confirmSubmit();
            }
        },
    });
}

/**
 * 确认修改
 */
async function confirmSubmit() {
    const data = {
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword,
        userId: getStorage('userInfo').id,
    };

    // const res = await HTTP.changePassword(data);

    // if (res) {
    //     clearToken();
    //     showSuccessToastWithNavget('/pages/login/index');
    // }
}
</script>
