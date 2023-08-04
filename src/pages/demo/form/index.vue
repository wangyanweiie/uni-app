<template>
    <view class="view-wrap">
        <!-- 表单 -->
        <x-form ref="formRef" :schema-list="schemas"></x-form>

        <view class="button-wrap">
            <u-button class="button-wrap__item" type="primary" @click="confirmSubmit(STATUS['保存'])"> 保存 </u-button>
            <u-button class="button-wrap__item" type="success" @click="handleSubmit">提交</u-button>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { schemas } from './conf';
/**
 * 保存/提交枚举
 */
enum STATUS {
    '保存' = 1,
    '提交' = 2,
}

/**
 * form ref
 */
const formRef = ref();

/**
 * 表单数据
 */
const form = ref<Record<string, any>>({});

/**
 * 提交
 */
async function handleSubmit() {
    // 表单校验
    const valid = await formRef.value.validForm();

    if (!valid) {
        return;
    }

    uni.showModal({
        title: '',
        content: '是否确认提交？',
        success: res => {
            if (res.confirm) {
                confirmSubmit(STATUS['提交']);
            }
        },
    });
}

/**
 * 确认提交
 */
function confirmSubmit(status: number) {
    // 获取表单数据
    form.value = formRef.value.getForm();
    console.log('form', {
        ...form.value,
        status,
    });
}
</script>
