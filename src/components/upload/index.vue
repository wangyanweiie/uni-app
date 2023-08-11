<template>
    <view class="wrap">
        <!-- 缩略图 -->
        <view class="preview">
            <template v-for="(item, index) in fileList" :key="index">
                <view v-if="item.url?.indexOf('mp4') !== -1" class="preview__item">
                    <u-image
                        :width="width"
                        :height="height"
                        src="./images/video.png"
                        class="preview__item__video"
                        @click="handleVideoPreview(item.url)"
                    ></u-image>
                    <u-icon
                        v-if="deletable && !disabled"
                        name="close-circle-fill"
                        size="30rpx"
                        color="#C6C7CB"
                        class="preview__item__icon"
                        @click="handleItemDelete(index)"
                    ></u-icon>
                </view>

                <view v-else class="preview__item">
                    <u-image
                        :width="width"
                        :height="height"
                        :src="item.url"
                        class="preview__item__image"
                        @click="handleImagePreview(item.url)"
                    ></u-image>
                    <u-icon
                        v-if="deletable && !disabled"
                        name="close-circle-fill"
                        size="30rpx"
                        color="#C6C7CB"
                        class="preview__item__icon"
                        @click="handleItemDelete(index)"
                    ></u-icon>
                </view>
            </template>
        </view>

        <!-- 遮罩层：预览视频 -->
        <u-overlay :show="showOverlay" opacity="1" @click="showOverlay = false">
            <view class="overlay">
                <video
                    :src="videoUrl"
                    :autoplay="true"
                    :loop="true"
                    :controls="false"
                    :show-play-btn="false"
                    :show-center-play-btn="false"
                    class="overlay__video"
                ></video>
            </view>
        </u-overlay>

        <!-- 
            上传组件
            :file-list="fileList" 不可预览视频，故手写预览区；
            此时传入的 previewImage、previewFullImage 参数不再作用
         -->
        <u-upload
            name="upload"
            :multiple="multiple"
            :max-count="maxCount"
            :preview-image="previewImage"
            :preview-full-image="previewFullImage"
            :width="width"
            :height="height"
            :deletable="deletable && !disabled"
            :disabled="disabled"
            :accept="accept"
            :capture="capture"
            class="upload"
            @after-read="handleAfterRead"
            @delete="handleDelete"
        >
            <u-image
                v-if="fileList.length < maxCount && !disabled"
                width="60rpx"
                height="60rpx"
                src="./images/upload.png"
            />
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
        /** 是否展示缩略图 */
        previewImage?: boolean;
        /** 是否展示内部预览图 */
        previewFullImage?: boolean;
        /** 内部预览图宽度 */
        width?: string | number;
        /** 内部预览图高度 */
        height?: string | number;
        /** 是否可删除 */
        deletable?: boolean;
        /** 是否禁用上传，只预览 */
        disabled?: boolean;
        /** 接收文件的类型，只有微信小程序支持 'media' | 'all'，H5页面支持 'file' */
        // accept: 'all' | 'media' | 'file' | 'image' | 'video';
        accept?: 'image' | 'video';
        /** 图片或视频拾取模式 */
        capture?: ['album'] | ['camera'] | ['album', 'camera'];
    }>(),
    {
        modelValue: '',
        multiple: false,
        maxCount: 5,
        previewImage: true,
        previewFullImage: true,
        width: '80rpx',
        height: '80rpx',
        deletable: true,
        disabled: false,
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
const {
    fileList,
    showOverlay,
    videoUrl,
    handleAfterRead,
    handleDelete,
    handleImagePreview,
    handleVideoPreview,
    handleItemDelete,
} = useIndex(props, emit);

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
    display: flex;
    align-items: center;

    .preview {
        max-width: 450rpx;
        margin-right: 10rpx;
        overflow-x: auto;
        display: flex;

        &__item {
            width: 80rpx;
            height: 80rpx;
            margin-right: 10rpx;
            position: relative;

            &__video,
            &__image {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }

            &__icon {
                position: absolute;
                top: 0;
                right: 0;
            }
        }
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: relative;

        &__video {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}

:deep(.u-upload__button) {
    margin: 0;
}

:deep(.u-upload__wrap__other) {
    width: 80rpx;
    height: 80rpx;
}
</style>
