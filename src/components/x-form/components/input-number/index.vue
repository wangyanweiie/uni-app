<template>
    <view class="component">
        <u-input
            v-model="inputValue"
            border="surround"
            placeholder="请输入数字"
            v-bind="schema?.attributes"
            @blur="handleBlur"
            @clear="handleClear"
        >
            <template #suffix>
                <view v-if="schema?.inputSlots" class="suffix-wrap">
                    <text v-if="schema?.inputSlots?.renderType === 'text'">{{ schema?.inputSlots?.content }}</text>
                    <u-tag
                        v-else-if="schema?.inputSlots?.renderType === 'tag'"
                        :text="schema?.inputSlots?.content"
                        v-bind="schema?.inputSlots?.attribute"
                    ></u-tag>
                    <slot v-else></slot>
                </view>
            </template>
        </u-input>
    </view>
</template>

<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema } from '../../interface';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'InputNumber',
});

/**
 * prop
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
                type: 'InputNumber',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleEmit', val: number): void;
}>();

/**
 * useIndex
 */
const { inputValue, handleNumber, handleBlur, handleClear } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    setData(val: number) {
        inputValue.value = handleNumber(val);
    },
});
</script>

<style lang="scss" scoped>
.component {
    width: 100%;
}

.suffix-wrap {
    display: flex;
    align-items: center;
}
</style>
