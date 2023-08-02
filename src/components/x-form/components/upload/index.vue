<template>
    <view class="wrap">
        <u-upload
            name="upload"
            :file-list="fileList"
            v-bind="schema?.attributes"
            width="80rpx"
            height="80rpx"
            @delete="handleDelete"
            @after-read="handleAfterRead"
        >
            <u-image width="80rpx" height="80rpx" src="./images/photo.png" />
        </u-upload>
    </view>
</template>
<script lang="ts">
export default {
    name: 'BaseUpload',
};
</script>
<script setup lang="ts">
import useIndex from './useIndex';
import type { Schema } from '../../interface';

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
                type: 'BaseUpload',
            };
        },
    }
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
const { fileList, handleInit, handleAfterRead, handleDelete } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    fileList,

    setData(val: any) {
        handleInit(val);
    },
});
</script>
<style lang="scss" scoped>
.wrap {
    height: 70rpx;
}
</style>
