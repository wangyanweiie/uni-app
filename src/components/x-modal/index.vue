<template>
    <u-modal
        ref="modalRef"
        :show="show"
        :title="title"
        :content="content"
        :async-close="asyncClose"
        :close-on-click-overlay="closeOnClickOverlay"
        :width="width"
        :show-confirm-button="showConfirmButton"
        :show-cancel-button="showCancelButton"
        :confirm-text="confirmText"
        :cancel-text="cancelText"
        :zoom="zoom"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        @close="handleClose"
    >
        <!-- 自定义内容 -->
        <template #default>
            <slot name="default"></slot>
        </template>
    </u-modal>
</template>

<script lang="ts" setup>
import useIndex from './useIndex';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XModal',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定是否展示 */
        modelValue: boolean;
        /** 标题 */
        title?: string;
        /** 内容 */
        content?: string;
        /** 弹窗宽度 */
        width?: string | number;
        /** 是否开启缩放模式 */
        zoom?: boolean;
        /** 是否异步关闭 */
        asyncClose?: boolean;
        /** 是否点击遮罩层关闭 */
        closeOnClickOverlay?: boolean;
        /** 是否展示确认按钮 */
        showConfirmButton?: boolean;
        /** 是否展示取消按钮 */
        showCancelButton?: boolean;
        /** 确认按钮文字 */
        confirmText?: string;
        /** 取消按钮文字 */
        cancelText?: string;
    }>(),
    {
        modelValue: false,
        title: '',
        content: '是否确认提交？',
        width: '600rpx',
        zoom: true,
        asyncClose: false,
        closeOnClickOverlay: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmText: '确认',
        cancelText: '取消',
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    /** 更新弹窗是否显示 */
    (e: 'update:modelValue', visible: boolean): void;
    (e: 'confirm'): void;
    (e: 'cancel'): void;
    (e: 'close'): void;
}>();

/**
 * useIndex
 */
const { show, handleConfirm, handleCancel, handleClose } = useIndex(props, emit);
</script>
