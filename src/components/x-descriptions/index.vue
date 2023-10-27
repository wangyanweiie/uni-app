<template>
    <view :key="key" class="component">
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

            <!-- 描述列主体区域 -->
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
                            <!-- 标签 -->
                            <view v-if="column?.type === 'tag' && column?.expression?.(row, column)">
                                <u-tag
                                    :text="column?.expression(row, column)?.text"
                                    :type="column?.expression(row, column)?.type"
                                    :plain="true"
                                    :plain-fill="true"
                                    size="mini"
                                >
                                </u-tag>
                            </view>

                            <!-- 图片 -->
                            <view
                                v-else-if="column?.type === 'image' && column?.expression?.(row, column)"
                                class="main__text__image"
                            >
                                <image
                                    v-for="(imgUrl, imgIndex) in column?.expression(row, column)"
                                    :key="imgIndex"
                                    :src="imgUrl"
                                    @click="handlePreview(imgUrl)"
                                ></image>
                            </view>

                            <!-- 插槽 -->
                            <view v-else-if="column?.type === 'slot'">
                                <slot :name="`${column.prop}`" :row="row" :index="rowIndex" />
                            </view>

                            <!-- 文本 -->
                            <view v-else>
                                {{ column?.expression?.(row, column) ?? row?.[column.prop] }}
                            </view>
                        </view>
                    </uni-col>
                </uni-row>
            </view>

            <!-- 底部区域 -->
            <view class="bottom">
                <slot name="bottom" :row="row" :index="rowIndex"></slot>
            </view>
        </view>

        <!-- 分页 -->
        <uni-pagination
            v-if="pagination.pageSize !== -1 && descriptionsData.length"
            show-icon
            :page-size="pagination.pageSize"
            :current="pagination.page"
            :total="pagination.total"
            class="pagination"
            @change="handlePaginationChange"
        />
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

.pagination {
    position: sticky;
    bottom: 0rpx;
    background-color: #fff;
    padding: 10rpx;
}
</style>
