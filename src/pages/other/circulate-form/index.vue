<template>
    <div class="view-wrap">
        <view v-for="(form, formIndex) in formList" :key="formIndex">
            <view>
                <u-tag :text="`子表单 ${formIndex + 1}`" type="primary" size="mini" plain plain-fill></u-tag>
            </view>

            <u-form
                :ref="(el: unknown) => handleCompInstance(el, `formRef${formIndex}`)"
                :model="form"
                :rules="rules"
                label-position="left"
                label-width="150rpx"
            >
                <u-form-item label="姓名" required prop="name">
                    <u-input v-model="form.name" placeholder="请输入姓名" clearable></u-input>
                </u-form-item>
                <u-form-item label="年龄" required prop="age">
                    <u-input v-model="form.age" placeholder="请输入年龄" clearable></u-input>
                </u-form-item>
            </u-form>
        </view>

        <view class="button-wrap">
            <u-button class="button-wrap__item" type="success" @click="handleSubmit">提交</u-button>
        </view>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

/**
 * 表单实例对象
 */
const formRefObj = ref({});

/**
 * 收集表单实例
 * @param instance 表单实例
 * @param prop 实例字段 key 值
 */
function handleCompInstance(instance: any, prop: string) {
    if (instance) {
        formRefObj.value[prop] = instance;
    }
}

/**
 * 表单
 */
const formList = ref<Record<string, any>>([
    { name: '', age: '' },
    { name: '', age: '' },
    { name: '', age: '' },
]);

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
    let valid = false;

    for (let i in formRefObj.value) {
        // 子表单依次触发校验
        valid = await formRefObj.value[i]?.validate();
    }

    if (!valid) {
        return;
    }

    console.log(valid);
    console.log(formList.value);
}
</script>
