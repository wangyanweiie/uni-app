/**
 * uni BLE 蓝牙类
 */
export class UniBluetooth {
    SEND_SIZE: number;
    CODE_INFO: any;

    constructor(options: any = {}) {
        this.SEND_SIZE = options.sendSize ?? 200;
        this.CODE_INFO = {
            0: '正常',
            10000: '未初始化蓝牙适配器',
            10001: '当前蓝牙适配器不可用',
            10002: '没有找到指定设备',
            10003: '连接失败',
            10004: '没有找到指定服务',
            10005: '没有找到指定特征值',
            10006: '当前连接已断开',
            10007: '当前特征值不支持此操作',
            10008: '其余所有系统上报的异常',
            10009: 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
            10010: '已连接',
            10011: '配对设备需要配对码',
            10012: '连接超时',
            10013: '连接 deviceId 为空或者是格式不正确',
        };
    }

    /**
     * 是否为 uni 环境
     */
    uniAvailable() {
        if (uni) {
            return true;
        }

        return false;
    }

    /**
     * 开启蓝牙
     * @returns { Promise<any> } 响应结果
     */
    openBluetoothAdapter() {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.openBluetoothAdapter({
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 获取蓝牙适配状态
     * @returns { Promise<any> } 响应结果
     */
    getBluetoothAdapterState() {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.getBluetoothAdapterState({
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 开始搜索蓝牙
     * @param option
     * @returns { Promise<any> } 响应结果
     */
    startBluetoothDevicesDiscovery(options: any) {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.startBluetoothDevicesDiscovery({
                ...options,
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 停止搜索蓝牙
     * @returns { Promise<any> } 响应结果
     */
    stopBluetoothDevicesDiscovery() {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.stopBluetoothDevicesDiscovery({
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 监听寻找到新设备的事件
     * @param callback 回调函数返回新搜索到的设备列表
     */
    onBluetoothDeviceFound(callback: any) {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        uni.onBluetoothDeviceFound(callback);
    }

    /**
     * 连接低功率蓝牙设备
     * @param 设备ID
     * @params 超时时间，单位ms
     * @returns { Promise<any> } 响应结果
     */
    createBLEConnection(deviceId = '', timeout = 10000) {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.createBLEConnection({
                deviceId,
                timeout,
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 关闭低功率蓝牙
     * @param 设备ID
     * @returns { Promise<any> } 响应结果
     */
    closeBLEConnection(deviceId = '') {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.closeBLEConnection({
                deviceId,
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 监听低功耗蓝牙连接状态的改变事件
     * @param callback
     */
    onBLEConnectionStateChange(callback: any) {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        uni.onBLEConnectionStateChange(callback);
    }

    /**
     * 获取低功率蓝牙服务
     * @param 设备ID
     * @returns { Promise<any> } 响应结果
     */
    getBLEDeviceServices(deviceId = '') {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.getBLEDeviceServices({
                deviceId,
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 获取低功率蓝牙服务特征值
     * @param deviceId 蓝牙设备 ID
     * @param serviceId 蓝牙可写服务的 UUID
     * @returns { Promise<any> } 响应结果
     */
    getBLEDeviceCharacteristics(deviceId = '', serviceId = '') {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.getBLEDeviceCharacteristics({
                deviceId,
                serviceId,
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 向低功率蓝牙写入数据
     * @param deviceId 蓝牙设备 ID
     * @param serviceId 蓝牙特征值对应服务的 UUID
     * @param characteristicId 蓝牙特征值的 UUID
     * @param value 蓝牙设备特征值对应的二进制值
     * @returns { Promise<any> } 响应结果
     */
    writeBLECharacteristicValue(deviceId: string, serviceId: string, characteristicId: string, value: any) {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.writeBLECharacteristicValue({
                deviceId,
                serviceId,
                value,
                characteristicId,
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 切分数据
     */
    splitBuffer(data: any) {
        const result = [];

        // buffer 长度
        const { length } = data;

        // 按照预先设定的 SEND_SIZE，切分 Buffer
        for (let i = 0; i < length; i += this.SEND_SIZE) {
            if (i + this.SEND_SIZE >= length) {
                result.push(data.slice(i, length));
            } else {
                result.push(data.slice(i, i + this.SEND_SIZE));
            }
        }

        return result;
    }

    /**
     * 连续写入
     * @param deviceId 蓝牙设备 ID
     * @param serviceId 蓝牙特征值对应服务的 UUID
     * @param characteristicId 蓝牙特征值的 UUID
     * @param value 蓝牙设备特征值对应的二进制值
     * @param gap 延时时间
     * @returns { Promise<any> } 响应结果
     */
    async writeBLECharacteristicValueAll(
        deviceId: string,
        serviceId: string,
        characteristicId: string,
        value: any,
        gap = 100,
    ) {
        return new Promise((resolve, reject) => {
            const unit8buff = Array.from(value);

            let times = 0;

            // 切分数据 => 分包发送
            const buffers = this.splitBuffer(unit8buff);

            // 发送
            const sendData = () => {
                // 全部发送完毕结束
                if (times >= buffers.length) {
                    resolve(true);
                    return true;
                }

                // 每次发送的数据
                const data = buffers[times];

                /**
                 * 创建一个字节长度为 data.length 的 ArrayBuffer 实例
                 * 对于 ArrayBuffer，不会直接对它本身进行操作，而是通过 DataView 和 TypedArray 操作，DataView 提供了对于 ArrayBufffer 各种类型的读写操作
                 */
                const buffer = new ArrayBuffer(data.length);
                const dataView = new DataView(buffer);

                // 在相对于视图开始处的指定字节偏移量位置处存储 Uint8 值
                for (let i = 0; i < data.length; i += 1) {
                    dataView.setUint8(i, data[i]);
                }

                // 向低功耗蓝牙写入数据
                this.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, buffer)
                    .then(() => {
                        setTimeout(() => {
                            times += 1;
                            sendData();
                        }, gap);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });

                return true;
            };

            // 开始发送
            sendData();
        });
    }

    /**
     * 获取蓝牙可写服务和特征值
     * @param deviceId 蓝牙设备 ID
     * @returns { Promise<any> } 响应结果
     */
    async getWriteableServiceAndCharacteristicList(deviceId = '') {
        return new Promise((resolve, reject) => {
            // 获取低功率蓝牙服务
            this.getBLEDeviceServices(deviceId)
                .then((res: any) => {
                    const { services } = res;

                    // 获取低功率蓝牙服务特征值
                    Promise.all(
                        services.map((service: any) => this.getBLEDeviceCharacteristics(deviceId, service.uuid)),
                    )
                        .then(charRes => {
                            const result: any = [];

                            // 筛选出可写特征值
                            charRes.forEach((item, index) => {
                                item.characteristics.forEach((characteristic: any) => {
                                    // 特征值是否可写
                                    if (characteristic.properties.write) {
                                        result.push({
                                            serviceId: services[index].uuid,
                                            characteristicId: characteristic.uuid,
                                        });
                                    }

                                    // 订阅特征值变化
                                    // if (characteristic.properties.notify
                                    //     ?? characteristic.properties.indicate
                                    // ) {
                                    //     uni.notifyBLECharacteristicValueChange({
                                    //         deviceId,
                                    //         serviceId: services[index].uuid,
                                    //         characteristicId: characteristic.uuid,
                                    //         state: true,
                                    //         success: (notifyRes) => {
                                    //             console.log('NOTIFY SUCCESS', notifyRes);
                                    //         },
                                    //         fail: (notifyErr) => {
                                    //             console.log('NOTIFY ERROR: ', notifyErr);
                                    //         },
                                    //     });
                                    // }
                                });
                            });

                            resolve(result);
                        })
                        .catch((charRes: any) => {
                            reject(charRes);
                        });
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    /**
     * 监听低功耗蓝牙设备的特征值变化事件
     * @param callback
     */
    onBLECharacteristicValueChange(callback: any) {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        uni.onBLECharacteristicValueChange(callback);
    }

    /**
     * 关闭蓝牙模块
     * @returns { Promise<any> } 响应结果
     */
    closeBluetoothAdapter() {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve, reject) => {
            uni.closeBluetoothAdapter({
                success: (res: any) => {
                    console.log('CLOSE: ', res);
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        });
    }

    /**
     * 获取已连接蓝牙
     * @returns { Promise<any> } 响应结果
     */
    getConnectedBluetoothDevices() {
        if (!this.uniAvailable()) {
            throw new Error('非UNI环境');
        }

        return new Promise((resolve: any, reject: any) => {
            uni.getConnectedBluetoothDevices({
                success: (res: any) => {
                    resolve(res);
                },
                fail: (err: any) => {
                    reject(err);
                },
            } as any);
        });
    }

    /**
     * 信息提示
     * @param { number } code 编码
     */
    transferErrorCode(code: string) {
        return this.CODE_INFO[`${code}`] ?? '未知错误';
    }
}
