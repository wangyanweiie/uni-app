<template>
    <view class="list">
        <slot name="default" :list="list"></slot>
        <view v-if="isEmpty" class="empty"> {{ emptyText }} </view>
        <uni-load-more v-else icon-type="auto" :status="loadingStatus" />
        <slot name="action" :list="list"></slot>
    </view>
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { computed, onMounted, ref, watch } from 'vue';
import type { Recordable } from './interface';

const props = withDefaults(
    defineProps<{
        /** 查询接口 */
        api?: (data?: any) => Promise<any>;
        /** 查询条件 */
        searchData?: any;
        /** 查询接口参数 */
        defaultParams?: any;
        /** 没有数据时显示 */
        emptyText?: string;
        /** 数据列表 */
        data?: any[];
    }>(),
    {
        api: undefined,
        searchData: undefined,
        defaultParams: undefined,
        emptyText: '暂无数据',
        data: () => [],
    },
);

/**
 * 查询参数
 */
interface PageListParams {
    page: number;
    limit: number;
    [key: string]: any;
}

/**
 * 返回数据
 */
interface PageListResponse {
    data: {
        records?: Recordable[];
        total?: number;
    };
}

/**
 * 加载状态枚举
 */
enum LOADING_STATUS {
    '加载更多' = 'more',
    '加载中' = 'loading',
    '加载完成' = 'noMore',
}

/**
 * 列表数据
 */
const list = ref<Recordable[]>([]);
const isEmpty = computed<boolean>(() => list.value.length === 0);

/**
 * 加载状态
 */
const loadingStatus = ref<string>(LOADING_STATUS['加载更多']);

/**
 * 参数
 */
const params = ref<PageListParams>({
    limit: 10,
    page: 1,
});

/**
 * 列表总数
 */
const total = ref<number>(-1);

/**
 * 获取数据列表
 */
async function load(): Promise<void> {
    if (!props.api) {
        list.value = props.data;
        loadingStatus.value = LOADING_STATUS['加载完成'];
        return;
    }

    loadingStatus.value = LOADING_STATUS['加载中'];
    const res: PageListResponse = await props.api({
        ...params.value,
        ...props.searchData,
        ...props?.defaultParams,
    });

    if (!res) {
        loadingStatus.value = LOADING_STATUS['加载更多'];
        return;
    }

    list.value.push(...(res.data.records ?? []));

    total.value = res.data.total ?? 0;

    // 更新 load-more 状态
    if (list.value.length < total.value) {
        loadingStatus.value = LOADING_STATUS['加载更多'];
    } else {
        loadingStatus.value = LOADING_STATUS['加载完成'];
    }
}

/**
 * 刷新列表
 */
async function refresh(): Promise<void> {
    params.value = {
        limit: 10,
        page: 1,
    };

    list.value = [];

    await load();
}

/**
 * 下拉刷新
 */
onPullDownRefresh(async () => {
    await refresh();
    uni.stopPullDownRefresh();
});

/**
 * 页面触底
 */
onReachBottom(async () => {
    if (loadingStatus.value === LOADING_STATUS['加载完成']) {
        return false;
    }

    params.value.page += 1;
    await load();
});

/**
 * 页面渲染
 */
onMounted(() => {
    load();
});

/**
 * 监听静态数据
 */
watch(
    () => props.data,
    () => {
        load();
    },
    {
        deep: true,
    },
);

/**
 * 暴露方法
 */
defineExpose<{ refresh: () => Promise<void> }>({
    refresh,
});
</script>

<style lang="scss" scoped>
.list {
    padding: 8px;
    background-color: transparent;
}
</style>
./interface
