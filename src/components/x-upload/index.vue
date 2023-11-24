<template>
    <view class="component">
        <!-- 缩略图 -->
        <view class="preview">
            <template v-for="(item, index) in fileList" :key="item.url">
                <view class="preview__item">
                    <!-- 视频 -->
                    <u-image
                        v-if="item.url?.indexOf('mp4') !== -1"
                        :width="width"
                        :height="height"
                        src="./images/video.png"
                        class="preview__item__video"
                        @click="handleVideoPreview(item.url)"
                    ></u-image>

                    <!-- 图片 -->
                    <u-image
                        v-else
                        :width="width"
                        :height="height"
                        :src="item.url"
                        class="preview__item__image"
                        @click="handleImagePreview(item.url)"
                    ></u-image>

                    <!-- 删除 -->
                    <u-icon
                        v-if="deletable && !disabled"
                        name="close-circle-fill"
                        size="30rpx"
                        color="#373737"
                        class="preview__item__icon"
                        @click="handleItemDelete(index)"
                    ></u-icon>
                </view>
            </template>
        </view>

        <!-- 遮罩层：预览视频 -->
        <u-overlay :show="showOverlay" opacity="1" @click="handleCloseOverlay">
            <view class="overlay">
                <video
                    :id="videoUrl"
                    :src="videoUrl"
                    :autoplay="true"
                    :loop="false"
                    :controls="false"
                    :show-center-play-btn="false"
                    class="overlay__video"
                ></video>
            </view>
        </u-overlay>

        <!--
            上传组件
            通过 :file-list="fileList" 展示的缩略图不可预览视频，故不再传入 fileList，手写预览区；
            而且由于不传入 fileList ，超出最大上传数量后上传按钮不再自动隐藏，需要手动隐藏；
            PS：此时 u-upload 的 previewImage、previewFullImage、delete 属性不再起作用；
         -->
        <u-upload
            name="upload"
            :width="width"
            :height="height"
            :multiple="multiple"
            :max-count="maxCount"
            :preview-image="previewImage"
            :preview-full-image="previewFullImage"
            :deletable="deletable && !disabled"
            :disabled="disabled"
            :accept="accept"
            :capture="capture"
            :compressed="false"
            :size-type="['original']"
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

<script setup lang="ts">
import useIndex from './useIndex';
import { UPLOAD_URL } from '@/constant/global';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XUpload',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定的值 */
        modelValue: string[];
        /** 上传地址 */
        uploadUrl?: string;
        /** 内部预览图宽度 */
        width?: string | number;
        /** 内部预览图高度 */
        height?: string | number;
        /** 是否可多选 */
        multiple?: boolean;
        /** 最大上传数量 */
        maxCount?: number;
        /** 是否展示缩略图 */
        previewImage?: boolean;
        /** 是否展示内部预览图 */
        previewFullImage?: boolean;
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
        modelValue: () => [],
        uploadUrl: UPLOAD_URL,
        width: '80rpx',
        height: '80rpx',
        multiple: false,
        maxCount: 5,
        previewImage: true,
        previewFullImage: true,
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
    handleImagePreview,
    handleVideoPreview,
    handleDelete,
    handleItemDelete,
    handleCloseOverlay,
} = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    fileList,
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
    display: flex;
    align-items: center;
}

.preview {
    max-width: 450rpx;
    overflow-x: auto;
    display: flex;

    &__item {
        width: 80rpx;
        height: 80rpx;
        margin: 0 16rpx 16rpx 0;
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
</style>
