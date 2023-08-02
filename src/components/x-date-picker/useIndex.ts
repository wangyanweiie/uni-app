import { ref, onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import type { Props } from './interface';

export default function useIndex(props: Props, emit: Function) {
    /**
     * 日期选择器的值
     */
    const dateValue = ref<any>('');

    /**
     * 是否展示选择器
     */
    const showPicker = ref<boolean>(false);

    /**
     * 组件类型
     */
    const dateType = ref<'time' | 'date' | 'datetime'>('date');

    /**
     * datetime 组件类型时的展示格式
     */
    const dateFormat = ref<'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss'>('YYYY-MM-DD HH:mm:ss');

    /**
     * 打开选择器
     */
    async function handleOpen() {
        if (props.disabled) {
            return;
        }

        // 回显时处理时间格式
        // datePick 组件在 datetime 类型下，若设置了 showSeconds，只能用 'YYYY-MM-DD HH:mm' | YYYY-MM-DD HH:mm:ss 显示；
        if (dateValue.value) {
            switch (dateType.value) {
                case 'time':
                    // dateValue.value = dayjs(dateValue.value).format('HH:mm:ss');
                    break;
                case 'date':
                    dateValue.value = dayjs(dateValue.value).format('YYYY-MM-DD');
                    break;
                case 'datetime':
                    switch (dateFormat.value) {
                        case 'YYYY-MM-DD HH':
                            dateValue.value = `${dayjs(dateValue.value).format('YYYY-MM-DD HH')}:00:00`;
                            break;
                        case 'YYYY-MM-DD HH:mm':
                            dateValue.value = `${dayjs(dateValue.value).format('YYYY-MM-DD HH:mm')}:00`;
                            break;
                        case 'YYYY-MM-DD HH:mm:ss':
                            dateValue.value = dayjs(dateValue.value).format('YYYY-MM-DD HH:mm:ss');
                            break;
                    }
                    break;
            }
        } else {
            // 首次打开默认取当前时间
            switch (dateType.value) {
                case 'time':
                    dateValue.value = dayjs().format('HH:mm:ss');
                    break;
                case 'date':
                    dateValue.value = dayjs().format('YYYY-MM-DD');
                    break;
                case 'datetime':
                    switch (dateFormat.value) {
                        case 'YYYY-MM-DD HH':
                            dateValue.value = `${dayjs().format('YYYY-MM-DD HH')}:00:00`;
                            break;
                        case 'YYYY-MM-DD HH:mm':
                            dateValue.value = `${dayjs().format('YYYY-MM-DD HH:mm')}:00`;
                            break;
                        case 'YYYY-MM-DD HH:mm:ss':
                            dateValue.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
                            break;
                    }
                    break;
            }
        }

        showPicker.value = true;
    }

    /**
     * 处理时间格式
     */
    function handleDatePickFormat(e: string) {
        if (!e) {
            return;
        }

        switch (dateType.value) {
            case 'time':
                dateValue.value = e;
                // dateValue.value = dayjs(e).format('HH:mm:ss');
                break;
            case 'date':
                dateValue.value = dayjs(e).format('YYYY-MM-DD');
                break;
            case 'datetime':
                dateValue.value = dayjs(e).format(dateFormat.value);
                break;
        }
    }

    /**
     * 确认
     */
    function handleConfirm(e: { value: string; date: any }) {
        handleDatePickFormat(e.value);

        emit('update:modelValue', dateValue.value);
        emit('change', {
            value: dateValue.value,
        });

        showPicker.value = false;
    }

    /**
     * 关闭选择器
     */
    function handleCancel() {
        showPicker.value = false;
    }

    /**
     * 清除按钮
     */
    function handleClear() {
        dateValue.value = '';

        emit('update:modelValue', dateValue.value);
        emit('clear');
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(async () => {
        // 日期类型
        if (props.dateType) {
            dateType.value = props.dateType;
        }

        // 日期处理格式
        if (props.dateFormat) {
            dateFormat.value = props.dateFormat;
        }
    });

    return {
        showPicker,
        dateValue,
        dateType,
        dateFormat,
        handleOpen,
        handleClear,
        handleCancel,
        handleDatePickFormat,
        handleConfirm,
    };
}
