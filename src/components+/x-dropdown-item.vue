<template>
    <view class="item" @click="handleClick">
        <view id="title" class="title">
            <view class="title-text">{{ selectedLabel }}</view>
        </view>

        <view v-if="visible" class="down" :style="dropdownStyle">
            <view class="mask"></view>
            <view class="list" :style="listStyle">
                <view
                    v-for="(item, index) in options"
                    :key="index"
                    class="li"
                    :class="{ 'is-active': selected(item) }"
                    @click.stop="handleSelect(item)"
                >
                    <view class="label">{{ item.label }}</view>
                    <view v-if="selected(item)" class="icon">
                        <uni-icons type="checkmarkempty" size="14px" color="#007aff"></uni-icons>
                    </view>
                </view>
                <view v-if="isEmpty" class="empty"> {{ emptyText }} </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { type CSSProperties, getCurrentInstance, watchEffect, onMounted, computed, inject, ref } from 'vue';
import type { Numeric } from 'src/constant/base';
import { DROPDOWN_MENU, type DropdownItem, type DropdownMenuProvider } from './dropdown';

const instance = getCurrentInstance();
const providers = inject<DropdownMenuProvider>(DROPDOWN_MENU);

providers?.addChild(instance?.uid);

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue: any;
        /** 标题 */
        label?: string;
        /** 空数据提示 */
        emptyText?: string;
        /** 下拉列表 */
        options?: DropdownItem[];
    }>(),
    {
        modelValue: '',
        label: '',
        emptyText: '暂无数据',
        options: () => [],
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: Numeric): void;
    (e: 'change', item: DropdownItem): void;
    (e: 'update:label', value?: string): void;
}>();

function handleClick(): void {
    if (!providers || !instance) {
        return;
    }

    // 选中
    if (providers.activeChildId.value === instance.uid) {
        providers.activeChildId.value = -1;
    } else {
        providers.activeChildId.value = instance?.uid;
    }
}

const visible = computed<boolean>(() => providers?.activeChildId.value === instance?.uid);

const isEmpty = computed<boolean>(() => props.options.length === 0);

/**
 * 元素距离顶部距离
 */
const itemTop = ref<number>(0);

const dropdownStyle = computed<CSSProperties>(() => ({
    height: `calc(100vh - ${itemTop.value + 93}px)`,
}));

const listStyle = computed<CSSProperties>(() => ({
    maxHeight: `calc(100vh - ${itemTop.value + 93}px)`,
}));

/**
 * 是否选中
 */
function selected(item: DropdownItem): boolean {
    return item.value === props.modelValue;
}

/**
 * label 展示
 */
const selectedLabel = ref<string>();

watchEffect(() => {
    const matchedItem = props.options.find(col => col.value === props.modelValue);

    if (matchedItem) {
        selectedLabel.value = matchedItem.label;
        emits('update:label', matchedItem.label);
    }
});

/**
 * 选中
 */
function handleSelect(item: DropdownItem): void {
    if (props.modelValue !== item.value) {
        emits('update:modelValue', item.value);
        emits('change', item);
    }

    // 关闭
    if (providers) {
        providers.activeChildId.value = -1;
    }
}

onMounted(() => {
    const ins = getCurrentInstance();
    const query = uni.createSelectorQuery().in(ins);

    query
        .select('.item')
        .boundingClientRect(data => {
            // eslint-disable-next-line no-undef
            const { top } = data as UniApp.NodeInfo;

            itemTop.value = top ?? 0;
        })
        .exec();
});
</script>

<style lang="scss" scoped>
.item {
    flex: 1;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    min-width: 0;
    color: #323233;
    font-size: 14px;
}

.title {
    position: relative;
    padding: 0 10px;
    max-width: 100%;
}

.title::after {
    position: absolute;
    top: 50%;
    right: -4px;
    margin-top: -5px;
    border: 3px solid;
    border-color: transparent transparent #dcdee0 #dcdee0;
    transform: rotate(-45deg);
    opacity: 0.8;
    content: '';
}

.title-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.down {
    position: absolute;
    z-index: 1000;
    left: 0;
    top: 50px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.mask {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    overflow-y: scroll;
    transition: all 0.2;
}

.li {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 16px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background: #fff;
}

.is-active {
    color: $uni-color-primary;
}

.li::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    transform: scaleY(0.5);
}

.label {
    flex: 1;
}

.icon {
    flex: 1;
    text-align: right;
}

.empty {
    display: flex;
    height: 50px;
    justify-content: center;
    align-items: center;
    color: $uni-text-color-grey;
}
</style>
