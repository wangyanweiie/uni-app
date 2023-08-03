import { ref, onBeforeMount } from 'vue';
import type { Props } from '../interface';

export default function useIndex(props: Props, emit: any) {
    /**
     * 输入框的值
     */
    const inputValue = ref<object | string | number | boolean>();

    /**
     * @description 输入框失焦
     * @param e
     */
    function handleBlur(e: any) {
        emit('handleEmit', {
            value: e?.detail?.value,
            schema: props.schema,
            isClear: e ? false : true,
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
    };
}
