<template>
    <view class="component-wrap">
        <u-input
            v-model="inputLabel"
            :placeholder="placeholder"
            readonly
            :disabled="disabled"
            v-bind="inputProps"
            @click="openSelect"
        >
            <template #suffix>
                <u-icon name="arrow-right" size="20px" @click="openSelect"></u-icon>
            </template>
        </u-input>

        <u-popup :show="visible" mode="bottom" @close="handleClose">
            <view class="popup">
                <view class="search-line">
                    <view class="action action--error" @click="handleClear">
                        <text>清空</text>
                    </view>

                    <u-search v-model="searchValue" :show-action="false" class="search"></u-search>

                    <view class="action action--primary" @click="handleConfirm">
                        <text>确定</text>
                    </view>
                </view>

                <scroll-view scroll-y class="select-list-wrap" @scroll="handleScroll">
                    <!-- 占位元素，模拟列表总高度 -->
                    <view class="select-list-placeholder" :style="listPlaceholderStyle"> </view>

                    <!-- 展示列表 -->
                    <view class="select-list" :style="listStyle">
                        <view v-if="loading" class="loading">
                            <u-loading-icon text="加载中" size="25px" text-size="16px"></u-loading-icon>
                        </view>

                        <view
                            v-for="item in showList"
                            :key="item.value"
                            class="select-item"
                            :class="{ 'select-item--active': isActive(item) }"
                            @click="handleSelect(item)"
                        >
                            <text>{{ item.label }}</text>

                            <u-icon v-if="isActive(item)" name="checkmark" color="#2979ff" size="14px"></u-icon>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </u-popup>
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';

interface LabelValueVo {
    label: string;
    value: string | number;
    [key: string]: any;
}

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        labelValue?: string[];
        codeValue?: any[];
        api?: (data: any) => Promise<any>;
        params?: Record<string, any>;
        options?: LabelValueVo[];
        labelKey?: string;
        valueKey?: string;
        placeholder?: string;
        disabled?: boolean;
        inputProps?: Record<string, any>;
    }>(),
    {
        modelValue: undefined,
        labelValue: () => [],
        codeValue: () => [],
        api: undefined,
        params: undefined,
        options: () => [],
        labelKey: 'label',
        valueKey: 'value',
        placeholder: '选择/查询',
        disabled: false,
        inputProps: undefined,
    },
);

const emits = defineEmits<{
    (e: 'update:codeValue', value?: any[]): void;
    (e: 'update:labelValue', value?: string[]): void;
    (e: 'confirm', value?: any[]): void;
    (e: 'clear'): void;
}>();

// ==================== 功能函数 ====================
/**
 * 从数组中查询一个值，如果存在则删除该值，不存在则添加该值
 * @param arr 数组
 * @param id 值
 * @returns 新数组
 */
function findItem(arr: any[], id: any) {
    if (!Array.isArray(arr)) {
        return [];
    }

    const result = arr.findIndex(item => item === id);

    if (result === -1) {
        arr.push(id);
    } else {
        arr.splice(result, 1);
    }

    return arr;
}

/**
 * label 数组
 */
const labelString = computed<any[]>({
    get: () => props.labelValue ?? [],
    set: (value?: any) => {
        emits('update:labelValue', value);
    },
});

/**
 * 输入框显示的 label 字符串
 */
const inputLabel = computed<string>(() => {
    return labelString.value.toString();
});

/**
 * code 数组
 */
const codeValue = computed<any[]>({
    get: () => props.codeValue ?? [],
    set: (value?: any) => {
        emits('update:codeValue', value);
    },
});

// ==================== 下拉列表 ====================
/**
 * 下拉列表
 */
const list = ref<LabelValueVo[]>([]);

/**
 * loading
 */
const loading = ref<boolean>(false);

/**
 * 获取下拉数据
 */
async function fetch(): Promise<boolean> {
    if (!props.api) {
        list.value = props.options?.map((item: LabelValueVo) => ({
            ...item,
            label: item[props.labelKey] ?? '',
            value: item[props.valueKey] ?? '',
        }));

        return false;
    }

    loading.value = true;

    const res = await props.api(props.params);

    if (!res || !res.data) {
        loading.value = false;
        return false;
    }

    list.value = res.data?.map((item: LabelValueVo) => ({
        ...item,
        label: item[props.labelKey] ?? '',
        value: item[props.valueKey] ?? '',
    }));

    loading.value = false;
    return true;
}

