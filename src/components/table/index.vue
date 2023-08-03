<template>
    <view class="wrap">
        <!-- 顶部操作区域 -->
        <view class="operation">
            <view v-if="title" class="operation_text"> {{ title }} </view>
            <view class="operation_button">
                <slot name="operation" :check-rows="checkRows" />
            </view>
        </view>

        <!-- 表格 -->
        <scroll-view scroll-y="true" :style="scrollStyle">
            <uni-table
                ref="uniTableRef"
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
                    <template v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex">
                        <uni-th
                            :width="headerItem?.width || 150"
                            :align="headerItem?.align || 'center'"
                            :class="['table_header_th']"
                            :style="
                                handleFixedStyle(
                                    headerItem?.fixedProps?.direction,
                                    headerItem?.fixedProps?.distance,
                                    '#f5f6f8',
                                )
                            "
                        >
                            <text v-if="headerItem?.required" class="table_header_required">*</text>
                            <text>{{ headerItem.label }}</text>
                        </uni-th>
                    </template>
                </uni-tr>

                <!-- 表格数据行 -->
                <uni-tr
                    v-for="(dataItem, dataIndex) in tableData"
                    :key="dataIndex"
                    :class="[
                        'table_content',
                        props.colorField && dataItem[props.colorField] === ROW_COLOR['红色'] ? 'red' : '',
                        props.colorField && dataItem[props.colorField] === ROW_COLOR['黄色'] ? 'yellow' : '',
                    ]"
                    @click="handleRowClick(dataItem)"
                >
                    <template v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex">
                        <uni-td
                            :align="headerItem?.align || 'center'"
                            :class="[
                                'table_content_td',
                                headerItem.prop === 'action' ? 'table_content_action' : '',
                                props.colorField && dataItem[props.colorField] === ROW_COLOR['红色'] ? 'red' : '',
                                props.colorField && dataItem[props.colorField] === ROW_COLOR['黄色'] ? 'yellow' : '',
                            ]"
                            :style="
                                handleFixedStyle(
                                    headerItem?.fixedProps?.direction,
                                    headerItem?.fixedProps?.distance,
                                    '#fff',
                                )
                            "
                        >
                            <!-- 索引列 -->
                            <view v-if="headerItem?.prop === 'index'">{{ dataIndex + 1 }}</view>

                            <!-- 操作列 | slot -->
                            <view v-else-if="headerItem?.prop === 'action' || headerItem?.type === 'slot'">
                                <slot :name="`${headerItem.prop}`" :row="dataItem" :index="dataIndex" />
                            </view>

                            <!-- 动态渲染 tag -->
                            <view
                                v-else-if="
                                    headerItem.expression?.(dataItem, headerItem) &&
                                    headerItem.expression?.(dataItem, headerItem) !== 'default'
                                "
                            >
                                <u-tag
                                    :text="dataItem?.[headerItem.prop]"
                                    :type="headerItem.expression?.(dataItem, headerItem)"
                                    plain
                                >
                                </u-tag>
                            </view>

                            <!-- 纯文本 -->
                            <view v-else>
                                {{ dataItem?.[headerItem.prop] }}
                            </view>
                        </uni-td>
                    </template>
                </uni-tr>
            </uni-table>
        </scroll-view>

        <!-- 分页 -->
        <uni-pagination
            v-if="pagination.pageSize !== -1 && tableData.length"
            show-icon
            :page-size="pagination.pageSize"
            :current="pagination.page"
            :total="pagination.total"
            @change="handlePaginationChange"
        />
    </view>
</template>

<script setup lang="ts">
import type { HeaderItem, APIKeyMap } from './interface';
import useIndex from './useIndex';

/**
 * 行颜色
 */
enum ROW_COLOR {
    '红色' = 1,
    '黄色' = 2,
}

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
        /** 分页设置 */
        paginationProp?: Record<string, number>;
        /** 表头列表 */
        tableHeader?: HeaderItem[];
        /** 静态表格数据 */
        tableDataProp?: Record<string, any>[];
        /** 是否为分页格式 */
        dividePage?: boolean;
        /** 是否渲染 loading */
        loading?: boolean;
        /** 是否可选 */
        selectable?: boolean;
        /** 是否渲染斑马纹 */
        stripe?: boolean;
        /** 决定行颜色字段 */
        colorField?: string;
        /** 可滑动的最小高度 */
        scrollStyle?: any;
    }>(),
    {
        title: '数据列表',
        emptyText: '暂无更多数据',
        api: undefined,
        apiParams: () => ({}),
        apiKeyMap: () => ({
            queryCurrentPageKey: 'page',
            queryPageSizeKey: 'limit',
            returnCurrentPageKey: 'current',
            returnTotalKey: 'total',
            returnPagesKey: 'pages',
            returnRecordKey: 'records',
        }),
        paginationProp: () => ({
            pageSize: 10,
        }),
        tableHeader: () => [],
        tableDataProp: () => [],
        dividePage: true,
        loading: false,
        selectable: false,
        stripe: false,
        colorField: 'color',
        scrollStyle: () => ({}),
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleRowClick', row: Record<string, any>): void;
}>();

/**
 * useIndex
 */
const {
    key,
    uniTableRef,
    tableLoading,
    tableData,
    checkRows,
    handleRowClick,
    handleSelectionChange,
    clearSelection,
    pagination,
    loadData,
    handlePaginationChange,
    handleFixedStyle,
    validate,
} = useIndex(props, emit);

/**
 * 子组件暴露的属性与方法
 */
defineExpose({
    uniTableRef,
    tableData,
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
.wrap {
    width: 100%;
    height: 100%;
    margin-top: 20rpx;

    // 表格顶部操作区域样式
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
        }
    }

    // 表格主体样式
    .table {
        margin-bottom: 20rpx;

        &_header {
            background-color: #f5f6f8;

            &_th {
                white-space: nowrap;
            }

            // 必填标识
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

            // 操作列
            &_action {
                view {
                    display: flex;
                }
            }
        }
    }

    .red {
        background-color: #fad8d6 !important;
    }

    .yellow {
        background-color: #ffee8f !important;
    }
}
</style>
