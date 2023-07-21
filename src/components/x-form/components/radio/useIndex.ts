import { ref, onBeforeMount } from 'vue';
import type { Options } from '../../interface';
import type { Props } from '../interface';

export default function useIndex(props: Props, emit: Function) {
    /**
     * 单选值
     */
    const radioValue = ref<number | string>('');

    /**
     * 单选列表
     */
    const radioList = ref<Options[]>([]);

    /**
     * @description 单选框改变
     * @param item 当前选中的选项
     */
    function handleChange(item: Options) {
        radioValue.value = item.value;

        emit('handleEmit', {
            value: radioValue.value,
            schema: props.schema,
            isClear: false,
        });
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(() => {
        // 更新单选列表
        if (props.schema?.options?.length) {
            radioList.value = props.schema?.options;
        }

        // 默认值
        if (props.schema?.defaultValue && radioList.value.length) {
            radioList.value.forEach((item: Options) => {
                if (item.value === props.schema?.defaultValue) {
                    radioValue.value = item.value;
                }
            });

            emit('handleEmit', {
                value: radioValue.value,
                schema: props.schema,
                isClear: false,
            });
        }
    });

    return {
        radioValue,
        radioList,
        handleChange,
    };
}
