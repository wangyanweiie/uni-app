import { to } from '@/utils/await-to';
import { UniBluetooth } from '@/utils/uni-bluetooth';
import { ref } from 'vue';
import * as iconv from 'iconv-lite';
import { Buffer } from 'buffer';

/**
 * 打印机品牌常量
 */
export enum Brand {
    Zebra = '斑马(Zebra)',
    Gainscha = '佳博(Gainscha)',
    Deli = '得力(Deli)',
    Unknown = '未知',
}

/**
 * 打印机品牌类型别名
 */
type Brands = `${Brand}`;

/**
 * 打印机品牌类型接口
 */
interface BaseOption {
    brand: Brands;
}

/**
 * 打印机语言
 */
export enum PrinterLanguage {
    TSPL,
    CPCL,
    ZPL,
}

/**
 * 默认编码
 */
const DEFAULT_ENCODING = 'GB18030';

/**
 * 斑马打印机特定可写特征值
 * @description link pdf page 5 top.
 * @link https://www.zebra.com/content/dam/zebra/software/en/application-notes/AppNote-BlueToothLE-v4.pdf
 */
const ZEBRA_WRITABLE_CHARACTERISTIC_ID = '38eb4a82-c570-11e3-9507-0002a5d5c51b';

/**
 * 得力打印机特定可写特征值
 */
const DELI_WRITABLE_CHARACTERISTIC_ID = '49535343-6DAA-4D02-ABF6-19569ACA69FE';

/**
 * 斑马打印机配置
 */
interface ZebraOption extends BaseOption {
    brand: Brand.Zebra;
    printLanguage: PrinterLanguage.CPCL | PrinterLanguage.ZPL;
}

/**
 * 得力打印机配置
 */
interface DeliOption extends BaseOption {
    brand: Brand.Deli;
    printLanguage: PrinterLanguage.TSPL;
}

/**
 * 佳博打印机配置
 */
interface GainschaOption extends BaseOption {
    brand: Brand.Gainscha;
    printLanguage: PrinterLanguage.TSPL | PrinterLanguage.CPCL;
}

/**
 * 未知印机配置
 */
interface UnknownOption extends BaseOption {
    brand: Brand.Unknown;
    printLanguage: PrinterLanguage.TSPL;
}

/**
 * 打印机配置联合类型
 */
export type UsePrintOption = ZebraOption | GainschaOption | DeliOption | UnknownOption;

/**
 * 服务id与特征值id类型接口
 */
interface ServiceIdCharacteristicId {
    /** 服务ID */
    serviceId: string;
    /** 特征值ID */
    characteristicId: string;
}

/**
 * 弹出提示信息
 */
function showToast(message: string = '未知错误') {
    uni.showToast({
        title: message,
        icon: 'none',
        mask: true,
    });
}

/**
 * use print
 * @param option 打印机配置信息
 * @returns
 */
