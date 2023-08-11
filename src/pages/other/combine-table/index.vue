<template>
    <view class="view-wrap">
        <table class="table" :cellspacing="0" :cellpadding="4" width="100%">
            <tr align="center">
                <template v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex">
                    <th :width="headerItem?.width ?? 150" :align="headerItem?.align ?? 'center'" class="table_th">
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
                        :align="headerItem?.align ?? 'center'"
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
import { tableHeader, tableData } from './conf';
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
