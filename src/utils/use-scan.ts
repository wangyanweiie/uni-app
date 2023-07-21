import { onMounted, ref, onUnmounted } from 'vue';
import { showToast } from '@/utils/messageTip';

export default function useScan(searchCode: (code: string) => void) {
    /**
     ******************** 1.回车/失焦事件 ********************
     */
    // 回车
    function handleEnter(code: string) {
        if (!code) {
            console.log(code);
            showToast('扫码框的值不能为空');
            return;
        }

        // 调用查询方法
        searchCode(code);
    }

    // 失焦
    function handleBlur(code: string) {
        // if (!code) {
        //     console.log(code);
        //     showToast('扫码框的值不能为空');
        //     return;
        // }

        // 调用查询方法
        searchCode(code);
    }

    /**
     ******************** 2.相机扫码事件 ********************
     */
    function handlePhotoScan() {
        let code: string;

        // #ifdef APP-PLUS
        uni.scanCode({
            onlyFromCamera: true,
            scanType: ['qrCode', 'barCode'],
            success: ({ result }) => {
                code = result;
            },
            fail: (error) => {
                uni.showToast({
                    title: '不可扫码',
                    icon: 'none',
                    duration: 1500,
                });
            },
            complete: () => {
                // 调用扫码查询
                if (code) {
                    searchCode(code);
                }
            },
        });
        // #endif
    }

    /**
     ******************** 3.扫码枪相关 ********************
     */
    /**
     * 原生对象
     */
    const nativeMain = ref<any>(null);

    /**
     * 接收器
     */
    const receiver = ref<PlusAndroidInstanceObject | null>(null);

    /**
     * 初始化广播扫码并监听
     */
    function initAndListen() {
        if (!nativeMain.value) {
            // 获取原生对象
            nativeMain.value = plus.android.runtimeMainActivity();
        }

        if (!receiver.value) {
            receiver.value = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
                onReceive: doReceive,
            });
        }

        // 监听扫描
        const IntentFilter: any = plus.android.importClass('android.content.IntentFilter');
        const filter: any = new IntentFilter();
        filter.addAction(import.meta.env.VITE_APP_BROADCAST_ACTION);

        // 注册监听
        nativeMain.value.registerReceiver(receiver.value, filter);
    }

    /**
     * 接收函数
     */
    function doReceive(context: any, intent: any) {
        plus.android.importClass(intent);
        const code = intent.getStringExtra(import.meta.env.VITE_APP_NATIVE_SCANNER_DATA);
        const codeType = intent.getStringExtra(import.meta.env.VITE_APP_NATIVE_CODE_TYPE);

        console.log('扫码结果:', code, codeType);

        handlePDAScan(code || '');
    }

    /**
     * 处理扫码枪扫码事件
     */
    function handlePDAScan(code: string) {
        if (!code) {
            showToast('扫码框的值不能为空');
            return;
        }

        // 调用查询方法
        searchCode(code);
    }

    /**
     * 页面挂载后，调用 initAndListen() 方法，进行初始化广播扫码并监听
     */
    onMounted(() => {
        // #ifdef H5
        // console.log('H5');
        // #endif
        // #ifdef APP-PLUS
        // console.log('APP-PLUS');
        initAndListen();
        // #endif
    });

    /**
     * 页面销毁后，注销监听，和initAndListen()方法配套使用
     */
    onUnmounted(() => {
        // #ifdef APP-PLUS
        nativeMain.value.unregisterReceiver(receiver.value);
        // #endif
    });

    return {
        handleEnter,
        handleBlur,
        handlePhotoScan,
    };
}
