<template>
    <view class="view-wrap">
        <table class="table" :cellspacing="0" :cellpadding="4" width="100%">
            <tr align="center">
                <template v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex">
                    <th :width="headerItem?.width || 150" :align="headerItem?.align || 'center'" class="table_th">
                        {{ headerItem.label }}
                    </th>
                </template>
            </tr>

            <!-- 跨行合并 -->
            <tr v-for="(dataItem, dataIndex) in combineCell(tableData)" :key="dataIndex">
                <template v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex">
                    <td
                        v-if="!dataItem[`${headerItem.prop}Dis`]"
                        :rowspan="dataItem[`${headerItem.prop}Span`]"
                        :align="headerItem?.align || 'center'"
                        class="table_td"
                    >
                        {{ dataItem?.[headerItem.prop] }}
                    </td>
                </template>
            </tr>
        </table>
    </view>
</template>

<script lang="ts" setup>
import { combineCell } from './hooks';

/**
 * 表头列表
 */
const tableHeader: any = [
    {
        prop: 'name',
        label: '姓名',
    },
    {
        prop: 'course',
        label: '科目',
    },
    {
        prop: 'score',
        label: '分数',
    },
    {
        prop: 'rank',
        label: '排名',
    },
];

/**
 * 表格数据
 */
const tableData: any = [
    {
        name: '张三',
        course: '语文',
        score: 90,
        rank: 1,
    },
    {
        name: '张三',
        course: '数学',
        score: 95,
        rank: 1,
    },
    {
        name: '张三',
        course: '英语',
        score: 95,
        rank: 1,
    },
];
</script>
<style lang="scss" scoped>
.table {
    color: #909399;

    &_th {
        white-space: nowrap;
    }

    .required-style {
        color: red;
    }

    :deep(th) {
        height: 70rpx;
        background-color: #f5f6f8;
        border: 1px solid #eee;
    }

    :deep(td) {
        border: 1px solid #eee;
    }
}
</style>
