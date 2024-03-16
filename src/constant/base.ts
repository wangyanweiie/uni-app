/**
 * 联合类型：数字或字符串
 */
export type Numeric = number | string;

/**
 * 下拉列表子项
 */
export interface LabelValueItem {
    label: string;
    value: Numeric;
}
