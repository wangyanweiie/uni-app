<template>
    <view class="title">
        <h4 class="label">{{ label }}</h4>
    </view>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        label?: string;
    }>(),
    {
        label: '',
    }
);
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    align-items: center;
    height: 25px;
    padding-left: 5px;
    font-size: 15px;
    color: $u-primary;
}
</style>
