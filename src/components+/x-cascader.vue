<template>
    <u-form-item :id="$attrs.id ?? prop" :prop="prop" :label="label" :required="required">
        <u-input v-model="optionLabel" clearable readonly border="none" :placeholder="placeholder"></u-input>

        <template #right>
            <u-icon name="arrow-right" size="20px" @click="openSelect"></u-icon>
        </template>

        <uni-popup ref="popupRef" type="bottom">
            <view class="popup">
                <view class="search-line">
                    <view class="action action--error" @click="handleClear">
                        <text>{{ searchCancelText }}</text>
                    </view>

                    <u-search
                        v-model="searchValue"
                        :show-action="false"
                        :placeholder="searchPlaceholder"
                        class="search"
                        clearable
                    ></u-search>

                    <view class="action action--confirm" @click="handleConfirm">
                        <text>{{ searchConfirmText }}</text>
                    </view>
                </view>

                <u-tabs :list="tabs" :current="currentTabIndex" @click="handleTabClick"></u-tabs>

                <view class="select-list">
                    <view v-if="loading" class="loading">
                        <u-loading-icon :text="loadingText" size="25px" text-size="16px"></u-loading-icon>
                    </view>

                    <view v-if="searchValue" class="search">
                        <view
                            v-for="(item, idx) in searchList"
                            :key="idx"
                            class="select-item"
                            :class="{ 'select-item--active': isSearchActive(item) }"
                            @click="handleSelectSearchItem(item)"
                        >
                            <text>{{ item.label }}</text>

                            <u-icon v-if="isSearchActive(item)" name="checkmark" color="#2979ff" size="14px"></u-icon>
                        </view>
                    </view>

                    <view v-else class="current-list">
                        <view
                            v-for="(item, idx) in currentList"
                            :key="idx"
                            class="select-item"
                            :class="{ 'select-item--active': isActive(item) }"
                            @click="handleSelect(item)"
                        >
                            <text>{{ item.label }}</text>

                            <u-icon v-if="isActive(item)" name="checkmark" color="#2979ff" size="14px"></u-icon>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
    </u-form-item>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Numeric } from 'src/constant/base';
import type { PopupInstance, XCascaderOption, XCascaderTab } from './interface';

const DEFAULT_TAB: XCascaderTab = {
    name: '请选择',
};

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue?: any;
        /** label */
        labelValue?: any;
        /** 表单标题 */
        label?: string;
        /** 表单属性 */
        prop?: string;
        /** 是否必填 */
        required?: boolean;
        /** 占位符 */
        placeholder?: string;
        /** label key */
        labelKey?: string;
        /** value key */
        valueKey?: string;
        /** children key */
        childrenKey?: string;
        /** 下拉接口 */
        api?: (data: any) => Promise<any>;
        /** 下拉接口参数 */
        params?: Record<string, string>;
        /** 下拉列表 */
        options?: any[];
        /** 返回类型 */
        returnType?: 'node' | 'nodes';
        /** 是否预加载数据 */
        preloadData?: boolean;
        /** 取消查询文本 */
        searchCancelText?: string;
        /** 确认查询文本 */
        searchConfirmText?: string;
        /** 查询占位符 */
        searchPlaceholder?: string;
        /** 加载中文本 */
        loadingText?: string;
    }>(),
    {
        modelValue: undefined,
        labelValue: undefined,
        prop: '',
        label: '',
        required: false,
        labelKey: 'label',
        valueKey: 'value',
        childrenKey: 'children',
        options: () => [],
        api: undefined,
        params: undefined,
        returnType: 'node',
        preloadData: false,
        placeholder: '点击选择',
        searchCancelText: '清空',
        searchConfirmText: '确定',
        searchPlaceholder: '请输入关键字',
        loadingText: '加载中',
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: Numeric | Numeric[]): void;
    (e: 'update:labelValue', value?: Numeric | Numeric[]): void;
}>();

/**
 * label
 */
const optionLabel = ref<Numeric | undefined>();

/**
 * 弹窗实例
 */
const popupRef = ref<PopupInstance>();

/**
 * 下拉列表
 */
const list = ref<XCascaderOption[]>([]);

/**
 * 当前展示数据列表
 */
const currentList = computed<XCascaderOption[]>(() => {
    // 当前为第一列
    if (currentTabIndex.value === 0) {
        return list.value;
    }

    return selectedItems.value[currentTabIndex.value - 1].children ?? [];
});

/**
 * 查询选项类型
 */
interface SearchOption {
    label?: Numeric;
    value: XCascaderOption[];
}

/**
 * 查询字符串
 */
const searchValue = ref<string>('');

/**
 * 查询列表
 */
const searchList = computed<SearchOption[]>(() =>
    searchAllList.value.filter(item => {
        if (item.label) {
            return item.label.toString().includes(searchValue.value);
        }

        return false;
    }),
);

/**
 * 查询所有列表
 */
const searchAllList = ref<SearchOption[]>([]);

/**
 * 级联 tab
 */
const tabs = computed<XCascaderTab[]>(() => {
    if (selectedItems.value.length === 0) {
        return [DEFAULT_TAB];
    }

    const lastItem = selectedItems.value[selectedItems.value.length - 1];
    const tabList: XCascaderTab[] = selectedItems.value.map(item => ({
        name: item.label,
        selectedValue: item.value,
    }));

    if (lastItem.children) {
        tabList.push(DEFAULT_TAB);
    }

    return tabList;
});

