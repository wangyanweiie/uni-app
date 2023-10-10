import { onMounted, ref } from 'vue';
import menuAPI from '@/api/menu-list';
import RequestAPI from '@/api/login/index';
import { saveStorage } from '@/utils/uni-storage';

import cloud from '@/assets/images/login_cloud.png';
import order from '@/assets/images/login_order.png';
import sale from '@/assets/images/login_sale.png';
import analysis from '@/assets/images/login_analysis.png';
import { Brand, PrinterLanguage } from '@/components/x-print-modal/use-print';
import { LOCAL_BASE_URL_KEY, LOCAL_PERMISSION_KEY, LOCAL_TOKEN_KEY, LOCAL_USER_INFO_KEY } from '@/constant/global';

interface loginForm {
    account: string;
    password: string;
    companyId: string;
    baseUrl: string;
}

/**
 * useLogin
 */
export default function useLogin() {
    /**
     * 图片列表
     */
    const imageList = ref<any>({
        cloud: cloud,
        order: order,
        sale: sale,
        analysis: analysis,
    });

    /**
     * form ref
     */
    const formRef = ref();

    /**
     * 表单
     */
    const form = ref<loginForm>({
        account: '',
        password: '',
        companyId: '',
        baseUrl: import.meta.env.VITE_API_URL,
    });

    /**
     * 校验规则
     */
    const rules = ref({
        account: [{ required: true, message: '用户名不能为空' }],
        password: [{ required: true, message: '密码不能为空' }],
        companyId: [{ required: true, message: '组织不能为空' }],
        baseUrl: [{ required: true, message: 'BASE_URL 不能为空' }],
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
     * 改变 baseUrl
     */
    function handleBlur(e: string) {
        if (!e) {
            return;
        }

        saveStorage(LOCAL_BASE_URL_KEY, e);
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

        saveStorage(LOCAL_TOKEN_KEY, res.data.token);
        saveStorage(LOCAL_USER_INFO_KEY, res.data);
        saveStorage(LOCAL_PERMISSION_KEY, res.data?.appPerms);
        saveStorage('BrandAndLanguage', {
            brand: Brand.Zebra,
            printLanguage: PrinterLanguage.ZPL,
        });

        // 跳转页面
        uni.switchTab({ url: '/pages/index/index' });
    };

    /**
     * 页面挂载
     */
    onMounted(() => {
        saveStorage(LOCAL_BASE_URL_KEY, import.meta.env.VITE_API_URL);
        getCompanyName();
    });

    return {
        form,
        formRef,
        rules,
        imageList,
        companyList,
        handleBlur,
        login,
    };
}
