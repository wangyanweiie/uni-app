<template>
    <view class="table">
        <view v-if="showHead" class="head">
            <uni-row class="line">
                <uni-col v-if="nestable" :span="2" class="td">
                    <u-icon name="list" size="12px" class="icon"></u-icon>
                </uni-col>
                <uni-col
                    v-for="(col, index) in columns"
                    :key="index"
                    class="td"
                    :span="colSpan(col.span, index)"
                    v-bind="col"
                >
                    {{ col.label }}
                </uni-col>
            </uni-row>
        </view>

        <uni-swipe-action>
            <view v-if="isEmpty" class="empty"> {{ emptyText }} </view>
            <uni-swipe-action-item
                v-for="(item, index) in list"
                :key="index"
                :right-options="rightOptions"
                :disabled="!item.collapsed"
                @click="handleClick($event, item, index)"
            >
                <view :style="[typeof rowStyle === 'function' && rowStyle(item, index)]">
                    <uni-row class="line">
                        <uni-col v-if="nestable" :span="2" class="td">
                            <view
                                v-if="item[childrenKey] && item[childrenKey].length > 0"
                                @click.stop="handleCollapse(item)"
                            >
                                <u-icon v-if="item.collapsed" name="plus" size="12px" class="icon"></u-icon>
                                <u-icon v-else name="minus" size="12px" class="icon"></u-icon>
                            </view>
                            <view v-else-if="isNest">
                                <u-icon name="bag" size="12px" class="icon"></u-icon>
                            </view>
                        </uni-col>
                        <uni-col v-for="(col, idx) in columns" :key="idx" class="td" :span="colSpan(col.span, idx)">
                            <span v-if="!colEditable(col, item)">
                                <span v-if="col.render">
                                    <span
                                        @tap.stop="
                                            handleTap(
                                                col,
                                                col.render ? col.render(item[col.prop], item, index) : '',
                                                item,
                                                index,
                                            )
                                        "
                                        v-html="col.render(item[col.prop], item, index)"
                                    ></span>
                                </span>
                                <span v-else @tap.stop="handleTap(col, item[col.prop] ?? '', item, index)">
                                    {{ item[col.prop] ?? '' }}
                                </span>
                            </span>

                            <view v-else>
                                <u-input
                                    v-model="item[col.prop]"
                                    @change="handleEditInput($event, col, item, index)"
                                ></u-input>
                            </view>
                        </uni-col>
                    </uni-row>

                    <view v-if="!item.collapsed">
                        <x-swipe-table
                            class="nest-table"
                            :columns="columns"
                            :nestable="nestable"
                            :children-key="childrenKey"
                            :data="item[childrenKey]"
                            :show-head="false"
                            is-nest
                        ></x-swipe-table>
                    </view>
                </view>
            </uni-swipe-action-item>
        </uni-swipe-action>
    </view>
</template>

<script setup lang="ts">
import { set } from 'lodash-es';
import type { Numeric } from 'src/constant/base';
import { showToast } from 'src/utils/uni-message';
import { ref, watchEffect, computed } from 'vue';
import type { Recordable, SwipeOption } from './interface';

/**
 * x-swipe column
 */
export interface XSwipeColumn<T = any> {
    label: string;
    prop: keyof T | '';
    span?: Numeric;
    toast?: boolean;
    editable?: boolean | ((form: any) => boolean);
    edit?: (value: string, row: T, index: number) => void;
    render?: (value: any, row: T, index: number) => string;
    onClick?: (value: string, row: T, index: number) => void;
}

/**
 * 滑动 table 点击参数
 */
export interface SwipeClickParam {
    content: string;
    index: number;
}

const props = withDefaults(
    defineProps<{
        /** 表格列配置 */
        columns: XSwipeColumn[];
        /** 表格数据 */
        data: any[];
        /** 是否展示表头 */
        showHead?: boolean;
        /** 操作项 */
        rightOptions?: SwipeOption[];
        /** 空数据提示 */
        emptyText?: string;
        /** 表格行颜色 */
        rowStyle: any;
        /** 二级表格 */
        nestable?: boolean;
        isNest?: boolean;
        childrenKey?: string;
    }>(),
    {
        columns: () => [],
        data: () => [],
        showHead: true,
        rightOptions: undefined,
        emptyText: '暂无数据',
        rowStyle: undefined,
        nestable: false,
        isNest: false,
        childrenKey: 'children',
    },
);

const emits = defineEmits<{
    (e: 'right-click', value: SwipeClickParam, item: any, index: number): void;
}>();

/**
 * 表格数据
 */
const list = ref<any[]>([]);

/**
 * 数据是否为空
 */
const isEmpty = computed<boolean>(() => list.value.length === 0);

/**
 * 监听表格数据
 */
watchEffect(() => {
    list.value = props.data?.map(item => {
        return {
            ...item,
            collapsed: !item[props.childrenKey],
        };
    });
});

/**
 * 列占位
 */
function colSpan(span: Numeric | undefined, index: number): Numeric {
    const total = 24 - (props.nestable ? 2 : 0);
    const avg = Math.floor(total / props.columns.length);

    if (index !== props.columns.length - 1) {
        return span ?? avg;
    } else {
        return span ?? total - avg * (props.columns.length - 1 || 0);
    }
}

function colEditable(col: XSwipeColumn, row: Recordable): boolean | undefined {
    if (typeof col.editable === 'function') {
        return col?.editable(row);
    } else {
        return col.editable;
    }
}

function handleTap(col: XSwipeColumn, value: string, item: any, index: number): void {
    if (col.onClick) {
        col.onClick(value, item, index);
    }

    if (!col.toast) {
        return;
    }

    showToast(value);
}

/**
 * 编辑事件
 * @param value 当前值
 * @param col 表格列配置子项
 * @param item 行数据
 * @param index 行索引
 */
function handleEditInput(value: string, col: XSwipeColumn, item: any, index: number): void {
    if (!col.editable) {
        return;
    }

    if (!col.edit || typeof col.edit !== 'function') {
        return;
    }

    col.edit(value, item, index);
}

/**
 *
 * @param value 操作项索引
 * @param item 行数据
 * @param index 行索引
 */
function handleClick(value: any, item: any, index: number): void {
    emits('right-click', value, item, index);
}

function handleCollapse(item: any): void {
    set(item, 'collapsed', !item.collapsed);
}
</script>

<style lang="scss" scoped>
.head {
    font-weight: 700;
    color: $u-info;
    width: 100%;
}

.line {
    position: relative;
    display: flex;
    height: 35px;
    align-items: center;
    font-size: 12px;

    &::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        bottom: 0;
        border-bottom: 1px solid #ebedf0;
        transform: scaleY(0.5);
        width: 100%;
    }
}

.td {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.icon {
    display: flex;
    width: 100%;
    justify-content: center;
}

.empty {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #767a82;
    font-size: 14px;
    font-weight: 600;
}
</style>
./interface
