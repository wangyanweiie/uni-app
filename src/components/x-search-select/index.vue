<template>
    <view class="component">
        <u-input
            v-model="selectLabel"
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
                    class="popup__search"
                    @custom="handleSearchSearch"
                    @search="handleSearchSearch"
                    @clear="handleSearchClear"
                ></u-search>

                <!-- 选择框 -->
                <view v-if="showList.length" class="popup__select">
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
                <view v-else class="popup__empty"></view>

                <!-- 按钮 -->
                <view class="popup__button">
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
 * 定义组件选项
 */
defineOptions({
    name: 'XSearchSelect',
});

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
.component {
    width: 100%;
}

.popup {
    height: 95vh;
    position: relative;

    &__search {
        padding-bottom: 20rpx;
    }

    &__select {
        height: 80%;
        overflow-y: auto;
    }

    &__empty {
        height: 80%;
    }

    &__button {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 30rpx;
        display: flex;
    }
}

.suffix-wrap {
    display: flex;
    align-items: center;
}
</style>
