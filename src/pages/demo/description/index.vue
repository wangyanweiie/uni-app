<template>
    <view class="view-wrap">
        <x-descriptions :columns="columns" :api="api" :api-params="apiParams">
            <template #topLeft="{ row }">
                <view>登录时间：{{ row.addTime }}</view>
            </template>

            <template #topRight="{ row }">
                <u-tag
                    :text="STATUS[row.status]"
                    :type="STATUS[row.status] === '成功' ? 'success' : 'error'"
                    size="mini"
                ></u-tag>
            </template>
        </x-descriptions>
    </view>
</template>
<script lang="ts" setup>
import RequestAPI from './api';
import { STATUS, columnList } from './conf';

/**
 * 表格 API
 */
const api = RequestAPI.index;

/**
 * 表格 API 参数
 */
const apiParams = {
    type: 2,
};

/**
 * 表格列
 */
const columns = columnList;
</script>
<style lang="scss" scoped></style>
