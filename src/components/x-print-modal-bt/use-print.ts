import { ref } from 'vue';
import plugintest from '@/utils/print-plugin.js';

interface PrintDevice {
    bluetoothName: string;
    bluetoothMac: string;
}

export default function usePrint() {
    /**
     * 打印设备列表
     */
    const devices = ref<PrintDevice[]>([]);

    /**
     * 当前打印设备
     */
    const currentDevice = ref<PrintDevice>({
        bluetoothName: '',
        bluetoothMac: '',
    });

    /**
     * 获取蓝牙 MAC 地址
     */
    async function handleSavePrintServiceMAC() {
        plugintest.GetBlueToothListFunction(
            '',
            (result: any) => {
                devices.value = JSON.parse(JSON.stringify(result)).map((item: any) => {
                    item = {
                        bluetoothMac: item.bluetoothMac,
                        bluetoothName: item.bluetoothName,
                    };
                    return item;
                });
            },
            () => {
                uni.showToast({
                    title: '暂无打印设备',
                    duration: 2000,
                });
            },
        );
    }

    /**
     * 蓝牙连接次数
     */
    const connTimes = ref(0);

    /**
     * 连接蓝牙 MAC 地址
     */
    function handleConnectServiceMAC(e: any, mask = true) {
        if (connTimes.value == 0) {
            uni.showToast({
                title: '蓝牙连接中...',
                duration: 10000,
            });
        }

        connTimes.value += 1;

        const printerData = {
            bluetoothName: '',
            bluetoothMac: '',
            data: '',
        };

        printerData.bluetoothName = e.bluetoothName;
        printerData.bluetoothMac = e.bluetoothMac;

        plugintest.ConnBluetoothFunction(
            // 打印数据
            printerData,
            // 成功回调
            (result: any) => {
                if (JSON.stringify(result) === '["1"]') {
                    connTimes.value = 0;

                    // 保存蓝牙名称和 MAC 地址
                    currentDevice.value = {
                        bluetoothName: printerData.bluetoothName,
                        bluetoothMac: printerData.bluetoothMac,
                    };

                    uni.showToast({
                        title: '蓝牙连接成功！',
                        duration: 2000,
                    });
                } else if (JSON.stringify(result) === '["3"]') {
                    currentDevice.value = {
                        bluetoothName: '',
                        bluetoothMac: '',
                    };

                    if (connTimes.value > 5) {
                        uni.showToast({
                            title: '打印机异常，请重新连接！',
                            duration: 2000,
                        });

                        return;
                    }

                    handleConnectServiceMAC(e);
                }
            },
            // 失败回调
            () => {
                currentDevice.value = {
                    bluetoothName: '',
                    bluetoothMac: '',
                };

                if (connTimes.value > 5) {
                    uni.showToast({
                        title: '蓝牙连接失败，请重新连接！',
                        duration: 2000,
                    });
                    return;
                }

                handleConnectServiceMAC(e);
            },
        );
    }

    /**
     * 打印
     */
    async function handlePrintServiceMAC(printString: Record<string, unknown>[]) {
        const printerData = {
            bluetoothName: '',
            bluetoothMac: '',
            data: printString,
        };

        printerData.bluetoothName = currentDevice.value.bluetoothName;
        printerData.bluetoothMac = currentDevice.value.bluetoothMac;

        const returnResult = ref<boolean>(true);

        await plugintest.AddPrintFunction(
            printerData,
            (result: any) => {
                // 3、打印机异常
                if (JSON.stringify(result) === '["3"]') {
                    uni.showToast({
                        title: '打印机异常，请重新连接！',
                        type: 'warning',
                        duration: 1000,
                    });

                    returnResult.value = false;
                } else if (JSON.stringify(result) === '["5"]') {
                    uni.showToast({
                        title: '打印成功！',
                        type: 'success',
                        duration: 1000,
                    });

                    returnResult.value = true;
                } else if (JSON.stringify(result) === '["1"]') {
                    uni.showToast({
                        title: '蓝牙重新连接成功, 请再次点击蓝牙打印！',
                        type: 'success',
                        duration: 1000,
                    });

                    returnResult.value = false;
                }
            },
            (result: any) => {
                // 3、打印机异常
                if (JSON.stringify(result) === '["3"]') {
                    uni.showToast({
                        title: '打印机异常，请重新连接！',
                        type: 'warning',
                    });

                    returnResult.value = false;
                }
            },
        );
        return returnResult.value;
    }

    /**
     * 当前选中的打印设备
     */
    function activeClass(device: PrintDevice, activeClassName: string): string {
        return currentDevice.value?.bluetoothMac === device.bluetoothMac ? activeClassName : '';
    }

    return {
        devices,
        handleSavePrintServiceMAC,
        handleConnectServiceMAC,
        handlePrintServiceMAC,
        activeClass,
    };
}
