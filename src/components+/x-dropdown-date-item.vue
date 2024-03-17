<template>
    <uni-datetime-picker v-model="datetime" type="daterange" @change="handleChange">
        <template #default>
            <view class="content">
                <span class="text-ellipsis"> {{ displayTitle }} </span>
                <view v-if="!isEmpty" class="clear" @click.stop="handleClear">
                    <u-icon class="close__icon" name="close-circle" size="16px"></u-icon>
                </view>
            </view>
        </template>
    </uni-datetime-picker>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

const props = withDefaults(
    defineProps<{
        /** 开始时间 */
        startTime?: string;
        /** 结束时间 */
        endTime?: string;
        /** 标题 */
        title?: string;
    }>(),
    {
        startTime: '',
        endTime: '',
        title: '日期范围',
    },
);

// emits
const emits = defineEmits<{
    (e: 'update:startTime', value?: string): void;
    (e: 'update:endTime', value?: string): void;
    (e: 'change', value: string[]): void;
}>();

const datetime = ref<string[]>([]);

/**
 * 是否为空值
 */
const isEmpty = computed<boolean>(() => datetime.value.length === 0 || datetime.value.every(date => !date));

/**
 * 展示标题
 */
const displayTitle = computed<string>(() => {
    if (isEmpty.value) {
        return props.title;
    }

    return datetime.value.join(' - ');
});

/**
 * 改变时间
 */
function handleChange(value: string[]) {
    emits('update:startTime', value[0]);
    emits('update:endTime', value[1]);
    emits('change', value);
}

/**
 * 清除
 */
function handleClear(): void {
    emits('update:startTime', '');
    emits('update:endTime', '');
    emits('change', []);
}

/**
 * 监听
 */
watchEffect(() => {
    datetime.value = [props.startTime, props.endTime];
});
</script>

<style lang="scss" scoped>
.content {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.text-ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
}

.clear {
    margin-left: 12px;
}

.close__icon {
    margin-right: 5px;
}
</style>
