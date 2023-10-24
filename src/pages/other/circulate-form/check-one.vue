<template>
    <view class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="150rpx">
            <view v-for="(item, index) in form.list" :key="index">
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
 * 添加/删除表单项
 */
function addFormItem() {
    form.value.list.push({
        name: '',
        age: '',
    });
}

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
<style scoped lang="scss">
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
            margin-right: 5px;
        }
    }
}
</style>
