<template>
    <view class="form-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" :label-width="labelWidth">
            <uni-row>
                <uni-col v-for="item in schemas" :key="item.prop" :span="item.span ?? 24">
                    <!-- 1.分隔线 -->
                    <view v-if="item.type === 'BaseDivider'">
                        <u-divider
                            :text="item.label"
                            text-color="#2196f3"
                            text-size="32rpx"
                            v-bind="item?.attributes"
                        ></u-divider>
                    </view>

                    <!-- 2.标题 -->
                    <view v-if="item.type === 'BaseTitle'">
                        <view class="base-title">{{ item.label }}</view>
                    </view>

                    <!-- 3.插槽 -->
                    <slot v-if="item.type === 'Slot'" :name="item.prop" :form="form" :schema="item"> </slot>

                    <!-- 4.表单子项 -->
                    <u-form-item
                        v-if="!item.hidden && item.prop"
                        :key="item.prop"
                        :label="item.label"
                        :prop="item.prop"
                        :required="item.rules ? true : false"
                    >
                        <!-- ① 插槽 -->
                        <slot v-if="item.type === 'FormSlot'" :name="item.prop" :form="form" :schema="item"></slot>

                        <!-- ② 自定义组件 -->
                        <component
                            :is="components[item.type]"
                            v-else
                            :ref="(el: unknown) => handleCompInstance(el, item.prop)"
                            :schema="item"
                            :form="form"
                            :style="schemaStyle"
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

<script lang="ts">
export default {
    name: 'XForm',
};
</script>

<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema } from './interface';
import { components } from './components/register';

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
}>();

/**
 * useIndex
 */
const {
    schemas,
    schemaStyle,
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
.base-title {
    font-size: 32rpx;
    width: 100%;
    color: #2196f3;
    margin: 20rpx 0;
}
</style>
