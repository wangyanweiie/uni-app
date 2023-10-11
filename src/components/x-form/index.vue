<template>
    <view class="component">
        <u-form ref="formRef" :model="form" :rules="rules" :label-width="labelWidth">
            <uni-row>
                <uni-col v-for="schema in schemas" :key="schema.prop" :span="schema.span || 24">
                    <!-- 1.分隔线 -->
                    <u-divider
                        v-if="schema.type === 'BaseDivider'"
                        :text="schema.label"
                        text-color="#2979ff"
                        text-size="32rpx"
                        v-bind="schema?.attributes"
                    ></u-divider>

                    <!-- 2.标题 -->
                    <view v-if="schema.type === 'BaseTitle'" class="title">{{ schema.label }}</view>

                    <!-- 3.插槽 -->
                    <slot v-if="schema.type === 'Slot'" :name="schema.prop" :form="form" :schema="schema"> </slot>

                    <!-- 4.表单子项 -->
                    <u-form-item
                        v-if="schema.prop && !schema.hidden"
                        :key="schema.prop"
                        :prop="schema.prop"
                        :label="schema.label"
                        :required="!!schema.rules"
                    >
                        <!-- ① 插槽 -->
                        <slot
                            v-if="schema.type === 'FormSlot'"
                            :name="schema.prop"
                            :form="form"
                            :schema="schema"
                        ></slot>

                        <!-- ② 自定义组件 -->
                        <component
                            :is="(components as any)[schema.type]"
                            v-else
                            :ref="(el: unknown) => handleCompInstance(el, schema.prop)"
                            :form="form"
                            :schema="schema"
                            @handle-emit="handleEmit"
                            @handle-select="handleSelect"
                            @handle-scan-success="handleScanSuccess"
                            @handle-scan-fail="handleScanFail"
                        ></component>
                    </u-form-item>
                </uni-col>
            </uni-row>
        </u-form>
    </view>
</template>

<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema } from './interface';
import { components } from './components/register';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XForm',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        schemaList: Schema[];
        labelWidth?: string | number;
    }>(),
    {
        schemaList: () => [],
        labelWidth: '200rpx',
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleScanSuccess', val: Record<string, any>): void;
    (e: 'handleScanFail'): void;
}>();

/**
 * useIndex
 */
const {
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
} = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    getForm,
    validForm,
    resetForm,
    updateForm(params: Record<string, any>) {
        form.value = {
            ...form.value,
            ...params,
        };

        handleUpdateForm();
    },
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}
</style>
