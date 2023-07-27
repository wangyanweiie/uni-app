import { ref } from 'vue';
import { clearToken, getStorage } from '@/utils/uni-storage';
import { showToast } from '@/utils/messageTip';
import RequestAPI from '@/api/login/index';

interface changePasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export default function useChangePassword() {
    const formRef = ref();

    const form = ref<changePasswordForm>({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const rules = ref({
        oldPassword: [
            {
                required: true,
                message: '原密码不能为空',
            },
        ],
        newPassword: [
            {
                required: true,
                message: '新密码不能为空',
            },
        ],
        confirmNewPassword: [
            {
                required: true,
                message: '确认密码不能为空',
            },
            {
                validateFunction: (rule: any, value: any) => {
                    console.log(rule);
                    return form.value.newPassword.trim() === value.trim();
                },
                errorMessage: '两次输入密码不一致',
            },
        ],
    });

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

        const res = await RequestAPI.changePassword(data);

        if (res) {
            showToast('修改成功');

            setTimeout(() => {
                clearToken();
                uni.navigateTo({ url: '/pages/login/index' });
            }, 1000);
        }
    }

    return {
        form,
        formRef,
        rules,
        handleSubmit,
    };
}
