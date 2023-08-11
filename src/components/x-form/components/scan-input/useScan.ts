import { ref, onMounted, onUnmounted } from 'vue';

export default function useScan(handlePDAScan: (code: string) => void) {
    /**
     * 原生对象
     */
    const nativeMain = ref<any>(null);

    /**
     * 接收器
     */
    const receiver = ref<PlusAndroidInstanceObject | null>(null);

    /**
     * 接收函数
     */
    function doReceive(context: any, intent: any) {
        plus.android.importClass(intent);
        const code = intent.getStringExtra(import.meta.env.VITE_APP_NATIVE_SCANNER_DATA);
        const codeType = intent.getStringExtra(import.meta.env.VITE_APP_NATIVE_CODE_TYPE);

        console.log('扫码结果:', code, codeType);

        handlePDAScan(code ?? '');
    }

    /**
     * 初始化广播扫码并监听
     */
    function initAddlisten() {
        if (!nativeMain.value) {
            // 获取原生对象
            nativeMain.value = plus.android.runtimeMainActivity();
        }

        if (!receiver.value) {
            console.log('doReceive');

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

        console.log('监听成功');
    }

    /**
     * 页面挂载后，调用 initAndListen() 方法，进行初始化广播扫码并监听
     */
    onMounted(() => {
        // 判断编译环境是在哪个平台
        // #ifdef H5
        // console.log('只有h5平台才有方法');
        // #endif
        // #ifdef APP-PLUS
        // console.log('只有APP平台才有的方法');
        initAddlisten();
        // #endif
    });

    /**
     * 页面销毁后，注销监听，和initAndListen()方法配套使用
     */
    onUnmounted(() => {
        // #ifdef APP-PLUS
        console.log('app下 注销了');
        nativeMain.value.unregisterReceiver(receiver.value);
        // #endif
    });

    return {};
}
