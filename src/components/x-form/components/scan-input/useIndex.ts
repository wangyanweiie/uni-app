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
     * 输入框聚焦回调
     */
    function handleFocus() {
        focusStatus.value = true;
    }

    /**
     * 输入框失焦回调
     */
    function handleBlur(e: string | number) {
        focusStatus.value = false;

        emit('handleEmit', {
            value: e,
            schema: props.schema,
            isClear: e ? false : true,
        });
    }

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

        inputValue.value = code;
        emit('handleEmit', {
            value: code,
            schema: props.schema,
            isClear: false,
        });

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
            handleScanSuccess(res);
        } else {
            handleScanError();
        }
    }

    /**
     * @description 查询成功处理
     * @param res 扫码成功后接口返回的值
     */
    function handleScanSuccess(res: RequestObj) {
        switch (props.schema?.codeScanningMode) {
            case SCAN_MODE.MODE_ONE:
            case SCAN_MODE.MODE_TWO:
            case SCAN_MODE.MODE_FIVE:
                emit('handleScanSuccess', {
                    value: res.data,
                    schema: props.schema,
                    reset: false,
                });
                break;

            case SCAN_MODE.MODE_THREE:
            case SCAN_MODE.MODE_FOUR:
                inputValue.value = '';
                resetFocus();
                emit('handleScanSuccess', {
                    value: res.data,
                    schema: props.schema,
                    reset: true,
                });
                break;
        }
    }

    /**
     * 查询失败处理
     */
    function handleScanError() {
        switch (props.schema?.codeScanningMode) {
            case SCAN_MODE.MODE_ONE:
                emit('handleScanFail', {
                    schema: props.schema,
                    reset: false,
                });
                break;

            case SCAN_MODE.MODE_TWO:
                emit('handleScanFail', {
                    schema: props.schema,
                    reset: true,
                });
                break;

            case SCAN_MODE.MODE_THREE:
                resetFocus();
                emit('handleScanFail', {
                    schema: props.schema,
                    reset: false,
                });
                break;

            case SCAN_MODE.MODE_FOUR:
                resetFocus();
                inputValue.value = '';
                emit('handleScanFail', {
                    schema: props.schema,
                    reset: true,
                });
                break;

            case SCAN_MODE.MODE_FIVE:
                resetFocus();
                inputValue.value = '';
                emit('handleScanFail', {
                    schema: props.schema,
                    reset: true,
                    resetParams: { [props.schema.prop]: '' },
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
        emit('handleEmit', {
            value: '',
            schema: props.schema,
            isClear: true,
        });

        // #ifdef APP-PLUS
        uni.scanCode({
            onlyFromCamera: true,
            scanType: ['qrCode', 'barCode'],
            success: ({ res }) => {
                inputValue.value = res;
                emit('handleEmit', {
                    value: res,
                    schema: props.schema,
                    isClear: false,
                });
            },
            fail: error => {
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
        handleFocus,
        handleBlur,
        handleClear,
        handleConfirm,
        handlePDAScan,
        handlePhotoScan,
    };
}
