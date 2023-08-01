import { ref, onBeforeMount } from 'vue';
import type { Schema } from '../../interface';
import dayjs from 'dayjs';

export default function useIndex(props: { schema: Schema; form: Record<string, any> }, emit: Function) {
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
    const datePickType = ref<'time' | 'date' | 'datetime'>('date');

    /**
     * datetime 组件类型时的展示格式
     */
    const dateTimeFormat = ref<'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss'>('YYYY-MM-DD HH:mm:ss');

    /**
     * 打开选择器
     */
    async function handleOpen() {
        if (props.schema?.attributes?.disabled) {
            return;
        }

        // 回显时处理时间格式
        // datePick 组件在 datetime 类型下，若设置了 showSeconds，只能用 'YYYY-MM-DD HH:mm' | YYYY-MM-DD HH:mm:ss 显示；
        if (dateValue.value) {
            switch (datePickType.value) {
                case 'time':
                    // dateValue.value = dayjs(dateValue.value).format('HH:mm:ss');
                    break;
                case 'date':
                    dateValue.value = dayjs(dateValue.value).format('YYYY-MM-DD');
                    break;
                case 'datetime':
                    switch (dateTimeFormat.value) {
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
            switch (datePickType.value) {
                case 'time':
                    dateValue.value = dayjs().format('HH:mm:ss');
                    break;
                case 'date':
                    dateValue.value = dayjs().format('YYYY-MM-DD');
                    break;
                case 'datetime':
                    switch (dateTimeFormat.value) {
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

        switch (datePickType.value) {
            case 'time':
                dateValue.value = e;
                // dateValue.value = dayjs(e).format('HH:mm:ss');
                break;
            case 'date':
                dateValue.value = dayjs(e).format('YYYY-MM-DD');
                break;
            case 'datetime':
                dateValue.value = dayjs(e).format(dateTimeFormat.value);
                break;
        }
    }

    /**
     * 确认
     */
    function handleConfirm(e: { value: string; date: any }) {
        handleDatePickFormat(e.value);

        emit('handleEmit', {
            value: dateValue.value,
            schema: props.schema,
            isClear: false,
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

        emit('handleEmit', {
            value: dateValue.value,
            schema: props.schema,
            isClear: true,
        });
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(async () => {
        // 组件类型
        if (props.schema?.attributes?.datePickType) {
            datePickType.value = props.schema?.attributes?.datePickType;
        }

        // 组件类型
        if (props.schema?.attributes?.dateTimeFormat) {
            dateTimeFormat.value = props.schema?.attributes?.dateTimeFormat;
        }

        // 默认值
        if (props.schema?.defaultValue) {
            handleDatePickFormat(props.schema?.defaultValue);

            emit('handleEmit', {
                value: dateValue.value,
                schema: props.schema,
                isClear: false,
            });
        }
    });

    return {
        showPicker,
        dateValue,
        datePickType,
        dateTimeFormat,
        handleOpen,
        handleClear,
        handleCancel,
        handleDatePickFormat,
        handleConfirm,
    };
}
