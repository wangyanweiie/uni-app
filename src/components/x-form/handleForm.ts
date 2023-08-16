import type { Schema, Options } from './interface';

/**
 * 表单项 input 改变后的回调处理
 * @param form 表单的值
 * @param event 当前表单项和输入框的值
 * @param schemaList 配置表单
 */
export function handleValue(
    form: Record<string, any>,
    event: { value: string | number; schema: Schema; isClear?: boolean },
) {
    form[event.schema.prop] = event.value;
}

/**
 * 表单项下拉改变后的回调处理
 * @param form 表单的值
 * @param event 当前表单项和下拉的值
 */
export function handleLabelAndValue(
    form: Record<string, any>,
    event: { value: Options; schema: Schema; isClear?: boolean },
) {
    form[event.schema.prop] = event.value.value;
    if (event.schema?.labelField) {
        form[event.schema.labelField] = event.value.label;
    }
}
