import { nextTick, onBeforeMount, ref } from 'vue';
import type { Props, RequestObj } from '../interface';
import { SCAN_MODE } from '../const';

export default function useIndex(props: Props, emit: any) {
    /**
     * 输入框的值
     */
    const inputValue = ref<string | number>('');

    /**
     * 输入框聚焦状态
     */
    const focusStatus = ref<boolean>(false);

    /**
     * 输入框清空回调
     */
    function handleClear() {
        inputValue.value === '';

        emit('handleEmit', {
            value: '',
            schema: props.schema,
            isClear: true,
        });
    }

    /**
     * 输入框点击回车回调
     */
    function handleConfirm() {
        if (inputValue.value === '') {
            uni.showToast({
                title: '当前输入框的值为空',
                icon: 'none',
            });
            return;
        }

        handleSearchCode(inputValue.value);
    }

    /**
     * @description 处理扫码枪扫码事件
     * @param code 扫码后返回的code
     */
    function handlePDAScan(code: string) {
        // 失焦不调用扫码
        if (!focusStatus.value) {
            return;
        }

        // 手动赋值到扫码框
        inputValue.value = code;

        handleSearchCode(code);
    }

    /**
     * @description 扫码或者确认后方法
     * @param code 输入框的值
     */
    async function handleSearchCode(code: string | number) {
        if (code === '') {
            uni.showToast({
                title: '当前输入框的值为空',
                icon: 'none',
            });
            return;
        }

        if (!props.schema.api) {
            uni.showToast({
                title: '请先配置查询接口',
                icon: 'none',
            });
            return;
        }

        // 查询接口入参
        const parmas: Record<string, string | number> = {
            ...props.schema.apiParams,
            [props.schema.prop]: code,
        };

        // 调用查询接口
        const res: RequestObj = await props.schema.api(parmas);

        if (res) {
            handleSuccess(code, res);
        } else {
            setTimeout(() => {
                handleError(code);
            }, 500);
        }
    }

    /**
     * @description 查询成功处理
     * @param res 扫码成功后接口返回的值
     */
    function handleSuccess(code: string | number, res: RequestObj) {
        console.log('扫码成功');

        switch (props.schema?.scanCodeMode) {
            case SCAN_MODE.MODE_ONE:
            case SCAN_MODE.MODE_TWO:
            case SCAN_MODE.MODE_FIVE:
                emit('handleScanSuccess', {
                    value: code,
                    result: res.data,
                    schema: props.schema,
                    reset: false,
                });
                break;

            case SCAN_MODE.MODE_THREE:
            case SCAN_MODE.MODE_FOUR:
                inputValue.value = '';
                resetFocus();
                emit('handleScanSuccess', {
                    value: code,
                    result: res.data,
                    schema: props.schema,
                    reset: true,
                });
                break;
        }
    }

    /**
     * 查询失败处理
     */
    function handleError(code: string | number) {
        console.log('扫码失败');

        switch (props.schema?.scanCodeMode) {
            case SCAN_MODE.MODE_ONE:
                emit('handleScanFail', {
                    value: code,
                    schema: props.schema,
                    reset: false,
                });
                break;

            case SCAN_MODE.MODE_TWO:
                inputValue.value = '';
                resetFocus();
                emit('handleScanFail', {
                    value: code,
                    schema: props.schema,
                    reset: true,
                });
                break;

            case SCAN_MODE.MODE_THREE:
                emit('handleScanFail', {
                    value: code,
                    schema: props.schema,
                    reset: false,
                });
                break;

            case SCAN_MODE.MODE_FOUR:
                inputValue.value = '';
                resetFocus();
                emit('handleScanFail', {
                    value: code,
                    schema: props.schema,
                    reset: true,
                });
                break;

            case SCAN_MODE.MODE_FIVE:
                inputValue.value = '';
                resetFocus();
                emit('handleScanFail', {
                    value: code,
                    schema: props.schema,
                    reset: true,
                    resetParams: {
                        [props.schema.prop]: '',
                    },
                });
                break;
        }
    }

    /**
     * 相机扫码处理
     */
    function handlePhotoScan() {
        // 清空条码
        inputValue.value = '';

        // #ifdef APP-PLUS
        uni.scanCode({
            onlyFromCamera: true,
            scanType: ['qrCode', 'barCode'],
            success: ({ res }: any) => {
                inputValue.value = res;
            },
            fail: (err: any) => {
                console.log(err);

                uni.showToast({
                    title: '扫码失败',
                    icon: 'none',
                    duration: 3000,
                });
            },
            complete: () => {
                // 调用扫码查询
                if (inputValue.value) {
                    handleSearchCode(inputValue.value);
                }
            },
        });
        // #endif
    }

    /**
     * 重新获取焦点
     */
    function resetFocus() {
        focusStatus.value = false;
        nextTick(() => {
            focusStatus.value = true;
        });
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(() => {
        // 默认值
        if (props.schema?.defaultValue) {
            inputValue.value = props.schema?.defaultValue;

            emit('handleEmit', {
                value: inputValue.value,
                schema: props.schema,
                isClear: false,
            });
        }

        // 默认扫码
        if (props.schema?.defaultFocus) {
            focusStatus.value = true;
        }
    });

    return {
        inputValue,
        focusStatus,
        handleClear,
        handleConfirm,
        handlePDAScan,
        handlePhotoScan,
    };
}
