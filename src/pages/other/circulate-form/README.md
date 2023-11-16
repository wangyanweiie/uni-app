# 动态循环表单校验（uviewPlus）

> 开发 APP 应用，当使用 `uviewPlus` 中的 `u-form` 开发表单时，若需要实现循环表单，可借用借助 `watch` 函数动态生成并更新 `rules` 实现表单校验。

## 一、效果图

## 二、源代码

*PS：由于循环表单可能是可以动态增删的，当添加时子表单时会触发 watch 事件从而同步更新 rules；但是当删除子表单时 rules 中并不会同步删除该子表单对应的校验规则，所以需要在删除事件中根据该子表单的索引在rules中手动删除对应的校验规则；这样才可以保持循环表单与校验规则的一致性。*

``` html
<template>
    <view class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="150rpx">
            <view v-for="(item, index) in form.list" :key="index" class="item-wrap">
                <view class="title">
                    <view class="title__text">{{ `子表单 ${index + 1}` }}</view>
                    <view v-if="index + 1 === form.list.length" class="title__button">
                        <u-button type="success" size="small" class="title__button__item" @click="addFormItem">
                            添加
                        </u-button>
                        <u-button v-if="form.list.length > 1" type="error" size="small" @click="deleteFormItem(index)">
                            删除
                        </u-button>
                    </view>
                </view>

                <u-form-item label="姓名" required :prop="`list.${index}.name`">
                    <u-input v-model="item.name" placeholder="请输入姓名" clearable></u-input>
                </u-form-item>
                <u-form-item label="年龄" required :prop="`list.${index}.age`">
                    <u-input v-model="item.age" placeholder="请输入年龄" clearable></u-input>
                </u-form-item>
            </view>

            <u-form-item label="性别" required prop="sex">
                <u-radio-group v-model="form.sex" size="34rpx" placement="row">
                    <u-radio label="男" :name="1" label-size="28rpx" :custom-style="{ marginRight: '40rpx' }"></u-radio>
                    <u-radio label="女" :name="2" label-size="28rpx" :custom-style="{ marginRight: '40rpx' }"></u-radio>
                </u-radio-group>
            </u-form-item>
        </u-form>

        <view class="button-wrap">
            <u-button class="button-wrap__item" type="success" @click="handleSubmit">提交</u-button>
        </view>
    </view>
</template>
```

``` typescript
<script lang="ts" setup>
import type { FormInstance, FormRule } from '@/interface/form';
import { ref, watch, onMounted } from 'vue';

/**
 * form
 */
const formRef = ref<FormInstance>();

const form = ref<Record<string, any>>({
    list: [],
    sex: '',
});

const rules = ref<Record<string, FormRule[]>>({
    sex: [{ required: true, message: '性别不能为空' }],
});

/**
 * 添加表单项
 */
function addFormItem() {
    form.value.list.push({
        name: '',
        age: '',
    });
}


/**
 * 删除表单项
 */
function deleteFormItem(index: number) {
    uni.showModal({
        title: '',
        content: '是否确认删除？',
        success: res => {
            if (res.confirm) {
                form.value.list.splice(index, 1);

                // 同步删除掉新增子项时 rules 对象中添加的校验规则
                delete rules.value[`list.${index}.name`];
                delete rules.value[`list.${index}.age`];
            }
        },
    });
}

/**
 * 提交
 */
async function handleSubmit() {
    const valid = await formRef.value!.validate();

    if (!valid) {
        return false;
    }

    uni.showModal({
        title: '',
        content: '是否确认提交？',
        success: res => {
            if (res.confirm) {
                console.log('form', form.value);
            }
        },
    });
}

/**
 * 监听
 */
watch(
    () => form.value.list,
    (newValue: Record<string, string | number>[]) => {
        newValue.forEach((item, index) => {
            rules.value[`list.${index}.name`] = [{ required: true, message: '姓名不能为空' }];
            rules.value[`list.${index}.age`] = [{ required: true, message: '年龄不能为空' }];
        });
    },
    {
        deep: true,
    },
);

/**
 * 页面渲染
 */
onMounted(() => {
    // 首次手动触发监听，生成 rules
    form.value.list = [
        {
            name: '',
            age: '',
        },
    ];
});
</script>
```

``` scss
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

.button-wrap {
    display: flex;
    margin: 30rpx 0;

    &__item {
        flex-grow: 1;
        margin: 0 10rpx;
    }
}
</style>
```
