<template>
    <view class="view-wrap">
        <x-table
            ref="tableRef"
            :table-header="columns"
            :api="api"
            :api-params="apiParams"
            :show-index="true"
            :selectable="true"
            title="日志"
        >
            <!-- 顶部操作 -->
            <template #operation="{ checkRows }">
                <u-button type="warning" size="small" style="width: 60px" @click="handleClose(checkRows)">
                    关闭
                </u-button>
                <u-button
                    type="success"
                    size="small"
                    style="width: 60px; margin-left: 10px"
                    @click="handleReview(checkRows)"
                >
                    复核
                </u-button>
            </template>

            <template #status="{ row }">
                {{ row.statusName }}
            </template>

            <!-- 操作列 -->
            <template #action="{ row }">
                <u-button type="primary" size="small" style="width: 60px" @click="handleDelete(row)">删除</u-button>
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
 * 复核
 */
function handleReview(checkRows: Record<string, any>[]) {
    console.log('review', checkRows);
}

/**
 * 删除
 */
function handleDelete(row: Record<string, any>[]) {
    console.log('delete', row);
}
</script>
