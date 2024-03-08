import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import download from '@/utils/uni-download';
import { getStorage, saveStorage, removeStorage } from '@/utils/uni-storage';
import RequestAPI from '@/api/login/index';
import {
    LOCAL_BASE_URL_KEY,
    // LOCAL_LANGUAGE_KEY,
    LOCAL_PERMISSION_KEY,
    LOCAL_TOKEN_KEY,
    LOCAL_USER_INFO_KEY,
} from '@/constant/global';
// import checkUpdates from '@/uni_modules/uni-upgrade-center-app/utils/check-update';

export default function useIndex() {
    const i18 = useI18n();

    /**
     * 展示信息
     */
    const userInfo = ref<Record<string, string>>({
        account: '',
        userName: '',
        roles: '',
        organizationName: '',
        version: '',
        printBrand: '',
        baseUrl: '',
        // language: getStorage(LOCAL_LANGUAGE_KEY) || 'zh-cn',
        language: uni.getLocale(),
    });

    /**
     * icon style
     */
    const iconStyle = ref({ fontSize: '40rpx' });

    /**
     * 语言数组
     */
    const languageList = [
        { label: '中文简体', value: 'zh-Hans' },
        { label: '中文繁体', value: 'zh-Hant' },
        { label: '英文', value: 'en' },
    ];

    /**
     * 下载进度弹窗是否展示
     */
    const showProgressModal = ref<boolean>(false);

    /**
     * 下载进度
     */
    const downloadProgress = ref<string>('');

    /**
     * 设置语言
     */
    function setLanguage(obj: any) {
        i18.locale.value = obj.value;
        uni.setLocale(obj.value);
    }

    /**
     * 修改密码
     */
    function handleChangePassword() {
        uni.navigateTo({
            url: `/pages/setting/change-passward`,
        });
    }

    /**
     * 更新版本
     */
    async function checkUpdate() {
        // uni-admin
        // #ifdef APP-PLUS
        // try {
        //     await checkUpdates();
        // } catch (error: any) {
        //     showToast(error.result.message);
        // }
        // #endif

        // #ifdef APP-PLUS
        download(
            'http://121.41.28.31:9000/lvling/lvling-cs.apk',
            {},
            (e: string) => {
                {
                    showProgressModal.value = true;
                    downloadProgress.value = e;
                }
            },
            () => {
                showProgressModal.value = false;
            },
        );
        // #endif
    }

    /**
     * 退出登录
     */
    function showLogout() {
        uni.showModal({
            title: '',
            content: '是否确认退出登录？',
            success: res => {
                if (res.confirm) {
                    confirmLogout();
                }
            },
        });
    }

    /**
     * 确认退出
     */
    async function confirmLogout() {
        const res = await RequestAPI.logout();

        if (res) {
            // clearStorage();
            removeStorage(LOCAL_BASE_URL_KEY);
            removeStorage(LOCAL_TOKEN_KEY);
            removeStorage(LOCAL_PERMISSION_KEY);
            removeStorage('BrandAndLanguage');
            uni.reLaunch({ url: '/pages/login/index' });
        }
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
     * 组件挂载
     */
    onMounted(() => {
        userInfo.value.baseUrl = getStorage(LOCAL_BASE_URL_KEY);
        userInfo.value.account = getStorage(LOCAL_USER_INFO_KEY)?.account;
        userInfo.value.userName = getStorage(LOCAL_USER_INFO_KEY)?.userName;
        userInfo.value.roles = getStorage(LOCAL_USER_INFO_KEY)?.roles?.toString();
        userInfo.value.organizationName = getStorage(LOCAL_USER_INFO_KEY)?.companyName;
        userInfo.value.printBrand = getStorage('BrandAndLanguage')?.brand;

        // 获取应用版本
        // #ifdef APP-PLUS
        plus.runtime.getProperty(plus.runtime.appid as string, wgtinfo => {
            userInfo.value.version = wgtinfo.version as string;
        });
        // #endif
    });

    return {
        userInfo,
        iconStyle,
        languageList,
        showProgressModal,
        downloadProgress,
        setLanguage,
        showLogout,
        checkUpdate,
        handleChangePassword,
        handleBlur,
    };
}
