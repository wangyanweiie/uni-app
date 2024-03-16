<template>
    <!-- longpress -->
    <view class="card" @longpress="handleLongPress">
        <uni-row @click="handleCardClick">
            <uni-col v-for="(col, index) in columns" :key="index" :span="col.span ?? colSpan">
                <view class="title cell">{{ col.label }}</view>
                <view class="content cell" @tap="handleTap($event, col)">
                    <span v-if="col.formatter" v-html="renderData(col)"></span>
                    <span v-else>{{ data[col.prop] }} </span>
                </view>
            </uni-col>

            <uni-col>
                <slot name="action"></slot>
            </uni-col>
        </uni-row>

        <view v-if="actionVisible" class="actions" @click="handleCardClick">
            <view
                v-for="(action, index) in actions"
                :key="index"
                class="action-button"
                :class="`action-button--${action.type}`"
                @click.stop="action.onClick($event, data, closeAction)"
            >
                {{ action.label }}
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getColSpan } from 'src/utils/system-info';
import { onBeforeUnmount, nextTick, onMounted, ref } from 'vue';

/**
 * 卡片关闭操作栏事件名称
 */
const CardCloseActionEventName = 'CardCloseAction';

/**
 * column
 */
export interface CardColumn<T = any> {
    label: string;
    prop: keyof T | '';
    span?: string | number;
    formatter?: (data: T, cellValue: any) => string;
    toast?: boolean;
}

/**
 * 操作配置
 */
export interface CardAction {
    label: string;
    type: 'primary' | 'success' | 'warning' | 'error';
    onClick: (event: Event, data: any, fn: () => void) => void;
}

const props = withDefaults(
    defineProps<{
        columns: CardColumn[];
        data: any;
        actions?: CardAction[];
    }>(),
    {
        columns: () => [],
        data: () => ({}),
        actions: () => [],
    },
);

/**
 * 渲染数据
 */
function renderData(col: CardColumn): string {
    if (!col.formatter) {
        return '';
    }

    return col.formatter(props.data, props.data[col.prop]);
}

/**
 * tap事件
 */
function handleTap(e: any, col: CardColumn): void {
    if (!col.toast) {
        return;
    }

    if (col.formatter) {
        return;
    }

    e.stopPropagation();

    uni.showToast({
        title: props.data[col.prop],
        mask: false,
        icon: 'none',
    });
}

/**
 * card span
 */
const colSpan = ref<number>(12);

/**
 * 操作栏显示
 */
const actionVisible = ref<boolean>(false);

/**
 * 长按弹出操作栏
 */
function handleLongPress(): void {
    // 未配置
    if (!props.actions || props.actions.length === 0) {
        return;
    }

    nextTick(() => {
        actionVisible.value = true;
    });
}

/**
 * 关闭操作栏
 */
function closeAction(): void {
    actionVisible.value = false;
}

/**
 * 点击卡片事件
 */
function handleCardClick(): void {
    // 触发卡片操作关闭事件
    uni.$emit(CardCloseActionEventName);
}

onMounted(async () => {
    const system = await uni.getSystemInfo();

    colSpan.value = getColSpan(system.windowWidth);

    uni.onWindowResize(res => {
        colSpan.value = getColSpan(res.size.windowWidth);
    });

    // 注册卡片操作关闭事件
    uni.$on(CardCloseActionEventName, () => closeAction());
});

onBeforeUnmount(() => {
    uni.offWindowResize(() => {
        console.log('取消监听');
    });

    // 注销卡片操作关闭事件
    uni.$off(CardCloseActionEventName);
});
</script>

<style lang="scss" scoped>
.card {
    padding: 5px;
    margin-bottom: 10px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    background-color: #fff;
    position: relative;
}

.title {
    font-weight: 700;
    color: var(--van-text-color);
    font-size: 14px;
}

.content {
    color: var(--van-text-color-2);
    font-size: 12px;
}

.cell {
    height: 25px;
    line-height: 25px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.46);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 15px;
}

.action-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 14px;
}
.action-button--primary {
    background-color: $u-primary-dark;
    color: #fff;
}
.action-button--success {
    background-color: $u-success-dark;
    color: #fff;
}

.action-button--warning {
    background-color: $u-warning-dark;
    color: #fff;
}

.action-button--error {
    background-color: $u-error-dark;
    color: #fff;
}
</style>
