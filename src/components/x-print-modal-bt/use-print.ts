import { ref } from 'vue';
import plugintest from '@/utils/print-plugin.js';
import { showToast } from '@/utils/uni-message';

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
                showToast('暂无设备');
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
    function handleConnectServiceMAC(e: any) {
        if (connTimes.value == 0) {
            showToast('蓝牙连接中...');
        }

        connTimes.value += 1;

        const printerData = {
            bluetoothName: '',
            bluetoothMac: '',
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

                    showToast('蓝牙连接成功！');
                } else if (JSON.stringify(result) === '["3"]') {
                    currentDevice.value = {
                        bluetoothName: '',
                        bluetoothMac: '',
                    };

                    if (connTimes.value > 5) {
                        showToast('蓝牙连接失败，请重新连接！');
                        return;
                    }

                    handleConnectServiceMAC(e);
                }
            },
            // 失败回调
            (result: any) => {
                if (JSON.stringify(result) === '["3"]') {
                    currentDevice.value = {
                        bluetoothName: '',
                        bluetoothMac: '',
                    };

                    if (connTimes.value > 5) {
                        showToast('蓝牙连接失败，请重新连接！');
                        return;
                    }

                    handleConnectServiceMAC(e);
                }
            },
        );
    }

    /**
     * 打印方法
     */
    async function handlePrintServiceMAC(data: Record<string, unknown>) {
        console.log('handlePrintServiceMAC', data);

        const printerData = { ...data };

        printerData.bluetoothName = currentDevice.value.bluetoothName;
        printerData.bluetoothMac = currentDevice.value.bluetoothMac;

        const returnResult = ref<boolean>(true);

        await plugintest.AddPrintFunction(
            // 打印数据
            printerData,
            // 成功回调
            (result: any) => {
                if (JSON.stringify(result) === '["4"]') {
                    showToast('打印失败，请重试！');
                    returnResult.value = false;
                } else if (JSON.stringify(result) === '["2"]') {
                    showToast('打印成功！');
                    returnResult.value = true;
                }
            },
            // 失败回调
            (result: any) => {
                if (JSON.stringify(result) === '["4"]') {
                    showToast('打印失败，请重试！');
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
