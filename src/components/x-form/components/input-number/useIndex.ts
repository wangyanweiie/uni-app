import { ref, onBeforeMount } from 'vue';
import type { Props } from '../interface';
import { keepDecimalPrecision } from './hooks';

export default function useIndex(props: Props, emit: any) {
    /**
     * 输入框的值
     */
    const inputValue = ref<number | string | null>();

    /**
     * 最值
     */
    const min = ref<number>();
    const max = ref<number>();

    /**
     * 精度
     */
    const precision = ref<number>();

    /**
     * 是否需要强制保留精度
     */
    const keepPrecision = ref<boolean>(false);

    /**
     * 处理数据格式
     */
    function handleNumber(num: number) {
        // 是否为空
        if (!num) {
            return null;
        }

        // 是否可转化为数字类型
        if (isNaN(num)) {
            uni.showToast({
                title: '仅可输入数字',
                icon: 'none',
            });

            return null;
        }

        // 最小值
        if (min.value && num < min.value) {
            inputValue.value = undefined;
            uni.showToast({
                title: `最小值：${min.value}`,
                icon: 'none',
            });

            return null;
        }

        // 最大值
        if (max.value && num > max.value) {
            uni.showToast({
                title: `最大值：${max.value}`,
                icon: 'none',
            });

            return null;
        }

        // 精度
        if (precision.value) {
            const value = Number(Number(num).toFixed(precision.value));

            // 强制保留精度
            if (keepPrecision.value) {
                return keepDecimalPrecision(value, precision.value);
            } else {
                return value;
            }
        }
    }

    /**
     * @description 输入框失焦
     * @param e 输入框的值
     */
    function handleBlur(e: number) {
        inputValue.value = handleNumber(e);

        emit('handleEmit', {
            value: inputValue.value,
            schema: props.schema,
            isClear: e ? false : true,
        });
    }

    /**
     * @description 清空输入框
     */
    function handleClear() {
        inputValue.value = null;

        emit('handleEmit', {
            value: '',
            schema: props.schema,
            isClear: true,
        });
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(() => {
        // 最小值
        if (props.schema?.attributes?.min) {
            min.value = props.schema?.attributes?.min;
        }

        // 最大值
        if (props.schema?.attributes?.max) {
            max.value = props.schema?.attributes?.max;
        }

        // 精度
        if (props.schema?.attributes?.precision) {
            precision.value = props.schema?.attributes?.precision;
        }

        // 是否需要强制保留精度
        if (props.schema?.attributes?.keepPrecision) {
            keepPrecision.value = props.schema?.attributes?.keepPrecision;
        }

        // 默认值
        if (!isNaN(props.schema?.defaultValue)) {
            inputValue.value = handleNumber(props.schema?.defaultValue);

            if (inputValue.value) {
                emit('handleEmit', {
                    value: Number(inputValue.value),
                    schema: props.schema,
                    isClear: false,
                });
            }
        }
    });

    return {
        inputValue,
        handleNumber,
        handleBlur,
        handleClear,
    };
}
