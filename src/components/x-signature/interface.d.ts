/**
 * Props
 */
export interface Props {
    /** 双向绑定的值，生成的签名路径 */
    modelValue: string;
    /** 提示文字 */
    placeholder?: string;
    /** 是否可清空 */
    clearable?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
}
