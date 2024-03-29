<template>
    <view class="view-wrap">
        <u-form ref="formRef" :model="form" :rules="rules" label-width="160rpx">
            <u-form-item label="姓名" required prop="name">
                <u-input v-model="form.name" border="surround" placeholder="请输入" :clearable="true" />
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
            <u-form-item label="日期" required prop="date">
                <x-date-picker
                    v-model="form.date"
                    date-type="datetime"
                    date-format="YYYY-MM-DD HH:mm:ss"
                    :clearable="true"
                    @change="handleDate"
                ></x-date-picker>
            </u-form-item>
            <u-form-item label="图片" required prop="uploadList">
                <x-upload v-model="form.uploadList"></x-upload>
            </u-form-item>
            <u-form-item label="视频" required prop="videoList">
                <x-upload v-model="form.videoList" accept="video"></x-upload>
            </u-form-item>
            <u-form-item label="签名" required prop="signatureUrl">
                <x-signature v-model="form.signatureUrl"></x-signature>
            </u-form-item>
        </u-form>

        <!-- 弹窗 -->
        <x-modal v-model="show" title="详情" @confirm="handleDetailConfirm">
            <template #default>
                <view>我是详情</view>
            </template>
        </x-modal>

        <view class="button-wrap">
            <u-button class="button-wrap__item" type="warning" @click="handleDetail">
                {{ $t('button.detail') }}
            </u-button>
            <u-button class="button-wrap__item" type="primary" @click="confirmSubmit(STATUS['保存'])">
                {{ $t('button.save') }}
            </u-button>
            <u-button class="button-wrap__item" type="success" @click="handleSubmit">
                {{ $t('button.submit') }}
            </u-button>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { returnLastPage } from '@/utils/hooks';

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
 * form 表单
 */
const form = ref<Record<string, any>>({
    name: '',
    hobby: '',
    course: '',
    date: '',
    uploadList: ['http://192.168.3.38:9000/lvling/1691377252283mhgg.jpg'],
    videoList: ['http://192.168.3.38:9000/lvling/1691669393119why.mp4'],
    signatureUrl: 'http://192.168.3.38:9000/lvling/170106405853943b8a124fc2e41d28f2929bf3f855591.jpg',
});

/**
 * 表单校验
 */
const rules = ref({
    name: [{ required: true, message: '姓名不能为空' }],
    hobby: [{ required: true, message: '爱好不能为空' }],
    course: [{ required: true, message: '课程不能为空' }],
    date: [{ required: true, message: '日期不能为空' }],
    uploadList: [{ required: true, message: '图片不能为空' }],
    videoList: [{ required: true, message: '视频不能为空' }],
    signatureUrl: [{ required: true, message: '签名不能为空' }],
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
 * 改变日期
 */
function handleDate(e: any) {
    console.log('date-picker', e);
}

/**
 * 是否展示弹窗
 */
const show = ref<boolean>(false);

/**
 * 详情
 */
function handleDetail() {
    show.value = true;
}

/**
 * 详情确认
 */
function handleDetailConfirm() {
    console.log('我是详情确认');
}

/**
 * 提交
 */
async function handleSubmit() {
    // 表单校验
    const valid = await formRef.value.validate();

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
    console.log('form', {
        ...form.value,
        status,
    });

    returnLastPage();
}
</script>