export function usePrint(option: UsePrintOption) {
    console.log('Brand AND Language::', option);

    // 蓝牙实例
    const bluetooth = ref<UniBluetooth>();

    // 蓝牙设备列表
    const devices = ref<any[]>([]);

    // 当前连接的蓝牙设备信息
    const currentDevice = ref<any>();

    /**
     * 开始蓝牙搜索
     */
    async function startBluetoothSearch() {
        if (!bluetooth.value) {
            bluetooth.value = new UniBluetooth({ sendSize: 100 });
        }

        // 获取已连接蓝牙
        const [connectErr, connectRes] = await to(bluetooth.value.getConnectedBluetoothDevices());

        if (connectErr) {
            showToast('未连接蓝牙');
        }

        // 开启蓝牙
        const [openErr] = await to(bluetooth.value.openBluetoothAdapter());

        if (openErr) {
            showToast(bluetooth.value.transferErrorCode(openErr.code));
            return false;
        }

        // 获取蓝牙适配状态
        const [stateErr] = await to(bluetooth.value.getBluetoothAdapterState());

        if (stateErr) {
            showToast(bluetooth.value.transferErrorCode(stateErr.code));
            return false;
        }

        // 监听寻找到新设备的事件
        bluetooth.value.onBluetoothDeviceFound((discoveredDevices: any) => {
            devices.value.push(
                ...discoveredDevices.devices.filter((device: any) => {
                    const duplicated = devices.value.some(findDevice => findDevice.deviceId === device.deviceId);

                    return !duplicated && device.name;
                }),
            );
        });

        // 开始搜索蓝牙
        const [searchErr] = await to(
            bluetooth.value.startBluetoothDevicesDiscovery({
                // 是否允许重复上报同一设备
                allowDuplicatesKey: false,
            }),
        );

        if (searchErr) {
            showToast('开始搜索失败');
            return false;
        }

        return true;
    }

    /**
     * 停止搜索蓝牙
     */
    async function stopBluetoothSearch() {
        const [err] = await to(bluetooth.value?.stopBluetoothDevicesDiscovery());

        if (err) {
            showToast('停止搜索失败');
            return false;
        }

        return true;
    }

    /**
     * 当前激活的蓝牙设备
     */
    function activeClass(device: any, activeClassName: string): string {
        return currentDevice.value?.deviceId === device.deviceId ? activeClassName : '';
    }

    /**
     * 连接蓝牙
     * @param device 设备信息
     */
    async function connectBluetooth(device: any) {
        uni.showLoading({
            title: '正在连接蓝牙',
            mask: true,
        });

        // 连接低功率蓝牙设备
        const [err] = await to(bluetooth.value?.createBLEConnection(device.deviceId));

        if (err) {
            // 信息提示
            showToast(bluetooth.value?.transferErrorCode(err.code));
            uni.hideLoading();
            return false;
        }

        uni.hideLoading();
        showToast(`已连接至蓝牙: ${device.name}`);

        // 保存当前连接的蓝牙设备信息
        currentDevice.value = device;

        const [stopErr] = await to(bluetooth.value?.stopBluetoothDevicesDiscovery());

        if (stopErr) {
            showToast('停止搜索失败');
        }

        return true;
    }

    /**
     * 获取可写服务ID和特征值IDs
     * @param serviceList 可写蓝牙设备列表
     * @return { serviceId, characteristicId }
     */
    function getServiceIdAndCharacteristicId(serviceList: any[]): ServiceIdCharacteristicId {
        console.log('SERVER LIST: ', serviceList);

        // ZEBRA
        if (option.brand === Brand.Zebra) {
            const matchedCharacteristic = serviceList.find(
                char => char.characteristicId.toLowerCase() === ZEBRA_WRITABLE_CHARACTERISTIC_ID,
            );

            // error
            if (!matchedCharacteristic) {
                return {
                    serviceId: '',
                    characteristicId: '',
                };
            }

            const { serviceId, characteristicId } = matchedCharacteristic;

            return {
                serviceId,
                characteristicId,
            };
        }

        // OTHER
        const { serviceId, characteristicId } = serviceList[0];

        return {
            serviceId,
            characteristicId,
        };
    }

    /**
     * 打印
     * @param printString 打印数据
     * @param rowData 位图数据
     * @param encoding 编码格式
     */
    async function print(
        printString: string | string[] = '123',
        rowData?: Buffer,
        encoding: string = DEFAULT_ENCODING,
    ) {
        if (!currentDevice.value) {
            showToast('未连接至打印机');
            return false;
        }

        const { deviceId } = currentDevice.value;

        // 获取蓝牙可写服务和特征值
        const [err, res] = await to(bluetooth.value?.getWriteableServiceAndCharacteristicList(deviceId));

        if (err ?? !res) {
            showToast('获取可写特征值列表失败');
            return false;
        }

        if (!res.length) {
            showToast('设备蓝牙不可写');
            return false;
        }

        // 获取可写服务ID和特征值IDs
        const { serviceId, characteristicId } = getServiceIdAndCharacteristicId(res);

        console.log('CURRENT: ', serviceId, characteristicId, printString);

        // 传输数据
        let data;

        // 转换
        if (typeof printString === 'string') {
            data = iconv.encode(printString, 'GB18030');

            uni.showLoading({
                title: '打印中',
                mask: true,
            });

            // 连续写入进行打印
            const [printErr] = await to(
                bluetooth.value?.writeBLECharacteristicValueAll(deviceId, serviceId, characteristicId, data, 200),
            );

            if (printErr) {
                uni.hideLoading();
                showToast('打印失败');
                return false;
            }

            showToast('打印成功');
            uni.hideLoading();

            return true;
        } else {
            data = Buffer.concat([
                iconv.encode(printString[0], 'GB18030'),
                rowData ?? Buffer.from([]),
                iconv.encode(printString[1], 'GB18030'),
            ]);

            for (let i = 1; i < printString.length; i++) {
                data = Buffer.concat([
                    iconv.encode(printString[0], 'GB18030'),
                    rowData ?? Buffer.from([]),
                    iconv.encode(printString[i], 'GB18030'),
                ]);

                uni.showLoading({
                    title: '打印中',
                    mask: true,
                });

                // 连续写入进行打印
                const [printErr] = await to(
                    bluetooth.value?.writeBLECharacteristicValueAll(deviceId, serviceId, characteristicId, data, 200),
                );

                if (printErr) {
                    uni.hideLoading();
                    showToast('打印失败');
                    return false;
                }

                showToast('打印成功');
                uni.hideLoading();
            }

            return true;
        }
    }

    /**
     * 断开蓝牙
     */
    async function closeBluetooth(): Promise<void> {
        devices.value = [];

        // 关闭低功耗蓝牙
        const [err] = await to(bluetooth.value?.closeBLEConnection(currentDevice.value.deviceId));

        if (err) {
            showToast('关闭蓝牙失败');
            return;
        }

        const [closeErr] = await to(bluetooth.value?.closeBluetoothAdapter());

        if (closeErr) {
            return;
        }

        return;
    }

    return {
        devices,
        startBluetoothSearch,
        stopBluetoothSearch,
        activeClass,
        connectBluetooth,
        print,
        closeBluetooth,
    };
}
