<template>
    <view class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" label-width="80">
            <u-form-item label="姓名" required prop="name">
                <u-input v-model="form.name" border="none" placeholder="请输入" />
            </u-form-item>
            <u-form-item label="爱好" required prop="hobby">
                <x-select v-model="form.hobby" :options="hobbyList" @change="handleHobby" />
            </u-form-item>
            <u-form-item label="课程" required prop="course">
                <x-search-select
                    v-model="form.course"
                    :options="courseList"
                    :multiple="true"
                    @handle-confirm-select="handleCourse"
                ></x-search-select>
            </u-form-item>
        </u-form>
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
});

/**
 * 表单校验
 */
const rules = ref({
    name: [{ required: true, message: '姓名不能为空' }],
    hobby: [{ required: true, message: '爱好不能为空' }],
    course: [{ required: true, message: '课程不能为空' }],
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
    console.log(e);
}

/**
 * 改变课程
 */
function handleCourse(e: any) {
    console.log(e);
}
</script>
