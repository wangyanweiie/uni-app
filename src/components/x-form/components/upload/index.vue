<template>
    <view class="component">
        <u-upload
            name="upload"
            width="80rpx"
            height="80rpx"
            accept="image"
            :size-type="['original']"
            :file-list="fileList"
            v-bind="schema?.attributes"
            @delete="handleDelete"
            @after-read="handleAfterRead"
        >
            <u-image width="60rpx" height="60rpx" src="./images/upload.png" />
        </u-upload>
    </view>
</template>

<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema } from '../../interface';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'BaseUpload',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        schema: Schema;
    }>(),
    {
        schema: () => {
            return {
                prop: '',
                label: '',
                type: 'BaseUpload',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleEmit', val: string | number): void;
}>();

/**
 * useIndex
 */
const { fileList, handleInit, handleAfterRead, handleDelete } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    fileList,

    setData(val: any) {
        handleInit(val);
    },
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
    display: flex;
    align-items: center;
}
</style>
