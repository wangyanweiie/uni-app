<template>
    <view class="component">
        <view class="operation" @click="openPopup">
            <view class="operation__placeholder"> {{ placeholder }} </view>

            <view v-show="signatureUrl" class="operation__image" @click.stop="preview(signatureUrl)">
                <image mode="aspectFill" :src="signatureUrl"></image>
            </view>

            <view v-show="signatureUrl && clearable && !disabled" class="operation__icon" @click.stop="handleClear">
                <u-icon name="close-circle-fill" color="#C6C7CB" size="40rpx"></u-icon>
            </view>
        </view>

        <u-popup :show="showPopup" close-on-click-overlay>
            <canvas
                type="2d"
                disable-scroll="true"
                class="canvasId"
                canvas-id="canvasId"
                @touchstart="handleTouchstart"
                @touchmove="handleTouchmove"
                @touchend="handleTouchend"
            ></canvas>

            <view class="button-wrap">
                <u-button type="primary" class="button-wrap__item" @click="finishCanvas">上传</u-button>
                <u-button type="error" class="button-wrap__item" @click="clearCanvas">清空</u-button>
                <u-button type="info" class="button-wrap__item" @click="closePopup">关闭</u-button>
            </view>
        </u-popup>
    </view>
</template>
<script lang="ts" setup>
import useIndex from './useIndex';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XSignature',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定的值，生成的签名路径 */
        modelValue: string;
        /** 提示文字 */
        placeholder?: string;
        /** 是否可清空 */
        clearable?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
    }>(),
    {
        modelValue: '',
        placeholder: '请点击签名',
        clearable: true,
        disabled: false,
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    /** 更新弹窗是否显示 */
    (e: 'update:modelValue', visible: boolean): void;
    (e: 'confirm', url: string): void;
    (e: 'clear'): void;
}>();

/**
 * useIndex
 */
const {
    signatureUrl,
    showPopup,
    openPopup,
    handleTouchstart,
    handleTouchmove,
    handleTouchend,
    finishCanvas,
    clearCanvas,
    closePopup,
    preview,
    handleClear,
} = useIndex(props, emit);
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}

.operation {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 78rpx;
    border: 1px dotted #ccc;
    border-radius: 10rpx;

    &__placeholder {
        max-width: 400rpx;
        white-space: nowrap;
        overflow-x: auto;
        color: #ececec;
        text-align: center;
        margin-right: 20rpx;
    }

    &__image {
        image {
            width: 60rpx;
            height: 60rpx;
        }
    }

    &__icon {
        position: absolute;
        right: 18rpx;
    }
}

.canvasId {
    width: 100%;
    height: calc(70vh);
    background-color: #ececec;
}
</style>
