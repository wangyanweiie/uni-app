<template>
    <view class="wrap">
        <!-- 纯文本展示样式 -->
        <!-- <view class="content">
            <view>
                <view v-if="!selectLabel" class="content-placeholder">{{ placeholder }}</view>
                <view v-else class="content-text">{{ selectLabel }}</view>
            </view>

            <view v-if="clearable" class="clear-style">
                <u-icon name="close-circle-fill" size="40rpx" color="#C6C7CB" @click="handleClear"></u-icon>
            </view>

            <view class="button-style">
                <u-button
                    type="primary"
                    text="选择"
                    size="small"
                    :disabled="disabled"
                    @click="handlePopupOpen"
                ></u-button>
            </view>
        </view> -->

        <!-- 输入框禁用样式 -->
        <u-input
            v-model="selectLabel"
            readonly
            :border="border"
            :placeholder="placeholder"
            :disabled="disabled"
            @click="handlePopupOpen"
        >
            <template #suffix>
                <view class="suffix-wrap">
                    <!-- uviewPlus 标签不支持 .stop，但 view 标签可以 -->
                    <view v-if="selectLabel && clearable && !disabled" @click.stop="handleClear">
                        <u-icon name="close-circle-fill" color="#C6C7CB" size="40rpx"></u-icon>
                    </view>
                    <view v-else>
                        <u-icon :name="showPopup ? 'arrow-up' : 'arrow-down'" color="#C6C7CB" size="20rpx"></u-icon>
                    </view>
                </view>
            </template>
        </u-input>

        <!-- 弹出层 -->
        <u-popup mode="left" :show="showPopup" :custom-style="popupStyle" :close-on-click-overlay="closeOnClickOverlay">
            <view class="popup">
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

                <view v-if="showList.length" class="select-style">
                    <!-- 单选 -->
                    <view v-if="selectType === 'radio'">
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
                    <view v-if="selectType === 'checkbox'">
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
                </view>
                <view v-else class="empty-style"></view>

                <view class="button-style">
                    <u-button
                        type="info"
                        text="取消"
                        :custom-style="buttonStyle"
                        @click="handleButtonCancel"
                    ></u-button>
                    <u-button
                        type="primary"
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
        /** 边框 */
        border?: 'surround' | 'bottom' | 'none';
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
        border: 'surround',
        placeholder: '请选择',
        clearable: false,
        disabled: false,
        multiple: false,
        closeOnClickOverlay: false,
        api: null,
        apiParams: () => ({}),
        options: () => [],
    },
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
    selectLabel,
    handleClear,
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
}

.content {
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
        width: 70%;
        height: 24px;
        line-height: 24px;
        margin: 10rpx 10rpx 0 0;
        white-space: nowrap;
        overflow-x: scroll;
        position: absolute;
        left: 0;
    }

    .clear-style {
        padding: 6px;
        position: absolute;
        right: 120rpx;
    }

    .button-style {
        width: 116rpx;
        display: flex;
        align-items: center;
        position: absolute;
        right: 5rpx;
    }
}

.popup {
    height: 95vh;
    position: relative;

    .select-style {
        height: 85%;
        overflow-y: auto;
    }

    .empty-style {
        height: 85%;
    }

    .button-style {
        margin-top: 30rpx;
        position: static;
        bottom: 20rpx;
        display: flex;
    }
}

.suffix-wrap {
    display: flex;
    align-items: center;
}
</style>
