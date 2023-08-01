<template>
    <view style="width: 100%">
        <!-- 纯文本展示样式 -->
        <view class="wrap">
            <view>
                <view v-if="!text" class="content-placeholder">{{ placeholder }}</view>
                <view v-else class="content-text">{{ text }}</view>
            </view>

            <view v-if="clearable" class="clear-wrap">
                <u-icon name="close-circle-fill" size="40rpx" @click="handleTextClear"></u-icon>
            </view>

            <view class="button-wrap">
                <u-button
                    type="primary"
                    text="选择"
                    size="small"
                    :disabled="disabled"
                    @click="handlePopupOpen"
                ></u-button>
            </view>
        </view>

        <!-- 输入框禁用样式 -->
        <!-- <u-input v-model="text" border="none" disabled :placeholder="placeholder">
            <template #suffix>
                <view style="display: flex">
                    <u-icon v-if="clearable" name="close-circle-fill" size="40rpx" @click="handleTextClear"></u-icon>
                    <u-button
                        type="primary"
                        text="选择"
                        size="small"
                        :disabled="disabled"
                        style="margin-left: 10rpx"
                        @click="handlePopupOpen"
                    ></u-button>
                    <slot></slot>
                </view>
            </template>
        </u-input> -->

        <!-- 弹出层 -->
        <u-popup mode="left" :show="showPopup" :custom-style="popupStyle" :close-on-click-overlay="closeOnClickOverlay">
            <view class="info-box">
                <!-- 查询 -->
                <u-search
                    v-model="keyword"
                    placeholder="请输入关键字"
                    :input-style="inputStyle"
                    search-icon-size="20px"
                    @custom="handleSearchSearch"
                    @search="handleSearchSearch"
                    @clear="handleSearchClear"
                ></u-search>

                <!-- 单选 -->
                <view v-if="selectType === 'radio'" class="radio-style">
                    <u-radio-group v-model="radioValue" placement="column" @change="handleRadioChange">
                        <u-radio
                            v-for="(item, index) in showList"
                            :key="index"
                            :label="item.label"
                            :name="item.value"
                            size="22px"
                            icon-size="16px"
                            label-size="16px"
                            :custom-style="radioStyle"
                        >
                        </u-radio>
                    </u-radio-group>
                </view>

                <!-- 复选 -->
                <view v-if="selectType === 'checkbox'" class="checkbox-style">
                    <u-checkbox-group v-model="checkboxValue" placement="column" @change="handleCheckChange">
                        <u-checkbox
                            v-for="(item, index) in showList"
                            :key="index"
                            :label="item.label"
                            :name="item.value"
                            size="22px"
                            icon-size="16px"
                            label-size="16px"
                            :custom-style="checkboxStyle"
                        >
                        </u-checkbox>
                    </u-checkbox-group>
                </view>

                <view class="button-styles">
                    <u-button
                        type="primary"
                        text="取消"
                        :custom-style="buttonStyle"
                        @click="handleButtonCancel"
                    ></u-button>
                    <u-button
                        type="success"
                        text="确定"
                        :custom-style="buttonStyle"
                        @click="handleButtonConfirm"
                    ></u-button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useIndex from './useIndex';
import type { Options } from './interface';

const inputStyle = ref({ padding: '5px' });
const popupStyle = ref({ padding: '20px', width: '80%' });
const buttonStyle = ref({ margin: '0 5px' });
const radioStyle = ref({ marginTop: '15px' });
const checkboxStyle = ref({ marginTop: '15px' });

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定的值 => 用于展示的 label */
        modelValue: string;
        /** 提示文字 */
        placeholder?: string;
        /** 是否可清空 */
        clearable?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 是否多选 */
        multiple?: boolean;
        /** 是否可点击遮罩层关闭 */
        closeOnClickOverlay?: boolean;
        /** 下拉请求接口 */
        api?: any;
        /** 下拉请求接口参数 */
        apiParams?: any;
        /** 单选/复选框静态列表 */
        options?: Options[];
    }>(),
    {
        modelValue: '',
        placeholder: '请点击右侧选择',
        clearable: false,
        disabled: false,
        multiple: false,
        closeOnClickOverlay: false,
        api: null,
        apiParams: () => ({}),
        options: () => [],
    }
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void;
    (e: 'change', val: any): void;
    (e: 'clear'): void;
}>();

const {
    text,
    handleTextClear,
    showPopup,
    handlePopupOpen,
    selectType,
    handleButtonCancel,
    handleButtonConfirm,
    keyword,
    handleSearchSearch,
    handleSearchClear,
    radioValue,
    handleRadioChange,
    checkboxValue,
    handleCheckChange,
    showList,
} = useIndex(props, emit);
</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
    height: 70rpx;
    position: relative;

    .content-placeholder {
        width: 70%;
        height: 24px;
        line-height: 24px;
        margin: 10rpx 10rpx 0 0;
        white-space: nowrap;
        overflow-x: scroll;
        color: #cccfd6;
        position: absolute;
        left: 0;
    }

    .content-text {
        width: 50%;
        height: 24px;
        line-height: 24px;
        margin: 10rpx 10rpx 0 0;
        white-space: nowrap;
        overflow-x: scroll;
        position: absolute;
        left: 0;
    }

    .clear-wrap {
        padding: 6px;
        position: absolute;
        right: 120rpx;
    }

    .button-wrap {
        width: 116rpx;
        display: flex;
        align-items: center;
        position: absolute;
        right: 5rpx;
    }
}

.info-box {
    height: 100%;
    position: relative;

    .radio-style {
        height: 85%;
        overflow-y: auto;
    }

    .checkbox-style {
        height: 85%;
        overflow-y: auto;
    }

    .button-styles {
        margin-top: 30rpx;
        position: static;
        bottom: 20rpx;
        display: flex;
    }
}
</style>
