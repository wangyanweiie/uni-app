<template>
    <view class="view-wrap">
        <view v-for="(formItem, formIndex) in formList" :key="formIndex" class="item-wrap">
            <view class="title">
                <view class="title__text">{{ `子表单 ${formIndex + 1}` }}</view>
                <view v-if="formIndex + 1 === formList.length" class="title__button">
                    <u-button type="success" size="small" class="title__button__item" @click="addFormItem">
                        添加
                    </u-button>
                    <u-button v-if="formList.length > 1" type="error" size="small" @click="deleteFormItem(formIndex)">
                        删除
                    </u-button>
                </view>
            </view>

            <u-form
                :ref="(el: FormInstance) => handleFormInstance(el, `formRef${formIndex}`)"
                :model="formItem"
                :rules="rules"
                label-position="left"
                label-width="150rpx"
            >
                <u-form-item label="姓名" required prop="name">
                    <u-input v-model="formItem.name" placeholder="请输入姓名" clearable></u-input>
                </u-form-item>
                <u-form-item label="年龄" required prop="age">
                    <u-input v-model="formItem.age" placeholder="请输入年龄" clearable></u-input>
                </u-form-item>
                <u-form-item label="性别" required prop="sex">
                    <u-radio-group v-model="formItem.sex" size="34rpx" placement="row">
                        <u-radio
                            label="男"
                            :name="1"
                            label-size="28rpx"
                            :custom-style="{ marginRight: '40rpx' }"
                        ></u-radio>
                        <u-radio
                            label="女"
                            :name="2"
                            label-size="28rpx"
                            :custom-style="{ marginRight: '40rpx' }"
                        ></u-radio>
                    </u-radio-group>
                </u-form-item>
            </u-form>
        </view>

        <view class="button-wrap">
            <u-button class="button-wrap__item" type="success" @click="handleSubmit">提交</u-button>
        </view>
    </view>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRule } from '@/interface/form';
import { ref } from 'vue';

/**
 * 表单实例对象
 */
const formRefObj = ref<Record<string, FormInstance>>({});

/**
 * 收集表单实例
 * @param instance 表单实例
 * @param prop 实例字段 key 值
 */
function handleFormInstance(instance: FormInstance, prop: string) {
    if (instance) {
        formRefObj.value[prop] = instance;
    }
}

/**
 * 表单
 */
const formList = ref<any[]>([
    {
        name: '',
        age: '',
        sex: '',
    },
]);

/**
 * 校验规则
 */
const rules = ref<Record<string, FormRule[]>>({
    name: [{ required: true, message: '姓名不能为空' }],
    age: [{ required: true, message: '年龄不能为空' }],
    sex: [{ required: true, message: '性别不能为空' }],
});

/**
 * 添加/删除表单项
 */
function addFormItem() {
    formList.value.push({
        name: '',
        age: '',
        sex: '',
    });
}

function deleteFormItem(index: number) {
    uni.showModal({
        title: '',
        content: '是否确认删除？',
        success: res => {
            if (res.confirm) {
                formList.value.splice(index, 1);

                // 同步删除掉新增子项时 formRefObj 对象中添加的 formRef
                delete formRefObj.value[`formRef${index}`];
            }
        },
    });
}

/**
 * 提交
 */
async function handleSubmit() {
    console.log('formRefObj：', formRefObj.value);

    let valid = false;

    for (let i in formRefObj.value) {
        // 子表单依次触发校验
        valid = await formRefObj.value[i]?.validate();
    }

    if (!valid) {
        return;
    }

    uni.showModal({
        title: '',
        content: '是否确认提交？',
        success: res => {
            if (res.confirm) {
                console.log('formList：', formList.value);
            }
        },
    });
}
</script>
<style scoped lang="scss">
.item-wrap {
    padding: 20rpx;
    border: 2rpx solid #eee;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
}

.title {
    display: flex;
    justify-content: space-around;

    &__text {
        font-size: 32rpx;
        width: 100%;
        color: #2979ff;
        margin: 20rpx 0;
    }

    &__button {
        display: flex;

        &__item {
            margin-right: 10rpx;
        }
    }
}
</style>
