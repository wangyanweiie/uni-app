<template>
    <view class="component">
        <!-- 查询条件 -->
        <view class="search">
            <slot name="search"> </slot>
        </view>

        <!-- 描述列 -->
        <view v-if="descriptionsData.length !== 0" class="descriptions">
            <view
                v-for="(row, rowIndex) in descriptionsData"
                :key="rowIndex"
                class="description"
                @click="handleRowClick(row)"
            >
                <!-- 顶部区域 -->
                <view class="top">
                    <view class="top__left">
                        <slot name="topLeft" :row="row" :index="rowIndex"></slot>
                    </view>
                    <view class="top__right">
                        <slot name="topRight" :row="row" :index="rowIndex"></slot>
                    </view>
                </view>

                <!-- 主体区域 -->
                <view class="main">
                    <!-- chunk：将数组拆分成多个 size 长度的区块，并将这些区块组成一个新数组 -->
                    <uni-row v-for="(childColumns, childColumnsIndex) in chunk(columns, size)" :key="childColumnsIndex">
                        <uni-col
                            v-for="(column, columnIndex) in childColumns"
                            :key="columnIndex"
                            :span="colSpan(childColumns)"
                        >
                            <view class="main__title">
                                {{ column.label }}
                            </view>

                            <view class="main__text">
                                <slot :name="`${column.prop}Slot`" :row="row" :index="rowIndex">
                                    <!-- 标签 -->
                                    <view v-if="column?.renderType === 'tag' && column?.formatter?.(row, column)">
                                        <u-tag
                                            :text="column?.formatter(row, column)?.text"
                                            :type="column?.formatter(row, column)?.type"
                                            :plain="true"
                                            :plain-fill="true"
                                            size="mini"
                                        >
                                        </u-tag>
                                    </view>

                                    <!-- 图片 -->
                                    <view
                                        v-else-if="column?.renderType === 'image' && column?.formatter?.(row, column)"
                                        class="main__text__image"
                                    >
                                        <image
                                            v-for="(imgUrl, imgIndex) in column?.formatter(row, column)"
                                            :key="imgIndex"
                                            :src="imgUrl"
                                            @click="handlePreview(imgUrl)"
                                        ></image>
                                    </view>

                                    <!-- 文本 -->
                                    <view v-else>
                                        {{ column?.formatter?.(row, column) ?? row?.[column.prop] }}
                                    </view>
                                </slot>
                            </view>
                        </uni-col>
                    </uni-row>
                </view>

                <!-- 底部区域 -->
                <view class="bottom">
                    <slot name="bottom" :row="row" :index="rowIndex"></slot>
                </view>
            </view>
        </view>
        <view v-else>
            <u-empty mode="list" text="暂无数据" :text-size="28" :icon-size="150"></u-empty>
        </view>

        <!-- 分页 -->
        <view v-if="pagination.pageSize !== -1 && descriptionsData.length" class="pagination">
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
import { chunk } from 'lodash-es';
import { XDescriptionColumn, APIKeyMap } from './interface';
import useIndex from './useIndex';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'XDescriptions',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        size?: 1 | 2 | 3;
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
        /** 配置列表 */
        columns: XDescriptionColumn[];
        /** 静态数据 */
        data?: Record<string, any>[];
    }>(),
    {
        size: 2,
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
const { key, colSpan, descriptionsData, handleRowClick, pagination, loadData, handlePaginationChange, handlePreview } =
    useIndex(props, emit);

/**
 * 子组件暴露的属性与方法
 */
defineExpose({
    descriptionsData,
    loadData,
});
</script>

<style lang="scss" scoped>
.component {
    position: relative;
}

// 查询样式
.search {
    position: sticky;
    top: 0rpx;
    z-index: 2;
    padding: 10rpx 0;
    background-color: #fff;
}

// 描述列主体样式
.descriptions {
    .description {
        border: 1px solid #eee;
        border-radius: 14rpx;
        box-shadow:
            1rpx 1rpx 4rpx #e3dfdf,
            -1rpx -1rpx 4rpx #f7f5f5;
        padding: 14rpx;
        margin-bottom: 20rpx;

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &__left {
                font-size: 24rpx;
                color: #707070;

                :deep(view) {
                    padding: 4rpx;
                }
            }

            &__right {
                display: flex;
            }
        }

        .main {
            border: 1px solid #eee;
            border-radius: 10rpx;
            text-align: center;
            margin: 10rpx 0;

            &__title {
                font-size: 28rpx;
                font-weight: bold;
                color: #8f939c;
                padding: 10rpx;
                background-color: #f5f6f8;
            }

            &__text {
                font-size: 24rpx;
                margin: 10rpx 0;
                color: #8f939c;
                white-space: nowrap;
                overflow: auto;
                padding: 0 10rpx;

                &__image {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    image {
                        width: 40rpx;
                        height: 40rpx;
                        margin-right: 10rpx;
                    }
                }
            }
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}

// 分页样式
.pagination {
    position: sticky;
    bottom: 0rpx;
    padding: 10rpx;
    background-color: #fff;
}
</style>
