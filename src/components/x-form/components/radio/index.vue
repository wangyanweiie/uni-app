<template>
    <view class="radio-style">
        <u-radio-group v-model="radioValue" v-bind="schema?.attributes" placement="row">
            <u-radio
                v-for="(item, index) in radioList"
                :key="index"
                :label="item.label"
                :name="item.value"
                size="22px"
                icon-size="14px"
                label-size="14px"
                :custom-style="{ marginRight: '40rpx' }"
                @change="handleChange(item)"
            >
            </u-radio>
        </u-radio-group>
    </view>
</template>

<script lang="ts">
export default {
    name: 'BaseRadio',
};
</script>

<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema, Options } from '../../interface';

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
                type: 'BaseRadio',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleEmit', val: { value: number | string; formItem: Schema; isClear: boolean }): void;
}>();

/**
 * useIndex
 */
const { radioValue, radioList, handleChange } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    setData(val: string | number) {
        radioValue.value = val;

        // 更新单选列表
        if (props.schema?.options?.length) {
            radioList.value = props.schema?.options;
        }
    },
});
</script>

<style lang="scss" scoped>
.radio-style {
    display: flex;
    align-items: center;
}
:deep(.u-radio) {
    height: 70rpx;
    line-height: 70rpx;
    margin: 0;
}
</style>
