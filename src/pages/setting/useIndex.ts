import { clearToken, getStorage } from '@/utils/uni-storage';
import { onMounted, ref } from 'vue';
import { showToast } from '@/utils/messageTip';
import download from '@/utils/uni-download';
import RequestAPI from '@/api/login/index';
import { BASE_URL } from '@/constant/index';
// import checkUpdates from '@/uni_modules/uni-upgrade-center-app/utils/check-update';

export default function useIndex() {
    /**
     * 展示信息
     */
    const userInfo = ref<any>({
        account: '',
        userName: '',
        roles: '',
        version: '',
        organizationName: '',
        api: '',
    });

    /**
     * icon style
     */
    const iconStyle = ref<any>({ fontSize: '40rpx' });

    /**
     * 下载进度弹窗是否展示
     */
    const showProgressModal = ref<boolean>(false);

    /**
     * 下载进度
     */
    const downloadProgress = ref<string>('');

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
            clearToken();
            uni.reLaunch({ url: '/pages/login/index' });
        }
    }

    /**
     * 组件挂载
     */
    onMounted(() => {
        userInfo.value.account = getStorage('userInfo')?.account;
        userInfo.value.userName = getStorage('userInfo')?.userName;
        userInfo.value.organizationName = getStorage('userInfo')?.companyName;
        userInfo.value.roles = getStorage('userInfo')?.roles?.toString();
        userInfo.value.api = BASE_URL;

        // 获取应用版本
        // #ifdef APP-PLUS
        plus.runtime.getProperty(plus.runtime.appid as string, wgtinfo => {
            userInfo.value.version = wgtinfo.version;
        });
        // #endif
    });

    return {
        userInfo,
        iconStyle,
        showProgressModal,
        downloadProgress,
        showLogout,
        checkUpdate,
        handleChangePassword,
    };
}
