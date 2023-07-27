import { onMounted, ref } from 'vue';
import menuAPI from '@/api/menu-list';
import RequestAPI from '@/api/login/index';
import { getStorage, saveStorage } from '@/utils/uni-storage';

import cloud from '@/assets/images/login_cloud.png';
import order from '@/assets/images/login_order.png';
import sale from '@/assets/images/login_sale.png';
import analysis from '@/assets/images/login_analysis.png';

interface loginForm {
    account: string;
    password: string;
    companyId: string;
}

/**
 * useLogin
 */
export default function useLogin() {
    const imageList = ref<any>({
        cloud: cloud,
        order: order,
        sale: sale,
        analysis: analysis,
    });

    const formRef = ref();

    const form = ref<loginForm>({
        account: '',
        password: '',
        companyId: '',
    });

    const rules = ref({
        account: [
            {
                required: true,
                message: '用户名不能为空',
            },
        ],
        password: [
            {
                required: true,
                message: '密码不能为空',
            },
        ],
        companyId: [
            {
                required: true,
                message: '组织不能为空',
            },
        ],
    });

    /**
     * 组织下拉列表
     */
    const companyList = ref<any[]>([]);

    /**
     * 请求公司下拉列表
     */
    async function getCompanyName() {
        const res = await menuAPI.getCompany();

        if (!res) {
            return false;
        }

        companyList.value = res.data;
    }

    /**
     * 登录
     */
    const login = async () => {
        // 表单校验
        await formRef.value.validate();

        // 校验通过
        const res: any = await RequestAPI.login({
            account: form.value.account,
            password: form.value.password,
            companyId: form.value.companyId,
        });

        if (!res) {
            return;
        }

        // 存储 token 与 用户信息到本地
        saveStorage('token', res.data.token);
        saveStorage('userInfo', res.data);

        // 跳转页面
        uni.switchTab({ url: '/pages/index/index' });
    };

    /**
     * 页面挂载
     */
    onMounted(() => {
        getCompanyName();
    });

    return {
        form,
        formRef,
        rules,
        imageList,
        companyList,
        login,
    };
}
