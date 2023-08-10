<template>
    <view class="wrap">
        <u-upload
            name="upload"
            :file-list="fileList"
            :multiple="multiple"
            :max-count="maxCount"
            :preview-image="previewImage"
            :width="width"
            :height="height"
            :deletable="deletable"
            :accept="accept"
            :capture="capture"
            @after-read="handleAfterRead"
            @delete="handleDelete"
        >
            <u-image :width="width" :height="height" src="./images/photo.png" />
        </u-upload>
    </view>
</template>
<script lang="ts">
export default {
    name: 'Upload',
};
</script>
<script setup lang="ts">
import useIndex from './useIndex';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定的值 */
        modelValue: string;
        /** 是否可多选 */
        multiple?: boolean;
        /** 最大上传数量 */
        maxCount?: number;
        /** 是否展示内部预览图 */
        previewImage?: boolean;
        /** 内部预览图宽度 */
        width?: string | number;
        /** 内部预览图高度 */
        height?: string | number;
        /** 是否可删除 */
        deletable?: boolean;
        /** 接收文件的类型 */
        accept?: 'all' | 'media' | 'image' | 'file' | 'video';
        /** 图片或视频拾取模式 */
        capture?: ['album'] | ['camera'] | ['album', 'camera'];
    }>(),
    {
        modelValue: '',
        multiple: false,
        maxCount: 5,
        previewImage: true,
        width: '80rpx',
        height: '80rpx',
        deletable: true,
        accept: 'image',
        capture: () => ['album', 'camera'],
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void;
}>();

/**
 * useIndex
 */
const { fileList, handleAfterRead, handleDelete } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    fileList,
});
</script>
<style lang="scss" scoped>
.wrap {
    height: 70rpx;
}

:deep(.u-upload__wrap__preview__other) {
    width: '80rpx';
    height: '80rpx';
}
</style>
