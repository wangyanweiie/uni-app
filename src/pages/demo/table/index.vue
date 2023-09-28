<template>
    <view class="view-wrap">
        <x-table
            ref="tableRef"
            :columns="columns"
            :api="api"
            :api-params="apiParams"
            :show-index="true"
            :selectable="true"
            :row-style="handleRowStyle"
            :selected-list="[0, 1]"
            title="日志"
        >
            <!-- 顶部操作 -->
            <template #operation="{ checkRows }">
                <u-button type="warning" size="small" @click="handleClose(checkRows)"> 关闭 </u-button>
            </template>

            <!-- 操作列 -->
            <template #action="{ row }">
                <u-button type="primary" size="small" style="width: 120rpx" @click="openDetail(row)"> 详情 </u-button>
            </template>
        </x-table>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import RequestAPI from './api';
import { columnList } from './conf';

/**
 * 表格 ref
 */
const tableRef = ref();

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

/**
 * 关闭
 */
function handleClose(checkRows: Record<string, any>[]) {
    console.log('close', checkRows);
}

/**
 * 详情
 */
function openDetail(row: Record<string, any>) {
    console.log('detail', row);
}

/**
 * 表格行颜色
 */
function handleRowStyle(row: Record<string, any>, rowIndex: number) {
    if (!rowIndex) {
        return {
            backgroundColor: '#fad8d6',
        };
    }
}
</script>
