<template>
    <u-toast ref="toastRef"></u-toast>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

/**
 * toast ref
 */
const toastRef = ref();

/**
 * show toast
 */
function showToast({ type = 'success', message = '操作成功', callBack = () => {} }) {
    toastRef.value.show({
        type,
        message,
        complete: callBack,
    });
}

/**
 * 子组件暴露的属性与方法
 */
defineExpose({
    toastRef,
    showToast,
});
</script>
