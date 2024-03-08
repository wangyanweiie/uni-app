<template>
    <view class="title">
        <h4 class="label">{{ title }}</h4>
    </view>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        /** 标题 */
        title?: string;
    }>(),
    {
        title: '',
    },
);
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    height: 25px;
    align-items: center;
}

.label {
    font-size: 16px;
    padding-left: 5px;
    color: $uni-text-color;
}
</style>
