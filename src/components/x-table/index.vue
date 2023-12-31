<template>
    <view class="component">
        <!-- 顶部区域 -->
        <view class="operation">
            <view v-if="title" class="operation_text"> {{ title }} </view>
            <view class="operation_button">
                <slot name="operation" :check-rows="checkRows" :check-rows-index="checkRowsIndex" />
            </view>
        </view>

        <!-- 表格区域 -->
        <scroll-view scroll-y="true" :style="scrollStyle">
            <uni-table
                ref="tableRef"
                :key="key"
                :type="selectable ? 'selection' : ''"
                :loading="loading ? tableLoading : false"
                :stripe="stripe"
                :empty-text="emptyText"
                border
                class="table"
                @selection-change="handleSelectionChange"
            >
                <!-- 表头行 -->
                <uni-tr class="table_header">
                    <template v-for="(column, columnIndex) in columns" :key="column.prop">
                        <uni-th
                            :width="column?.width || 120"
                            :align="column?.align || 'center'"
                            :class="['table_header_th']"
                            :style="[
                                handleFixed(column?.fixedProps?.direction, column?.fixedProps?.distance, '#f5f6f8'),
                                typeof headerStyle === 'function' && headerStyle(column, columnIndex),
                            ]"
                        >
                            <text v-if="column?.required" class="table_header_required">*</text>
                            <text>{{ column.label }}</text>
                        </uni-th>
                    </template>
                </uni-tr>

                <!-- 表格数据行 -->
                <uni-tr
                    v-for="(row, rowIndex) in tableData"
                    :key="rowIndex"
                    :class="['table_content']"
                    @click="handleRowClick(row)"
                >
                    <template v-for="column in columns" :key="column.prop">
                        <uni-td
                            :align="column?.align || 'center'"
                            :class="['table_content_td']"
                            :style="[
                                handleFixed(column?.fixedProps?.direction, column?.fixedProps?.distance, '#fff'),
                                typeof rowStyle === 'function' && rowStyle(row, rowIndex),
                            ]"
                        >
                            <!-- 索引列 -->
                            <view v-if="column?.prop === 'index'">{{ rowIndex + 1 }}</view>

                            <!-- 操作列 -->
                            <view v-else-if="column?.prop === 'action'" class="table_content_action">
                                <slot :name="`${column.prop}`" :row="row" :index="rowIndex" />
                            </view>

                            <view v-else>
                                <slot
                                    :name="`${column.prop}Slot`"
                                    :row="row"
                                    :column="column"
                                    :cell-value="row[column.prop]"
                                >
                                    <!-- 标签 -->
                                    <view
                                        v-if="
                                            column?.renderType === 'tag' &&
                                            column?.formatter?.(row, column, row[column.prop])
                                        "
                                    >
                                        <u-tag
                                            :text="column?.formatter(row, column, row[column.prop])?.text"
                                            :type="column?.formatter(row, column, row[column.prop])?.type"
                                            :plain="true"
                                            :plain-fill="true"
                                            size="mini"
                                        >
                                        </u-tag>
                                    </view>

                                    <!-- 图片 -->
                                    <view
                                        v-else-if="
                                            column?.renderType === 'image' &&
                                            column?.formatter?.(row, column, row[column.prop])
                                        "
                                        class="table_content_image"
                                    >
                                        <image
                                            v-for="(imgUrl, imgIndex) in column?.formatter(
                                                row,
                                                column,
                                                row[column.prop],
                                            )"
                                            :key="imgIndex"
                                            :src="imgUrl"
                                            @click="handlePreview(imgUrl)"
                                        ></image>
                                    </view>

                                    <!-- 文本 -->
                                    <view v-else>
                                        {{ column?.formatter?.(row, column, row[column.prop]) ?? row[column.prop] }}
                                    </view>
                                </slot>
                            </view>
                        </uni-td>
                    </template>
                </uni-tr>
            </uni-table>
        </scroll-view>

        <!-- 分页 -->
        <view v-if="pagination.pageSize !== -1 && tableData.length" class="pagination">
            <uni-pagination
                show-icon
                :page-size="pagination.pageSize"
                :current="pagination.page"
                :total="pagination.total"
                @change="handlePaginationChange"
            />
        </view>
    </view>
