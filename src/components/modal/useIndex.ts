import { computed } from 'vue';
import type { Props } from './interface';

/**
 * @description useIndex
 * @param props 组件传参
 * @param emit 自定义事件
 */
export default function useIndex(props: Props, emit: any) {
    /**
     * 通过 computed 实现赋值与监听以及同步更新 show
     */
    const show = computed<boolean>({
        get: () => props.modelValue,
        set: newValue => emit('update:modelValue', newValue),
    });

    /**
     * 确认
     */
    function handleConfirm() {
        show.value = false;
        emit('confirm');
    }

    /**
     * 取消
     */
    function handleCancel() {
        show.value = false;
        emit('cancel');
    }

    /**
     * 关闭
     */
    function handleClose() {
        show.value = false;
        emit('close');
    }

    return {
        show,
        handleConfirm,
        handleCancel,
        handleClose,
    };
}
