<template>
    <view class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" label-width="80">
            <u-form-item label="姓名" required prop="name">
                <u-input v-model="form.name" border="none" placeholder="请输入" :clearable="true" />
            </u-form-item>
            <u-form-item label="爱好" required prop="hobby">
                <x-select v-model="form.hobby" :options="hobbyList" :clearable="true" @change="handleHobby" />
            </u-form-item>
            <u-form-item label="课程" required prop="course">
                <x-search-select
                    v-model="form.course"
                    :options="courseList"
                    :clearable="true"
                    :multiple="true"
                    @change="handleCourse"
                ></x-search-select>
            </u-form-item>
            <u-form-item label="出生日期" required prop="date">
                <x-date-picker
                    v-model="form.date"
                    datePickType="datetime"
                    datetimeFormat="YYYY-MM-DD HH:mm:ss"
                    :clearable="true"
                ></x-date-picker>
            </u-form-item>
        </u-form>

        <view style="margin: 10px">
            <u-button type="success" style="width: 200px" @click="handleSubmit">提交</u-button>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

/**
 * form ref
 */
const formRef = ref();

/**
 * form 表单
 */
const form = ref<Record<string, any>>({
    name: '',
    hobby: '',
    course: '',
    date: '',
});

/**
 * 表单校验
 */
const rules = ref({
    name: [{ required: true, message: '姓名不能为空' }],
    hobby: [{ required: true, message: '爱好不能为空' }],
    course: [{ required: true, message: '课程不能为空' }],
    date: [{ required: true, message: '出生日期不能为空' }],
});

/**
 * 爱好列表
 */
const hobbyList = [
    { label: '跑步', value: 1 },
    { label: '篮球', value: 2 },
    { label: '足球', value: 3 },
    { label: '羽毛球', value: 4 },
    { label: '乒乓球', value: 5 },
];

/**
 * 课程列表
 */
const courseList = [
    { label: '语文', value: 1 },
    { label: '数学', value: 2 },
    { label: '英语', value: 3 },
    { label: '政治', value: 4 },
    { label: '历史', value: 5 },
    { label: '地理', value: 6 },
    { label: '生物', value: 7 },
    { label: '物理', value: 8 },
    { label: '化学', value: 9 },
];

/**
 * 改变爱好
 */
function handleHobby(e: any) {
    console.log('select', e);
}

/**
 * 改变课程
 */
function handleCourse(e: any) {
    console.log('search-select', e);
}

/**
 * 提交
 */
function handleSubmit() {
    // 表单校验
    const valid = formRef.value.validate();

    if (!valid) {
        return;
    }

    // 获取表单数据
    console.log('form', form.value);
}
</script>
