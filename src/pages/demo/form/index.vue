<template>
    <view class="view-wrap">
        <x-form ref="formRef" :schema-list="schemas"></x-form>

        <view style="margin: 10px">
            <u-button type="success" @click="handleSubmit">提交</u-button>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { schemas } from './conf';

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

    // 获取表单数据
    form.value = formRef.value.getForm();
    console.log('form', form.value);
}
</script>
