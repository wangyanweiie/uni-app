import { ref } from 'vue';

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
                message: '请输入原始密码',
            },
        ],
        newPassword: [
            {
                required: true,
                message: '请输入新设密码',
            },
        ],
        confirmNewPassword: [
            {
                required: true,
                message: '请输入确认密码',
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

    return {
        form,
        formRef,
        rules,
    };
}
