<template>
    <view class="wrap">
        <u-input
            v-model="selectLabel"
            border="surround"
            placeholder="请选择"
            readonly
            v-bind="schema?.attributes"
            @click="handlePopupOpen"
        >
            <template #suffix>
                <view class="suffix-wrap">
                    <!-- uviewPlus 标签不支持 .stop，但 view 标签可以 -->
                    <view
                        v-if="selectLabel && schema?.attributes?.clearable && !schema?.attributes?.disabled"
                        @click.stop="handleClear"
                    >
                        <u-icon name="close-circle-fill" color="#C6C7CB" size="40rpx"></u-icon>
                    </view>
                    <view v-else>
                        <u-icon :name="showPopup ? 'arrow-up' : 'arrow-down'" color="#C6C7CB" size="20rpx"></u-icon>
                    </view>
                </view>
            </template>
        </u-input>

        <!-- 弹出层 -->
        <u-popup mode="left" :show="showPopup" :custom-style="popupStyle" :close-on-click-overlay="false">
            <view class="popup">
                <!-- 查询 -->
                <u-search
                    v-model="keyword"
                    placeholder="请输入关键字"
                    :input-style="inputStyle"
                    search-icon-size="40rpx"
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

                <!-- 按钮 -->
                <view class="button-style">
                    <u-button type="info" text="取消" :custom-style="buttonStyle" @click="handleCancel"></u-button>
                    <u-button type="primary" text="确定" :custom-style="buttonStyle" @click="handleConfirm"></u-button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useIndex from './useIndex';
import type { Schema, Options } from '../../interface';

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
        schema: Schema;
    }>(),
    {
        schema: () => {
            return {
                prop: '',
                label: '',
                type: 'SearchSelect',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleSelect', val: { value: Options; schema: Schema; isClear: boolean }): void;
}>();

const {
    selectType,
    selectLabel,
    sourceList,
    showPopup,
    keyword,
    radioValue,
    checkboxValue,
    showList,
    handleClear,
    handlePopupOpen,
    handlePopupClose,
    handleConfirm,
    handleCancel,
    handleSearchSearch,
    handleSearchClear,
    handleRadioChange,
    handleCheckChange,
    handleSearchSelect,
    handleValueAndLabel,
} = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    async setData(val: string | number) {
        // 处理值
        handleValueAndLabel(val);

        // 下拉列表赋值
        handleSearchSelect();
    },
});
</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
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
