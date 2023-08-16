import { nextTick, onBeforeMount, ref } from 'vue';
import { handleValue, handleLabelAndValue } from './handleForm';
import type { Schema, XFormProps, EmitEvent, SelectEvent, ScanSuccessEvent, ScanFailEvent } from './interface';

/**
 * useIndex
 * @param props 组件传参
 * @param emit 自定义事件
 */
export default function useIndex(props: XFormProps, emit: any) {
    /**
     * 配置表单列表
     */
    const schemas = ref<Schema[]>(props.schemaList);

    /**
     * 表单 ref
     */
    const formRef = ref();

    /**
     * 表单值
     */
    const form = ref<Record<string, any>>({});

    /**
     * 表单校验
     */
    const rules = ref<Record<string, any>>({});

    /**
     * 组件实例对象
     */
    const instanceRef = ref<Record<string, any>>({});

    /**
     * @description 初始化表单
     */
    function handleInitForm() {
        props.schemaList.forEach((schema: Schema) => {
            // 表单值
            if (schema.prop) {
                form.value[schema.prop] = schema.defaultValue ?? '';
            }

            // 表单校验规则
            if (schema.rules) {
                rules.value[schema.prop] = schema.rules;
            }
        });
    }

    /**
     * @description 收集组件的实例，并与 prop 绑定
     * @param el 实例对象
     */
    function handleCompInstance(el: any, prop: string | number) {
        if (el) {
            instanceRef.value[prop] = el;
        }
    }

    /**
     * @description 过滤组件
     * @param item 表单项配置
     * @return boolean
     */
    function handleExceptionField(item: Schema) {
        if (!item.prop) {
            return false;
        }

        if (item.hidden === true) {
            return false;
        }

        return true;
    }

    /**
     * @description 更新校验规则
     */
    function handleResetRules() {
        rules.value = {};
        props.schemaList.forEach((schema: Schema) => {
            if (handleExceptionField(schema) && schema.rules) {
                rules.value[schema.prop] = schema.rules;
            }
        });
    }

    /**
     * @description 更新表单值
     */
    function handleUpdateForm() {
        props.schemaList.forEach((schema: Schema) => {
            if (handleExceptionField(schema) && typeof instanceRef.value[schema.prop]?.setData === 'function') {
                instanceRef.value[schema.prop].setData(form.value[schema.prop]);
            }
        });
    }

    /**
     * @description BaseInput | InputNumber | BaseTextarea | BaseRadio | DatePicker | BaseUpload | ScanInput 组件回调
     * @param event schema 为回调的表单项，value 是回调的值
     */
    async function handleEmit(event: EmitEvent) {
        if (
            ![
                'BaseInput',
                'BaseTextarea',
                'BaseRadio',
                'BaseUpload',
                'InputNumber',
                'DatePicker',
                'ScanInput',
            ].includes(event.schema.type)
        ) {
            return;
        }

        // 将组件值同步到 form 表单
        handleValue(form.value, event);

        // 清空或者赋值都要触发联动回调，扫码只赋值，联动在扫码成功或者失败的事件中触发
        if (event.schema.componentProps && event.schema.type !== 'ScanInput') {
            await event.schema.componentProps({
                value: form.value[event.schema.prop],
                form: form.value,
                schemas: props.schemaList,
                schema: event.schema,
                result: event.isClear ? 'clear' : 'change',
            });

            // 更新表单及校验规则
            nextTick(() => {
                handleResetRules();
                handleUpdateForm();
            });
        }
    }

    /**
     * @description BaseSelect | SearchSelect 组件回调
     * @param event schema 为回调的表单项，value 是选中的值
     */
    async function handleSelect(event: SelectEvent) {
        if (!['BaseSelect', 'SearchSelect'].includes(event.schema.type)) {
            return;
        }

        // 将组件值同步到 form 表单
        handleLabelAndValue(form.value, event);

        // 清空或者赋值都要触发联动回调
        if (event.schema.componentProps) {
            await event.schema.componentProps({
                value: form.value[event.schema.prop],
                form: form.value,
                schemas: props.schemaList,
                schema: event.schema,
                result: event.isClear ? 'clear' : 'change',
            });

            // 更新表单及校验规则
            nextTick(() => {
                handleResetRules();
                handleUpdateForm();
            });
        }
    }

    /**
     * @description ScanInput 组件扫码成功回调
     * @param event schema 为回调的表单项，value 是扫码查询后所返回的参数
     */
    async function handleScanSuccess(event: ScanSuccessEvent) {
        // 将扫码结果合并到 form 表单
        form.value = {
            ...form.value,
            event: event.result,
        };

        // 联动回调
        if (event.value && event.schema.componentProps) {
            await event.schema.componentProps({
                value: event.value,
                form: form.value,
                schemas: props.schemaList,
                schema: event.schema,
                result: 'success',
            });

            // 更新表单及校验规则
            nextTick(() => {
                handleResetRules();
                handleUpdateForm();
            });
        }

        // 更新表单字段
        if (!event.reset) {
            form.value[event.schema.prop] = event.value;
        }

        // 自定义事件
        emit('handleScanSuccess', event.value);
    }

    /**
     * @description ScanInput 组件扫码失败回调
     * @param event schema 为回调的表单项，value 是扫码查询后所返回的参数
     */
    async function handleScanFail(event: ScanFailEvent) {
        // 联动回调
        if (event.schema.componentProps) {
            await event.schema.componentProps({
                value: event.value,
                form: form.value,
                schemas: props.schemaList,
                schema: event.schema,
                result: 'error',
            });

            // 更新校验规则
            nextTick(() => {
                handleResetRules();
            });
        }

        // 更新表单字段
        if (event.reset) {
            nextTick(() => {
                resetForm(event.resetParams);
            });
        } else {
            form.value[event.schema.prop] = event.value;
        }

        // 自定义事件
        emit('handleScanFail', event.value);
    }

    /**
     * @description 获取组件的值 (主要是插槽)
     * @return 返回表单值
     */
    function getForm() {
        props.schemaList.forEach((schema: Schema) => {
            if (handleExceptionField(schema) && typeof instanceRef.value[schema.prop]?.getData === 'function') {
                form.value[schema.prop] = instanceRef.value[schema.prop].getData();
            }
        });

        props.schemaList.forEach((schema: Schema) => {
            if (schema.type === 'BaseUpload' && schema.fileList && !Array.isArray(form.value[schema.prop])) {
                if (Array.isArray(instanceRef.value[schema.prop].fileList)) {
                    form.value[schema.prop] = instanceRef.value[schema.prop].fileList.map(
                        (uploadItem: { name: string; url: string }) => {
                            // 处理 name url
                            if (!uploadItem.name && uploadItem.url) {
                                const splitList = uploadItem.url.split('/');
                                uploadItem.name = splitList[splitList.length - 1];
                            }

                            return uploadItem;
                        },
                    );
                } else {
                    form.value[schema.prop] = [];
                }
            }
        });

        return form.value;
    }

    /**
     * 表单校验
     */
    async function validForm() {
        return await formRef.value.validate();
    }

    /**
     * @description 重置表单
     * @param event 是否仅重置部分字段
     */
    function resetForm(resetParams?: Record<string, any>) {
        if (resetParams) {
            form.value = {
                ...form.value,
                ...resetParams,
            };
        } else {
            form.value = {};
            rules.value = {};
            handleInitForm();
            handleUpdateForm();
        }
    }

    /**
     * 组件挂载前
     */
    onBeforeMount(() => {
        handleInitForm();
    });

    return {
        schemas,
        formRef,
        form,
        rules,
        handleCompInstance,
        handleUpdateForm,
        handleEmit,
        handleSelect,
        handleScanSuccess,
        handleScanFail,
        getForm,
        validForm,
        resetForm,
    };
}
