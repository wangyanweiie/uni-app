<template>
    <view class="component">
        <u-textarea
            v-model="inputValue"
            border="surround"
            placeholder="请输入文本"
            :auto-height="true"
            v-bind="schema.attributes"
            @blur="handleBlur"
        ></u-textarea>
    </view>
</template>

<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema } from '../../interface';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'BaseTextarea',
});

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
                type: 'BaseTextarea',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleEmit', val: string | number): void;
}>();

/**
 * useIndex
 */
const { inputValue, handleBlur } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    setData(val: string | number) {
        inputValue.value = val;
    },
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}
</style>
