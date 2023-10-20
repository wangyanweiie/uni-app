<template>
    <div class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="150rpx">
            <view v-for="(item, index) in form.list" :key="index">
                <view>
                    <u-tag :text="`子表单 ${index + 1}`" type="primary" size="mini" plain plain-fill></u-tag>
                </view>

                <u-form-item label="姓名" required :prop="`list.${index}.name`">
                    <u-input v-model="item.name" placeholder="请输入姓名" clearable></u-input>
                </u-form-item>
                <u-form-item label="年龄" required :prop="`list.${index}.age`">
                    <u-input v-model="item.age" placeholder="请输入年龄" clearable></u-input>
                </u-form-item>
            </view>
        </u-form>

        <view class="button-wrap">
            <u-button class="button-wrap__item" type="success" @click="handleSubmit">提交</u-button>
        </view>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

/**
 * form-ref
 */
const formRef = ref();

/**
 * 表单
 */
const form = ref<Record<string, any>>({
    list: [
        { name: '', age: '' },
        { name: '', age: '' },
    ],
});

/**
 * 校验规则
 */
const rules = {
    name: [{ required: true, message: '姓名不能为空', trigger: ['change', 'blur'] }],
    age: [{ required: true, message: '年龄不能为空', trigger: ['change', 'blur'] }],
};

/**
 * 提交
 */
async function handleSubmit() {
    let formValid = false;

    await formRef.value.validate((valid: any) => {
        formValid = valid;
    });

    if (!formValid) {
        return false;
    }

    console.log('form', form.value);
}
</script>
