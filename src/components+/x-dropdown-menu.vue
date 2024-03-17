<template>
    <view class="dropdown-menu">
        <slot name="default"></slot>
    </view>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import { DROPDOWN_MENU, type DropdownMenuProvider } from './dropdown';

/**
 * 当前选中 child id
 */
const activeChildId = ref<number>(-1);

/**
 * dropdown menu 下的 children
 */
const children = ref<number[]>([]);

/**
 * 添加 child
 */
function addChild(child?: number): void {
    if (child === undefined) {
        return;
    }

    children.value.push(child);
}

/**
 * 提供给子组件状态和方法
 */
provide<DropdownMenuProvider>(DROPDOWN_MENU, { activeChildId, addChild });
</script>

<style lang="scss" scoped>
.dropdown-menu {
    display: flex;
    height: 50px;
    box-shadow: 0 2px 12px rgba(100, 101, 102, 0.12);
    background-color: #fff;
    position: relative;
}
</style>
