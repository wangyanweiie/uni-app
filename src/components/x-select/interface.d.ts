/**
 * 下拉列表数据类型
 */
export interface Options {
    label: string;
    value: string | number;
}

/**
 * date-picker props
 */
export interface Props {
    /** 双向绑定的值 */
    modelValue: string | number;
    /** 提示文字 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否可清空 */
    clearable?: boolean;
    /** 下拉请求接口 */
    api?: any;
    /** 下拉请求接口参数 */
    apiParams?: Record<string, string | number>;
    /** 单选/复选框静态列表 */
    options?: Options[];
}