</template>

<script setup lang="ts">
import type { XTableColumn, APIKeyMap } from './interface';
import useIndex from './useIndex';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XTable',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 标题 */
        title?: string;
        /** 无数据提示 */
        emptyText?: string;
        /** 请求接口 */
        api?: any;
        /** 请求接口参数 */
        apiParams?: Record<string, string | number>;
        /** 请求接口字段映射 */
        apiKeyMap?: APIKeyMap;
        /** 是否为分页格式 */
        dividePage?: boolean;
        /** 分页设置 */
        paginationProp?: Record<string, number>;
        /** 表头列表 */
        columns?: XTableColumn[];
        /** 静态表格数据 */
        data?: Record<string, any>[];
        /** 是否渲染 loading */
        loading?: boolean;
        /** 是否可选 */
        selectable?: boolean;
        /** 已勾选的行索引列表 */
        selectedList?: number[];
        /** 是否渲染斑马纹 */
        stripe?: boolean;
        /** 表头行颜色 */
        headerStyle?: any;
        /** 表格行颜色 */
        rowStyle?: any;
        /** 可滑动的最小高度 */
        scrollStyle?: any;
    }>(),
    {
        title: '数据列表',
        emptyText: '暂无更多数据',
        api: null,
        apiParams: () => ({}),
        apiKeyMap: () => ({
            queryCurrentPageKey: 'page',
            queryPageSizeKey: 'limit',
            returnCurrentPageKey: 'current',
            returnTotalKey: 'total',
            returnPagesKey: 'pages',
            returnRecordKey: 'records',
        }),
        dividePage: true,
        paginationProp: () => ({
            pageSize: 10,
        }),
        columns: () => [],
        data: () => [],
        loading: false,
        selectable: false,
        selectedList: () => [],
        stripe: false,
        headerStyle: null,
        rowStyle: null,
        scrollStyle: () => ({}),
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'rowClick', row: Record<string, any>): void;
}>();

/**
 * useIndex
 */
const {
    key,
    tableRef,
    tableLoading,
    tableData,
    checkRowsIndex,
    checkRows,
    handleRowClick,
    handleSelectionChange,
    clearSelection,
    pagination,
    loadData,
    handlePaginationChange,
    handleFixed,
    validate,
    handlePreview,
} = useIndex(props, emit);

/**
 * 子组件暴露的属性与方法
 */
defineExpose({
    tableRef,
    tableData,
    checkRowsIndex,
    checkRows,
    clearSelection,
    validate,

    /**
     * @description 静态赋值时，使用 setTimeout 首次才可以渲染到页面
     * 我们在使用 setTimout 0 的场景是：等待 UI 渲染结束；
     * 即：想要在 dom 更新之后，再获取 dom 的某些值，类似 vue 中的 nextTick，始终获取最新的值。
     */
    loadData(params: Record<string, string | number>) {
        return setTimeout(() => {
            loadData(params);
        });
    },
});
</script>

<style lang="scss" scoped>
.component {
    width: 100%;
    height: 100%;
}

// 操作区样式
.operation {
    padding-bottom: 20rpx;
    display: flex;
    justify-content: space-between;

    &_text {
        font-size: 34rpx;
        font-weight: bold;
        display: flex;
        align-items: flex-end;
    }

    &_button {
        display: flex;

        :deep(.u-button) {
            margin: 0 10rpx;
        }
    }
}

// 表格主体样式
.table {
    :deep(.uni-table-th) {
        padding: 18rpx 10rpx;
    }

    :deep(.uni-table-td) {
        padding: 6rpx;
    }

    &_header {
        background-color: #f5f6f8;

        &_th {
            white-space: nowrap;
        }

        &_required {
            color: red;
        }
    }

    &_content {
        &_td {
            view {
                max-width: 450rpx;
                white-space: nowrap;
                overflow-x: auto;
            }
        }

        &_image {
            image {
                width: 60rpx;
                height: 60rpx;
                margin-right: 10rpx;
            }
        }

        &_action {
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(.u-button) {
                margin: 0 10rpx;
            }
        }
    }
}

// 分页样式
.pagination {
    margin-top: 20rpx;
}
</style>
