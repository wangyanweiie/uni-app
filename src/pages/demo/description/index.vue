<template>
    <view class="view-wrap">
        <view v-for="(item, index) in dataList" :key="index" class="description">
            <x-description :columns="columns" :data="item">
                <template #topLeft>
                    <view>{{ item.name }}</view>
                </template>

                <template #topRight>
                    <u-tag text="完成" type="success" size="mini"></u-tag>
                </template>

                <template #bottom>
                    <u-button type="primary" plain size="small">上传</u-button>
                </template>
            </x-description>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { XDescriptionColumn } from '@/components/x-description/interface';

const columns: XDescriptionColumn[] = [
    {
        label: '姓名',
        prop: 'name',
    },
    {
        label: '姓别',
        prop: 'sex',
    },
    {
        label: '年龄',
        prop: 'age',
    },
    {
        label: '爱好',
        prop: 'hobby',
    },
    {
        label: '地址',
        prop: 'address',
    },
];

const dataList = [
    {
        name: '小明',
        sex: '男',
        age: '25',
        hobby: '跑步',
        address: '南京',
    },
    {
        name: '小红',
        sex: '女',
        age: '24',
        hobby: '跳绳',
        address: '南京',
    },
];
</script>
<style lang="scss" scoped>
.description {
    margin-bottom: 20rpx;
}
</style>
