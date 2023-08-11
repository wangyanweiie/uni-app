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
                    <template v-for="header in tableHeader" :key="header.prop">
                        <uni-th
                            :width="header?.width ?? 120"
                            :align="header?.align ?? 'center'"
                            :class="['table_header_th']"
                            :style="handleFixed(header?.fixedProps?.direction, header?.fixedProps?.distance, '#f5f6f8')"
                        >
                            <text v-if="header?.required" class="table_header_required">*</text>
                            <text>{{ header.label }}</text>
                        </uni-th>
                    </template>
                </uni-tr>

                <!-- 表格数据行 -->
                <uni-tr
                    v-for="(data, dataIndex) in tableData"
                    :key="dataIndex"
                    :class="[
                        'table_content',
                        props.colorField && data[props.colorField] === ROW_COLOR['红色'] ? 'red' : '',
                        props.colorField && data[props.colorField] === ROW_COLOR['黄色'] ? 'yellow' : '',
                    ]"
                    @click="handleRowClick(data)"
                >
                    <template v-for="header in tableHeader" :key="header.prop">
                        <uni-td
                            :align="header?.align ?? 'center'"
                            :style="handleFixed(header?.fixedProps?.direction, header?.fixedProps?.distance, '#fff')"
                            :class="[
                                'table_content_td',
                                props.colorField && data[props.colorField] === ROW_COLOR['红色'] ? 'red' : '',
                                props.colorField && data[props.colorField] === ROW_COLOR['黄色'] ? 'yellow' : '',
                            ]"
                        >
                            <!-- 索引列 -->
                            <view v-if="header?.prop === 'index'">{{ dataIndex + 1 }}</view>

                            <!-- 操作列 -->
                            <view v-else-if="header?.prop === 'action'" class="table_content_action">
                                <slot :name="`${header.prop}`" :row="data" :index="dataIndex" />
                            </view>

                            <!-- 标签 -->
                            <view v-else-if="header?.type === 'tag' && header?.expression?.(data, header)">
                                <u-tag
                                    :text="header?.expression(data, header)?.text"
                                    :type="header?.expression(data, header)?.type"
                                    :plain="true"
                                    :plain-fill="true"
                                    size="mini"
                                >
                                </u-tag>
                            </view>

                            <!-- 图片 -->
                            <view
                                v-else-if="header?.type === 'image' && header?.expression?.(data, header)"
                                class="table_content_image"
                            >
                                <image
                                    v-for="(item, index) in header?.expression(data, header)"
                                    :key="index"
                                    :src="item"
                                    @click="handlePreview(item)"
                                ></image>
                            </view>

                            <!-- 插槽 -->
                            <view v-else-if="header?.type === 'slot'">
                                <slot :name="`${header.prop}`" :row="data" :index="dataIndex" />
                            </view>

                            <!-- 文本 -->
                            <view v-else>
                                {{ header?.expression?.(data, header) ?? data?.[header.prop] }}
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
        /** 是否为分页格式 */
        dividePage?: boolean;
        /** 分页设置 */
        paginationProp?: Record<string, number>;
        /** 表头列表 */
        tableHeader?: HeaderItem[];
        /** 静态表格数据 */
        data?: Record<string, any>[];
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
        dividePage: true,
        paginationProp: () => ({
            pageSize: 10,
        }),
        tableHeader: () => [],
        data: () => [],
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
    (e: 'rowClick', row: Record<string, any>): void;
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
    handleFixed,
    validate,
    handlePreview,
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

            :deep(.u-button) {
                margin: 0 10rpx;
            }
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

            // 图片
            &_image {
                display: flex;
                align-items: center;
                justify-content: center;

                image {
                    width: 60rpx;
                    height: 60rpx;
                    margin-right: 10rpx;
                }
            }

            // 操作列
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

    .red {
        background-color: #fad8d6 !important;
    }

    .yellow {
        background-color: #ffee8f !important;
    }
}
</style>