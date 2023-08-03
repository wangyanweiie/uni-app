import { ref, nextTick, onBeforeMount } from 'vue';
import type { Props } from '../interface';

export default function useIndex(props: Props, emit: any) {
    /**
     * 输入框的值
     */
    const inputValue = ref<string | number>();

    /**
     * @description 输入框失焦
     * @param e 输入框的值
     */
    function handleBlur(e: number | string) {
        emit('handleEmit', {
            value: e,
            schema: props.schema,
            isClear: e ? false : true,
        });
    }

    /**
     * @description 清空输入框
     */
    function handleClear() {
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
        // 默认值
        if (props.schema?.defaultValue) {
            inputValue.value = props.schema?.defaultValue;

            emit('handleEmit', {
                value: inputValue.value,
                schema: props.schema,
                isClear: false,
            });
        }
    });

    return {
        inputValue,
        handleBlur,
        handleClear,
    };
}