/**
 * 当前 tab下标
 */
const currentTabIndex = ref<number>(0);

/**
 * 选中项
 */
const selectedItems = ref<XCascaderOption[]>([]);

/**
 * 初始化赋值
 */
function handleInit() {
    if (props.returnType === 'node') {
        const matchedItem = searchAllList.value.find(item => item.value.slice(-1)[0].value === props.modelValue);

        if (matchedItem) {
            selectedItems.value = matchedItem.value;
            optionLabel.value = matchedItem.value.slice(-1)[0].label;
            currentTabIndex.value = selectedItems.value.length - 1;
        }
    }

    if (props.returnType === 'nodes') {
        const externalValue = props.modelValue;

        if (externalValue && Array.isArray(externalValue)) {
            const matchedItem = searchAllList.value.find(item =>
                item.value.every(val => externalValue.includes(val.value ?? '')),
            );

            if (matchedItem) {
                selectedItems.value = matchedItem.value;
                optionLabel.value = matchedItem.value.map(val => val.label).join('/');
                currentTabIndex.value = selectedItems.value.length - 1;
            }
        }
    }
}

const loading = ref<boolean>(false);

/**
 * 生成查询数组
 */
function generateSearchList(): void {
    const result: SearchOption[] = [];

    const getList = (list: XCascaderOption[], parents?: XCascaderOption[]) => {
        result.push(
            ...list.map(item => {
                if (item.children) {
                    getList(item.children, parents ? [...parents, item] : [item]);
                }

                if (parents && parents.length > 0) {
                    return {
                        label: [...parents.map(p => p.label), item.label].join('/'),
                        value: [...parents, item],
                    };
                } else {
                    return {
                        label: item.label,
                        value: [item],
                    };
                }
            }),
        );
    };

    getList(list.value);
    searchAllList.value = result;
}

/**
 * 转换数组为可用 list
 */
function transformList(list: any[]): XCascaderOption[] {
    return list.map(item => {
        const childList = item[props.childrenKey];

        if (childList && childList.length > 0) {
            const children = transformList(childList);

            return {
                label: item[props.labelKey] ?? '',
                value: item[props.valueKey] ?? '',
                children,
            };
        } else {
            return {
                label: item[props.labelKey] ?? '',
                value: item[props.valueKey] ?? '',
            };
        }
    });
}

/**
 * 获取接口数据
 */
async function loadData(): Promise<void> {
    if (!props.api) {
        list.value = transformList(props.options);
        generateSearchList();
        return;
    }

    loading.value = true;
    const res = await props.api(props.params);

    if (!res) {
        loading.value = false;
        return;
    }

    list.value = transformList(res.data);
    loading.value = false;
    generateSearchList();
    return;
}

/**
 * 打开选择器
 */
async function openSelect(): Promise<void> {
    loadData();
    handleInit();
    popupRef.value?.open();
}

/**
 * tab click
 */
function handleTabClick({ index }: any): void {
    currentTabIndex.value = index;
}

/**
 * 选中列表
 */
function handleSelect(item: XCascaderOption): void {
    selectedItems.value = selectedItems.value.slice(0, currentTabIndex.value);
    selectedItems.value.push(item);

    if (item.children) {
        currentTabIndex.value += 1;
    }
}

/**
 * 选中查询列表
 */
function handleSelectSearchItem(item: SearchOption): void {
    selectedItems.value = item.value;
}

/**
 * 选中值
 */
function isActive(item: XCascaderOption): boolean {
    return selectedItems.value.includes(item);
}

/**
 * 查询列表选中值
 */
function isSearchActive(item: SearchOption): boolean {
    return selectedItems.value.every(selectedItem => item.value.includes(selectedItem));
}

/**
 * 清空
 */
function handleClear(): void {
    optionLabel.value = undefined;
    emits('update:labelValue', undefined);
    emits('update:modelValue', undefined);
    popupRef.value?.close();
}

/**
 * 清空
 */
function handleConfirm(): void {
    if (selectedItems.value.length === 0) {
        return;
    }

    if (props.returnType === 'node') {
        const lastItem = selectedItems.value[selectedItems.value.length - 1];
        optionLabel.value = lastItem.label;

        emits('update:modelValue', lastItem.value);
        emits('update:labelValue', lastItem.label);
    }

    if (props.returnType === 'nodes') {
        emits(
            'update:modelValue',
            selectedItems.value.map(val => val.value ?? ''),
        );

        const label = selectedItems.value.map(val => val.label).join('/');
        optionLabel.value = label;
        emits('update:labelValue', label);
    }

    popupRef.value?.close();
}

/**
 * 页面挂载
 */
onMounted(() => {
    if (props.preloadData) {
        loadData();
    }
});
</script>

<style lang="scss" scoped>
.popup {
    background-color: #fff;
}

.search-line {
    display: flex;
    align-items: center;
    height: 50px;
}

.action {
    width: 50px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.select-list {
    height: 240px;
    overflow-y: scroll;
}

.select-item {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;

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

.select-item--active {
    color: $u-primary;
}

.action--error {
    color: $u-error;
}

.action--confirm {
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
./interface
