<template>
    <view class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" :label-width="labelWidth">
            <uni-row>
                <uni-col v-for="item in schemas" :key="item.prop" :span="item.span ? item.span : 24">
                    <!-- divider -->
                    <view v-if="item.type === 'BaseDivider'">
                        <u-divider v-bind="item?.attributes"></u-divider>
                    </view>

                    <!-- title -->
                    <view v-if="item.type === 'BaseTitle'">
                        <view class="base-title">{{ item.label }}</view>
                    </view>

                    <u-form-item
                        v-if="item.hidden !== true && item.prop"
                        :key="item.prop"
                        :label="item.label"
                        :prop="item.prop"
                        :required="item.rules ? true : false"
                    >
                        <component
                            :is="components[item.type]"
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
import { components } from './components/index';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        schemaList: Schema[];
        labelWidth?: number;
    }>(),
    {
        schemaList: () => [],
        labelWidth: 200,
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
    updateForm(params: Record<string, any>) {
        form.value = { ...form.value, ...params };
        handleUpdateForm();
    },
    validForm,
    resetForm,
    getForm,
});
</script>
<style lang="scss" scoped>
:deep(.u-form-item__body) {
    border-bottom: 1px rgb(214, 215, 217) solid;
}

// 影响到 uni-row 的布局
:deep(.u-form-item__body__right__message) {
    height: 0;
}

.base-title {
    font-size: 32rpx;
    width: 100%;
    color: #2196f3;
    margin-top: 30rpx;
}
</style>
