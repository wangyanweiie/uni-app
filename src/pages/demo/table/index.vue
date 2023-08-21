<template>
    <view class="view-wrap">
        <x-table
            ref="tableRef"
            :table-header="columns"
            :api="api"
            :api-params="apiParams"
            :show-index="true"
            :selectable="true"
            :row-style="handleRowStyle"
            title="日志"
        >
            <!-- 顶部操作 -->
            <template #operation="{ checkRows }">
                <u-button type="error" size="small" @click="handleClose(checkRows)"> 批量删除 </u-button>
            </template>

            <!-- 操作列 -->
            <template #action="{ row }">
                <u-button type="error" size="small" style="width: 120rpx" @click="handleDelete([row])"> 删除 </u-button>
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
 * 删除
 */
function handleDelete(rows: Record<string, any>[]) {
    console.log('delete', rows);
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