// ==================== 弹窗 ====================
/**
 * 是否展示
 */
const visible = ref<boolean>(false);

/**
 * 打开弹窗
 */
async function openSelect(): Promise<void> {
    fetch();

    searchValue.value = '';
    scrollTop.value = 0;

    visible.value = true;
}

/**
 * 搜索值
 */
const searchValue = ref<string>('');

/**
 * 搜索列表
 */
const searchList = computed<LabelValueVo[]>(() => {
    return list.value.filter((item: LabelValueVo) => item.label.includes(searchValue.value));
});

/**
 * 当前选中项
 */
function isActive(item: LabelValueVo): boolean {
    return codeValue.value.indexOf(item.value) !== -1;
}

/**
 * 选中事件
 */
function handleSelect(item: LabelValueVo): void {
    codeValue.value = findItem(codeValue.value, item.value);
    labelString.value = findItem(labelString.value, item.label);
}

/**
 * 确定事件
 */
function handleConfirm(): void {
    emits('update:labelValue', labelString.value);
    emits('update:codeValue', codeValue.value);
    emits('confirm', codeValue.value);

    visible.value = false;
}

/**
 * 清空事件
 */
function handleClear(): void {
    codeValue.value = [];
    labelString.value = [];

    emits('update:labelValue', []);
    emits('update:codeValue', []);
    emits('clear');

    visible.value = false;
}

/**
 * 关闭弹窗
 */
function handleClose() {
    visible.value = false;
}

/**
 * 监听 codeValue 的变化，生成 labelString
 */
watchEffect(() => {
    const matchedItem = list.value.filter((item: LabelValueVo) => codeValue.value.includes(item.value));

    labelString.value = matchedItem.map((item: LabelValueVo) => item.label);
});

/**
 * 页面渲染
 */
onMounted(() => {
    fetch();
});

// ==================== FIXME: 虚拟列表相关 ====================
/**
 * 元素行高
 */
const ITEM_HEIGHT = 40;

/**
 * 可视区高度
 */
const VISIBLE_HEIGHT = 240;

/**
 * 显示数量
 */
const VISIBLE_COUNT = Math.ceil(VISIBLE_HEIGHT / ITEM_HEIGHT);

/**
 * 下拉列表区域总高度
 */
const totalHeight = computed<number>(() => ITEM_HEIGHT * searchList.value.length);

/**
 * 滚动位置
 */
const scrollTop = ref<number>(0);

/**
 * 开始索引
 */
const startIndex = computed<number>(() => Math.floor(scrollTop.value / ITEM_HEIGHT));

/**
 * 结束索引
 */
const endIndex = computed<number>(() => startIndex.value + VISIBLE_COUNT);

/**
 * 展示数据列表
 */
const showList = computed<LabelValueVo[]>(() => searchList.value.slice(startIndex.value, endIndex.value));

/**
 * 偏移量
 */
const scrollOffset = computed<number>(() => scrollTop.value - (scrollTop.value % ITEM_HEIGHT));

/**
 * 占位元素高度
 */
const listPlaceholderStyle = computed(() => ({
    height: `${totalHeight.value}px`,
}));

/**
 * 列表样式
 */
const listStyle = computed(() => ({
    top: `${scrollOffset.value}px`,
}));

/**
 * 滚动处理
 */
function handleScroll(event: any): void {
    console.log('scroll-event:', event);

    const detail = event.detail;
    scrollTop.value = detail.scrollTop;
}
</script>

<style lang="scss" scoped>
.component-wrap {
    width: 100%;
    height: 40px;
}

.popup {
    background-color: #fff;
}

.search-line {
    display: flex;
    align-items: center;
    height: 50px;
}

.action {
    width: 30px;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.action--error {
    color: $u-error;
}

.action--primary {
    color: $u-primary;
}

.select-list-wrap {
    position: relative;
    height: 240px;
    overflow-y: scroll;
}

.select-list-placeholder {
    position: absolute;
    z-index: -1;
    width: 100%;
}

.select-list {
    position: relative;
    margin: 0 10px;
    height: 240px;
}

.select-item {
    display: flex;
    width: 95%;
    height: 40px;
    align-items: center;
    justify-content: space-between;
}

.select-item--active {
    color: $u-primary;
}

.loading {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>
