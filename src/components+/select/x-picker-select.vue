<template>
    <view class="component-wrap">
        <u-input
            v-model="labelString"
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

        <uni-popup ref="popupRef" type="bottom">
            <view class="popup">
                <view class="search-line">
                    <view class="action action--error" @click="handleClear">
                        <text>清空</text>
                    </view>

                    <u-search v-model="searchValue" :show-action="false" class="search"></u-search>
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
        </uni-popup>
    </view>
</template>

<script setup lang="ts">
import { onMounted, watchEffect } from 'vue';
import { computed, ref } from 'vue';

interface LabelValueVo {
    label: string;
    value: string | number;
    [key: string]: any;
}

const props = withDefaults(
    defineProps<{
        modelValue?: string | number;
        labelValue?: string;
        api?: (data: any) => Promise<any>;
        params?: any;
        options?: LabelValueVo[];
        labelKey?: string;
        valueKey?: string;
        placeholder?: string;
        disabled?: boolean;
        prefetch?: boolean;
        inputProps?: Record<string, any>;
    }>(),
    {
        modelValue: '',
        labelValue: '',
        api: undefined,
        params: undefined,
        options: () => [],
        labelKey: 'label',
        valueKey: 'value',
        placeholder: '',
        disabled: false,
        prefetch: true,
        inputProps: undefined,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: string | number): void;
    (e: 'update:labelValue', value?: string): void;
    (e: 'confirm', value?: LabelValueVo): void;
    (e: 'clear'): void;
}>();

/**
 * label
 */
const labelString = ref<string>('');

/**
 * value
 */
const codeValue = computed<string | number>({
    get: () => props.modelValue,
    set: (value?: string | number) => {
        emits('update:modelValue', value);
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

    list.value = res.data.map((item: LabelValueVo) => ({
        ...item,
        label: item[props.labelKey] ?? '',
        value: item[props.valueKey] ?? '',
    }));

    loading.value = false;
    return true;
}

// ==================== 弹窗 ====================
/**
 * 弹窗实例
 */
const popupRef = ref();

/**
 * 打开弹窗
 */
async function openSelect(): Promise<void> {
    fetch();

    searchValue.value = '';
    scrollTop.value = 0;

    popupRef.value.open();
}

/**
 * 搜索值
 */
const searchValue = ref<string>('');

/**
 * 搜索列表
 */
const searchList = computed(() => {
    return list.value.filter((item: LabelValueVo) => item.label.includes(searchValue.value));
});

/**
 * 当前选中项
 */
function isActive(item: LabelValueVo): boolean {
    return props.modelValue === item.value;
}

/**
 * 选中事件
 */
function handleSelect(item: LabelValueVo): void {
    labelString.value = item.label;
    codeValue.value = item.value;

    emits('update:labelValue', item.label);
    emits('update:modelValue', item.value);
    emits('confirm', item);

    popupRef.value.close();
}

/**
 * 清空事件
 */
function handleClear(): void {
    codeValue.value = '';
    labelString.value = '';

    emits('clear');

    popupRef.value.close();
}

/**
 * 监听 codeValue 的变化，生成 labelString
 */
watchEffect(() => {
    const matchedItem = list.value.find(item => item.value === codeValue.value);

    labelString.value = matchedItem?.label ?? '';
    emits('update:labelValue', labelString.value);
});

/**
 * 页面渲染
 */
onMounted(() => {
    if (props.prefetch) {
        fetch();
    }
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
