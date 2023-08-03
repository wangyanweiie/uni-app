/**
 * date-picker props
 */
export interface Props {
    /** 双向绑定的值 */
    modelValue: string;
    /** 提示文字 */
    placeholder?: string;
    /** 是否可清空 */
    clearable?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 日期类型 */
    dateType?: 'time' | 'date' | 'datetime';
    /** 日期组件处理格式 */
    dateFormat?: 'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss';
}
