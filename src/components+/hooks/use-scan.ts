import { onUnmounted, onMounted, ref } from 'vue';

/**
 * 扫码结果类型
 */
export interface ScanResult {
    /** 扫码结果 */
    code: string;
    /** 扫码类型 */
    codeType?: string;
}

/**
 * 扫码回调函数类型
 */
export type ScanCodeHook = (data: ScanResult) => void;

/**
 * use-scan
 * @params scanCodeHook 扫码回调
 */
export function useScan(scanCodeHook: ScanCodeHook) {
    // 扫码标识
    const scanFlag = ref<boolean>(false);

    // 原生对象
    const nativeMain = ref<any>(null);

    // 接收器
    const receiver = ref<PlusAndroidInstanceObject | null>(null);

    /**
     * 接收函数
     */
    function doReceive(context: any, intent: any) {
        plus.android.importClass(intent);
        const code = intent.getStringExtra(import.meta.env.VITE_APP_NATIVE_SCANNER_DATA);
        const codeType = intent.getStringExtra(import.meta.env.VITE_APP_NATIVE_CODE_TYPE);

        console.log('Scan Result', code, codeType);

        const res: ScanResult = {
            code,
            codeType,
        };

        if (scanFlag.value) {
            scanCodeHook(res);
        }
    }

    /**
     * 初始化广播并注册监听
     */
    function initListener(flag: boolean): void {
        scanFlag.value = flag;

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
        const filter = new IntentFilter();
        filter.addAction(import.meta.env.VITE_APP_BROADCAST_ACTION);

        // 注册监听
        nativeMain.value.registerReceiver(receiver.value, filter);
    }

    /**
     * 注销监听
     */
    function removeListener(): void {
        scanFlag.value = false;
        nativeMain.value.unregisterReceiver(receiver.value);
    }

    /**
     * 页面挂载
     */
    onMounted(() => {
        // #ifdef APP-PLUS
        initListener(false);
        // #endif
    });

    /**
     * 页面卸载
     */
    onUnmounted(() => {
        // #ifdef APP-PLUS
        removeListener();
        // #endif
    });

    return {
        initListener,
        removeListener,
    };
}
